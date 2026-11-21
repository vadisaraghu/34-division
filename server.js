// 34 Division - voter verification portal
const path = require('path');
const fs = require('fs');

// Minimal .env loader (no extra dependency) for local development.
const envFile = path.join(__dirname, '.env');
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

const crypto = require('crypto');
const express = require('express');
const bcrypt = require('bcryptjs');
const { pool, migrate } = require('./src/db');
const { findDuplicates, SELECT_VOTER } = require('./src/duplicates');
const { validateVoter, nameKey, normMobile, normSerial, normStreet, clean } = require('./src/normalize');

const PORT = process.env.PORT || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';
const SESSION_DAYS = 30;
const TZ = 'Asia/Kolkata';

const app = express();
app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(express.json({ limit: '5mb' }));

// ---------- security headers ----------
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'same-origin');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'"
  );
  if (IS_PROD) res.setHeader('Strict-Transport-Security', 'max-age=31536000');
  next();
});

// ---------- helpers ----------
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const sha256 = (s) => crypto.createHash('sha256').update(s).digest('hex');

function parseCookies(header = '') {
  const out = {};
  for (const part of header.split(';')) {
    const i = part.indexOf('=');
    if (i > 0) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}

function setSessionCookie(res, token, maxAgeSec) {
  const attrs = [`sid=${token}`, 'Path=/', 'HttpOnly', 'SameSite=Lax', `Max-Age=${maxAgeSec}`];
  if (IS_PROD) attrs.push('Secure');
  res.setHeader('Set-Cookie', attrs.join('; '));
}

// Basic CSRF defence: state-changing requests must carry our custom header,
// which browsers will not send cross-site without a CORS preflight.
app.use('/api', (req, res, next) => {
  if (req.method !== 'GET' && req.get('X-Requested-With') !== '34div') {
    return res.status(403).json({ error: 'Bad request origin.' });
  }
  next();
});

async function auth(req, res, next) {
  try {
    const token = parseCookies(req.headers.cookie).sid;
    if (!token) return res.status(401).json({ error: 'Please sign in.' });
    const { rows } = await pool.query(
      `SELECT u.id, u.username, u.full_name, u.role FROM sessions s JOIN users u ON u.id = s.user_id
       WHERE s.token_hash = $1 AND s.expires_at > now() AND u.active AND u.approved`,
      [sha256(token)]
    );
    if (!rows[0]) return res.status(401).json({ error: 'Session expired. Please sign in again.' });
    req.user = rows[0];
    next();
  } catch (e) {
    next(e);
  }
}

const adminOnly = (req, res, next) =>
  req.user.role === 'admin' ? next() : res.status(403).json({ error: 'Only the admin can do this.' });

// ---------- login rate limiting ----------
const attempts = new Map();
function tooManyAttempts(key) {
  const now = Date.now();
  const a = attempts.get(key);
  if (!a || a.reset < now) {
    attempts.set(key, { count: 1, reset: now + 15 * 60 * 1000 });
    return false;
  }
  a.count++;
  return a.count > 10;
}

// ---------- auth routes ----------
app.post('/api/login', wrap(async (req, res) => {
  const username = clean(req.body.username).toLowerCase();
  const password = String(req.body.password ?? '');
  if (tooManyAttempts(req.ip + '|' + username)) {
    return res.status(429).json({ error: 'Too many attempts. Try again in 15 minutes.' });
  }
  const { rows } = await pool.query('SELECT * FROM users WHERE username = $1 AND active', [username]);
  const user = rows[0];
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ error: 'Wrong username or password.' });
  }
  if (!user.approved) {
    return res.status(403).json({ error: 'Your account is waiting for admin approval. Please ask your admin to approve it.', pending: true });
  }
  await startSession(res, user.id);
  res.json({ user: { id: user.id, username: user.username, full_name: user.full_name, role: user.role } });
}));

async function startSession(res, userId) {
  const token = crypto.randomBytes(32).toString('base64url');
  await pool.query(
    `INSERT INTO sessions (token_hash, user_id, expires_at) VALUES ($1, $2, now() + interval '${SESSION_DAYS} days')`,
    [sha256(token), userId]
  );
  await pool.query('DELETE FROM sessions WHERE expires_at < now()');
  setSessionCookie(res, token, SESSION_DAYS * 86400);
}

// Shared validation for the setup, sign-up and admin "add volunteer" forms.
function validateNewUser(body) {
  const username = clean(body.username).toLowerCase();
  const full_name = clean(body.full_name);
  const password = String(body.password ?? '');
  const mobile = normMobile(body.mobile);
  if (full_name.length < 2) return { error: 'Enter your full name.' };
  if (!/^[a-z0-9._-]{3,30}$/.test(username)) return { error: 'Username: 3-30 letters/numbers, no spaces.' };
  if (password.length < 6) return { error: 'Password must be at least 6 characters.' };
  if (body.mobile && !/^[6-9]\d{9}$/.test(mobile)) return { error: 'Enter a valid 10-digit mobile number.' };
  return { value: { username, full_name, password, mobile } };
}

// ---------- first-time setup & volunteer sign-up ----------
app.get('/api/setup-status', wrap(async (req, res) => {
  const { rows } = await pool.query('SELECT count(*)::int AS n FROM users');
  res.json({ needs_setup: rows[0].n === 0 });
}));

// Creates the very first account (the admin). Only works while there are no users.
app.post('/api/setup', wrap(async (req, res) => {
  const { value: u, error } = validateNewUser(req.body);
  if (error) return res.status(400).json({ error });
  const client = await pool.connect();
  let id;
  try {
    await client.query('BEGIN');
    await client.query('SELECT pg_advisory_xact_lock(35)');
    const { rows } = await client.query('SELECT count(*)::int AS n FROM users');
    if (rows[0].n > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({ error: 'Setup is already complete. Please sign in.' });
    }
    const r = await client.query(
      "INSERT INTO users (username, full_name, password_hash, mobile, role, approved) VALUES ($1,$2,$3,$4,'admin',TRUE) RETURNING id",
      [u.username, u.full_name, await bcrypt.hash(u.password, 10), u.mobile]
    );
    id = r.rows[0].id;
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK').catch(() => {});
    throw e;
  } finally {
    client.release();
  }
  await startSession(res, id);
  res.status(201).json({ user: { id, username: u.username, full_name: u.full_name, role: 'admin' } });
}));

// Volunteer self-registration: account stays locked until an admin approves it.
app.post('/api/signup', wrap(async (req, res) => {
  if (tooManyAttempts('signup|' + req.ip)) return res.status(429).json({ error: 'Too many attempts. Try again later.' });
  const { value: u, error } = validateNewUser(req.body);
  if (error) return res.status(400).json({ error });
  const { rows } = await pool.query('SELECT count(*)::int AS n FROM users');
  if (rows[0].n === 0) return res.status(409).json({ error: 'The admin account has not been set up yet.' });
  try {
    await pool.query(
      "INSERT INTO users (username, full_name, password_hash, mobile, role, approved) VALUES ($1,$2,$3,$4,'volunteer',FALSE)",
      [u.username, u.full_name, await bcrypt.hash(u.password, 10), u.mobile]
    );
  } catch (e) {
    if (e.code === '23505') return res.status(409).json({ error: 'That username is taken. Try another one.' });
    throw e;
  }
  res.status(201).json({ ok: true });
}));

app.post('/api/logout', wrap(async (req, res) => {
  const token = parseCookies(req.headers.cookie).sid;
  if (token) await pool.query('DELETE FROM sessions WHERE token_hash = $1', [sha256(token)]);
  setSessionCookie(res, '', 0);
  res.json({ ok: true });
}));

app.get('/api/me', auth, (req, res) => res.json({ user: req.user }));

app.post('/api/me/password', auth, wrap(async (req, res) => {
  const { current, next: nextPw } = req.body;
  if (String(nextPw ?? '').length < 6) return res.status(400).json({ error: 'New password must be at least 6 characters.' });
  const { rows } = await pool.query('SELECT password_hash FROM users WHERE id = $1', [req.user.id]);
  if (!(await bcrypt.compare(String(current ?? ''), rows[0].password_hash))) {
    return res.status(400).json({ error: 'Current password is wrong.' });
  }
  await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [await bcrypt.hash(nextPw, 10), req.user.id]);
  res.json({ ok: true });
}));

// ---------- dashboard ----------
app.get('/api/stats', auth, wrap(async (req, res) => {
  const [totals, today, streets, volunteers, daily, recent, pending] = await Promise.all([
    pool.query(`
      SELECT count(*)::int AS voters,
             count(DISTINCT mobile)::int AS families,
             COALESCE((SELECT sum(fv) FROM (SELECT max(family_votes) fv FROM voters GROUP BY mobile) f), 0)::int AS family_votes,
             count(DISTINCT street_key)::int AS streets
      FROM voters`),
    pool.query(`SELECT count(*)::int AS n FROM voters WHERE (verified_at AT TIME ZONE '${TZ}')::date = (now() AT TIME ZONE '${TZ}')::date`),
    pool.query(`SELECT min(street) AS street, count(*)::int AS voters, count(DISTINCT mobile)::int AS families
                FROM voters GROUP BY street_key ORDER BY voters DESC LIMIT 8`),
    pool.query(`SELECT u.full_name, count(v.id)::int AS n FROM users u JOIN voters v ON v.verified_by = u.id
                GROUP BY u.id ORDER BY n DESC LIMIT 6`),
    pool.query(`SELECT to_char(d, 'YYYY-MM-DD') AS day, COALESCE(c.n, 0)::int AS n
                FROM generate_series((now() AT TIME ZONE '${TZ}')::date - 6, (now() AT TIME ZONE '${TZ}')::date, '1 day') d
                LEFT JOIN (SELECT (verified_at AT TIME ZONE '${TZ}')::date AS day, count(*) n FROM voters GROUP BY 1) c
                ON c.day = d::date ORDER BY d`),
    pool.query(`${SELECT_VOTER} ORDER BY v.verified_at DESC LIMIT 6`),
    pool.query('SELECT count(*)::int AS n FROM review_queue'),
  ]);
  const money = (await pool.query(
    'SELECT count(*) FILTER (WHERE money_given)::int AS given, count(*)::int AS total FROM voters'
  )).rows[0];
  const pendingUsers = req.user.role === 'admin'
    ? (await pool.query('SELECT count(*)::int AS n FROM users WHERE NOT approved')).rows[0].n
    : 0;
  res.json({
    ...totals.rows[0],
    today: today.rows[0].n,
    pending_review: pending.rows[0].n,
    pending_users: pendingUsers,
    money_given: money.given,
    money_total: money.total,
    top_streets: streets.rows,
    volunteers: volunteers.rows,
    daily: daily.rows,
    recent: recent.rows,
  });
}));

// ---------- voters ----------
// Creates the family for this mobile if it doesn't exist yet (the creator is
// the volunteer who adds its first member). Returns { id, created }.
async function ensureFamily(client, mobile, userId) {
  const { rows } = await client.query(
    `INSERT INTO families (mobile, created_by) VALUES ($1, $2)
     ON CONFLICT (mobile) DO UPDATE SET mobile = EXCLUDED.mobile
     RETURNING id, (xmax = 0) AS created`,
    [mobile, userId]
  );
  return rows[0];
}

async function insertVoter(client, v, userId, reviewedIds = []) {
  const fam = await ensureFamily(client, v.mobile, userId);
  const { rows } = await client.query(
    `INSERT INTO voters (name, name_key, serial_no, mobile, street, street_key, family_votes, notes, reviewed_matches, verified_by)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id`,
    [v.name, v.name_key, v.serial_no, v.mobile, v.street, v.street_key, v.family_votes, v.notes, reviewedIds, userId]
  );
  return { id: rows[0].id, family_id: fam.id, family_created: fam.created };
}

// "F-0012", "f12", "12" -> 12 ; anything else -> null
function parseFamilyId(q) {
  const m = String(q || '').trim().match(/^f?\s*-?\s*0*(\d{1,9})$/i);
  return m ? Number(m[1]) : null;
}

// Live check while the volunteer types (fields may be partial).
app.post('/api/voters/check', auth, wrap(async (req, res) => {
  const b = req.body;
  const v = {
    name_key: nameKey(b.name),
    serial_no: normSerial(b.serial_no) || null, // NULL never equals anything in SQL
    mobile: normMobile(b.mobile).length === 10 ? normMobile(b.mobile) : null,
    street_key: normStreet(b.street),
  };
  if (v.name_key.length < 3 && !v.serial_no && !v.mobile) {
    return res.json({ level: 'none', matches: [] });
  }
  res.json(await findDuplicates(v, { excludeId: b.exclude_id ? Number(b.exclude_id) : null }));
}));

app.post('/api/voters', auth, wrap(async (req, res) => {
  const { value: v, error } = validateVoter(req.body);
  if (error) return res.status(400).json({ error });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // Serialise inserts so two volunteers can't save the same voter at the same instant.
    await client.query('SELECT pg_advisory_xact_lock(34)');
    const dup = await findDuplicates(v, { client });

    if (dup.level === 'exact') {
      await client.query('ROLLBACK');
      return res.status(409).json({ error: 'This voter is already verified.', ...dup });
    }
    if (dup.level !== 'none' && req.body.confirm_different !== true) {
      await client.query('ROLLBACK');
      return res.status(409).json({ error: 'Possible duplicate - please review.', needs_confirmation: true, ...dup });
    }
    const saved = await insertVoter(client, v, req.user.id, dup.matches.map((m) => m.id));
    await client.query('COMMIT');
    res.status(201).json(saved);
  } catch (e) {
    await client.query('ROLLBACK').catch(() => {});
    if (e.code === '23505') return res.status(409).json({ error: 'This voter is already verified.', level: 'exact', matches: [] });
    throw e;
  } finally {
    client.release();
  }
}));

app.get('/api/voters', auth, wrap(async (req, res) => {
  const q = clean(req.query.q);
  const street = clean(req.query.street);
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  const size = 30;
  const params = [];
  const where = [];

  if (q) {
    const digits = q.replace(/\D/g, '');
    params.push(`%${q.toLowerCase()}%`);
    const p = params.length;
    const conds = [`lower(v.name) LIKE $${p}`, `lower(v.serial_no) LIKE $${p}`, `lower(v.street) LIKE $${p}`];
    if (digits.length >= 3) {
      params.push(`%${digits}%`);
      conds.push(`v.mobile LIKE $${params.length}`);
    }
    const fid = parseFamilyId(q);
    if (fid !== null) {
      params.push(fid);
      conds.push(`f.id = $${params.length}`);
    }
    where.push(`(${conds.join(' OR ')})`);
  }
  if (street) {
    params.push(normStreet(street));
    where.push(`v.street_key = $${params.length}`);
  }
  if (req.query.mobile) {
    params.push(normMobile(req.query.mobile));
    where.push(`v.mobile = $${params.length}`);
  }
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const [list, count] = await Promise.all([
    pool.query(`${SELECT_VOTER} ${whereSql} ORDER BY v.verified_at DESC LIMIT ${size} OFFSET ${(page - 1) * size}`, params),
    pool.query(`SELECT count(*)::int AS n FROM voters v LEFT JOIN families f ON f.mobile = v.mobile ${whereSql}`, params),
  ]);
  res.json({ voters: list.rows, total: count.rows[0].n, page, pages: Math.max(1, Math.ceil(count.rows[0].n / size)) });
}));

app.get('/api/streets', auth, wrap(async (req, res) => {
  const { rows } = await pool.query(
    'SELECT min(street) AS street, count(*)::int AS voters FROM voters GROUP BY street_key ORDER BY min(street)'
  );
  res.json(rows);
}));

app.put('/api/voters/:id', auth, adminOnly, wrap(async (req, res) => {
  const id = Number(req.params.id);
  const { value: v, error } = validateVoter(req.body);
  if (error) return res.status(400).json({ error });
  const dup = await findDuplicates(v, { excludeId: id });
  if (dup.level === 'exact') return res.status(409).json({ error: 'Another verified voter already has these details.', ...dup });
  await ensureFamily(pool, v.mobile, req.user.id);
  try {
    const r = await pool.query(
      `UPDATE voters SET name=$1, name_key=$2, serial_no=$3, mobile=$4, street=$5, street_key=$6, family_votes=$7, notes=$8, updated_at=now()
       WHERE id=$9`,
      [v.name, v.name_key, v.serial_no, v.mobile, v.street, v.street_key, v.family_votes, v.notes, id]
    );
    if (!r.rowCount) return res.status(404).json({ error: 'Voter not found.' });
  } catch (e) {
    if (e.code === '23505') return res.status(409).json({ error: 'Another verified voter already has this name and serial number.' });
    throw e;
  }
  res.json({ ok: true });
}));

app.delete('/api/voters/:id', auth, adminOnly, wrap(async (req, res) => {
  await pool.query('DELETE FROM voters WHERE id = $1', [Number(req.params.id)]);
  res.json({ ok: true });
}));

// ---------- families ----------
const FAMILY_SELECT = `
  SELECT f.id, f.mobile, f.created_at, cu.full_name AS created_by_name,
         count(v.id)::int AS member_count, max(v.family_votes)::int AS family_votes, min(v.street) AS street,
         count(v.id) FILTER (WHERE v.money_given)::int AS money_count,
         json_agg(json_build_object('id', v.id, 'name', v.name, 'serial_no', v.serial_no,
                  'verified_by_name', vu.full_name, 'verified_at', v.verified_at,
                  'money_given', v.money_given, 'money_at', v.money_at, 'money_by_name', mu.full_name)
                  ORDER BY v.verified_at) AS members
  FROM families f
  JOIN voters v ON v.mobile = f.mobile
  LEFT JOIN users vu ON vu.id = v.verified_by
  LEFT JOIN users mu ON mu.id = v.money_by
  LEFT JOIN users cu ON cu.id = f.created_by`;
const FAMILY_GROUP = 'GROUP BY f.id, cu.full_name';

app.get('/api/families', auth, wrap(async (req, res) => {
  const q = clean(req.query.q);
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  const size = 20;
  const params = [];
  const where = ['EXISTS (SELECT 1 FROM voters x WHERE x.mobile = f.mobile)'];

  if (q) {
    params.push(`%${q.toLowerCase()}%`);
    const p = params.length;
    const conds = [`EXISTS (SELECT 1 FROM voters x WHERE x.mobile = f.mobile AND
      (lower(x.name) LIKE $${p} OR lower(x.serial_no) LIKE $${p} OR lower(x.street) LIKE $${p}))`];
    const digits = q.replace(/\D/g, '');
    if (digits.length >= 3) {
      params.push(`%${digits}%`);
      conds.push(`f.mobile LIKE $${params.length}`);
    }
    const fid = parseFamilyId(q);
    if (fid !== null) {
      params.push(fid);
      conds.push(`f.id = $${params.length}`);
    }
    where.push(`(${conds.join(' OR ')})`);
  }
  // money=done: every member ticked ; money=pending: at least one member not ticked
  if (req.query.money === 'done') where.push('NOT EXISTS (SELECT 1 FROM voters x WHERE x.mobile = f.mobile AND NOT x.money_given)');
  if (req.query.money === 'pending') where.push('EXISTS (SELECT 1 FROM voters x WHERE x.mobile = f.mobile AND NOT x.money_given)');
  if (req.query.street) {
    params.push(normStreet(req.query.street));
    where.push(`EXISTS (SELECT 1 FROM voters x WHERE x.mobile = f.mobile AND x.street_key = $${params.length})`);
  }
  if (req.query.mine === '1') {
    params.push(req.user.id);
    where.push(`f.created_by = $${params.length}`);
  }
  const whereSql = `WHERE ${where.join(' AND ')}`;
  const [list, count] = await Promise.all([
    pool.query(`${FAMILY_SELECT} ${whereSql} ${FAMILY_GROUP}
                ORDER BY f.id DESC LIMIT ${size} OFFSET ${(page - 1) * size}`, params),
    pool.query(`SELECT count(*)::int AS n FROM families f ${whereSql}`, params),
  ]);
  res.json({ families: list.rows, total: count.rows[0].n, page, pages: Math.max(1, Math.ceil(count.rows[0].n / size)) });
}));

app.get('/api/families/:id', auth, wrap(async (req, res) => {
  const { rows } = await pool.query(`${FAMILY_SELECT} WHERE f.id = $1 ${FAMILY_GROUP}`, [Number(req.params.id)]);
  if (!rows[0]) return res.status(404).json({ error: 'Family not found.' });
  res.json({ family: rows[0] });
}));

// Tick / untick "money given" for ONE voter. Anyone can tick; only the admin can untick.
app.post('/api/voters/:id/money', auth, wrap(async (req, res) => {
  const id = Number(req.params.id);
  const given = req.body.given === true;
  if (!given && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Only the admin can untick money. Ask your admin if this was a mistake.' });
  }
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows } = await client.query(
      `SELECT v.money_given, u.full_name AS money_by_name FROM voters v
       LEFT JOIN users u ON u.id = v.money_by WHERE v.id = $1 FOR UPDATE OF v`,
      [id]
    );
    if (!rows[0]) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Voter not found.' });
    }
    if (rows[0].money_given === given) {
      await client.query('ROLLBACK');
      return res.status(409).json({
        error: given ? `Already ticked by ${rows[0].money_by_name || 'someone'}.` : 'Money is already unticked.',
      });
    }
    await client.query(
      given
        ? 'UPDATE voters SET money_given = TRUE, money_by = $2, money_at = now() WHERE id = $1'
        : 'UPDATE voters SET money_given = FALSE, money_by = NULL, money_at = NULL WHERE id = $1',
      given ? [id, req.user.id] : [id]
    );
    await client.query('INSERT INTO money_log (voter_id, given, user_id) VALUES ($1, $2, $3)', [id, given, req.user.id]);
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK').catch(() => {});
    throw e;
  } finally {
    client.release();
  }
  const { rows } = await pool.query(`${SELECT_VOTER} WHERE v.id = $1`, [id]);
  res.json({ voter: rows[0] });
}));

app.get('/api/voters/:id/money-log', auth, wrap(async (req, res) => {
  const { rows } = await pool.query(
    `SELECT l.given, l.at, u.full_name AS by_name FROM money_log l
     LEFT JOIN users u ON u.id = l.user_id WHERE l.voter_id = $1 ORDER BY l.at DESC LIMIT 50`,
    [Number(req.params.id)]
  );
  res.json(rows);
}));

// ---------- bulk upload & review queue ----------
app.post('/api/import', auth, adminOnly, wrap(async (req, res) => {
  const rows = Array.isArray(req.body.rows) ? req.body.rows.slice(0, 1000) : [];
  const result = { added: 0, already_verified: 0, queued: 0, invalid: [] };
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('SELECT pg_advisory_xact_lock(34)');
    for (let i = 0; i < rows.length; i++) {
      const { value: v, error } = validateVoter(rows[i]);
      if (error) {
        result.invalid.push({ row: rows[i].__row ?? i + 1, error });
        continue;
      }
      const dup = await findDuplicates(v, { client });
      if (dup.level === 'exact') result.already_verified++;
      else if (dup.level !== 'none') {
        await client.query('INSERT INTO review_queue (data, match_ids, uploaded_by) VALUES ($1, $2, $3)', [
          v, dup.matches.map((m) => m.id), req.user.id,
        ]);
        result.queued++;
      } else {
        await insertVoter(client, v, req.user.id);
        result.added++;
      }
    }
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK').catch(() => {});
    throw e;
  } finally {
    client.release();
  }
  res.json(result);
}));

app.get('/api/review', auth, wrap(async (req, res) => {
  const { rows } = await pool.query(
    `SELECT r.id, r.data, r.created_at, u.full_name AS uploaded_by_name
     FROM review_queue r LEFT JOIN users u ON u.id = r.uploaded_by ORDER BY r.id LIMIT 20`
  );
  // Re-run the check so matches reflect the latest data.
  const items = [];
  for (const r of rows) items.push({ ...r, ...(await findDuplicates(r.data)) });
  const { rows: c } = await pool.query('SELECT count(*)::int AS n FROM review_queue');
  res.json({ items, total: c[0].n });
}));

app.post('/api/review/:id/:action', auth, wrap(async (req, res) => {
  const id = Number(req.params.id);
  const action = req.params.action;
  if (!['accept', 'discard'].includes(action)) return res.status(404).json({ error: 'Unknown action.' });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('SELECT pg_advisory_xact_lock(34)');
    const { rows } = await client.query('SELECT data FROM review_queue WHERE id = $1 FOR UPDATE', [id]);
    if (!rows[0]) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Already handled by someone else.' });
    }
    if (action === 'accept') {
      const v = rows[0].data;
      const dup = await findDuplicates(v, { client });
      if (dup.level === 'exact') {
        await client.query('DELETE FROM review_queue WHERE id = $1', [id]);
        await client.query('COMMIT');
        return res.status(409).json({ error: 'This voter was already verified - removed from the queue.' });
      }
      await insertVoter(client, v, req.user.id, dup.matches.map((m) => m.id));
    }
    await client.query('DELETE FROM review_queue WHERE id = $1', [id]);
    await client.query('COMMIT');
    res.json({ ok: true });
  } catch (e) {
    await client.query('ROLLBACK').catch(() => {});
    throw e;
  } finally {
    client.release();
  }
}));

app.get('/api/export.csv', auth, adminOnly, wrap(async (req, res) => {
  const { rows } = await pool.query(
    `SELECT v.name, v.serial_no, v.mobile, v.street, v.family_votes, v.notes, v.verified_at,
            u.full_name AS verified_by_name, f.id AS family_id, cu.full_name AS family_created_by,
            v.money_given, mu.full_name AS money_by_name, v.money_at
     FROM voters v LEFT JOIN users u ON u.id = v.verified_by
     LEFT JOIN families f ON f.mobile = v.mobile
     LEFT JOIN users cu ON cu.id = f.created_by
     LEFT JOIN users mu ON mu.id = v.money_by
     ORDER BY f.id, v.verified_at`
  );
  const esc = (s) => `"${String(s ?? '').replace(/"/g, '""')}"`;
  const when = (d) => (d ? new Date(d).toLocaleString('en-IN', { timeZone: TZ }) : '');
  const fid = (n) => (n ? `F-${String(n).padStart(4, '0')}` : '');
  const lines = ['Family ID,Name,Serial No,Mobile,Street,Family Votes,Notes,Verified By,Verified At,Family Created By,Money Given,Money Ticked By,Money Ticked At'];
  for (const r of rows) {
    lines.push([fid(r.family_id), r.name, r.serial_no, r.mobile, r.street, r.family_votes, r.notes, r.verified_by_name,
      when(r.verified_at), r.family_created_by, r.money_given ? 'Yes' : 'No', r.money_by_name, when(r.money_at)].map(esc).join(','));
  }
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="34-division-voters-${new Date().toISOString().slice(0, 10)}.csv"`);
  res.send('﻿' + lines.join('\r\n'));
}));

// ---------- volunteers (admin) ----------
app.get('/api/users', auth, adminOnly, wrap(async (req, res) => {
  const { rows } = await pool.query(
    `SELECT u.id, u.username, u.full_name, u.mobile, u.role, u.active, u.approved, u.created_at,
            (SELECT count(*)::int FROM voters v WHERE v.verified_by = u.id) AS verified
     FROM users u ORDER BY u.approved, u.role, u.full_name`
  );
  res.json(rows);
}));

app.post('/api/users', auth, adminOnly, wrap(async (req, res) => {
  const { value: u, error } = validateNewUser(req.body);
  if (error) return res.status(400).json({ error });
  const role = req.body.role === 'admin' ? 'admin' : 'volunteer';
  try {
    await pool.query('INSERT INTO users (username, full_name, password_hash, mobile, role) VALUES ($1,$2,$3,$4,$5)', [
      u.username, u.full_name, await bcrypt.hash(u.password, 10), u.mobile, role,
    ]);
  } catch (e) {
    if (e.code === '23505') return res.status(409).json({ error: 'That username is taken.' });
    throw e;
  }
  res.status(201).json({ ok: true });
}));

app.patch('/api/users/:id', auth, adminOnly, wrap(async (req, res) => {
  const id = Number(req.params.id);
  if (id === req.user.id && req.body.active === false) return res.status(400).json({ error: "You can't disable yourself." });
  if (req.body.approved === true) {
    await pool.query('UPDATE users SET approved = TRUE, active = TRUE WHERE id = $1', [id]);
  }
  if (typeof req.body.active === 'boolean') {
    await pool.query('UPDATE users SET active = $1 WHERE id = $2', [req.body.active, id]);
    if (!req.body.active) await pool.query('DELETE FROM sessions WHERE user_id = $1', [id]);
  }
  if (req.body.password) {
    if (String(req.body.password).length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [await bcrypt.hash(String(req.body.password), 10), id]);
    await pool.query('DELETE FROM sessions WHERE user_id = $1', [id]);
  }
  res.json({ ok: true });
}));

// Reject a pending sign-up (only unapproved accounts can be deleted).
app.delete('/api/users/:id', auth, adminOnly, wrap(async (req, res) => {
  const r = await pool.query('DELETE FROM users WHERE id = $1 AND NOT approved', [Number(req.params.id)]);
  if (!r.rowCount) return res.status(400).json({ error: 'Only pending sign-ups can be rejected. Disable active users instead.' });
  res.json({ ok: true });
}));

// ---------- static frontend ----------
app.get('/healthz', (req, res) => res.send('ok'));
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, file) => {
    if (file.endsWith('.html')) res.setHeader('Cache-Control', 'no-cache');
  },
}));
app.get(/^\/(?!api\/).*/, (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong. Please try again.' });
});

// ---------- start ----------
// No users are created automatically: the first visitor creates the admin
// account on the setup screen (/api/setup).
(async () => {
  await migrate();
  app.listen(PORT, () => console.log(`34 Division running on http://localhost:${PORT}`));
})().catch((e) => {
  console.error('Failed to start:', e);
  process.exit(1);
});
