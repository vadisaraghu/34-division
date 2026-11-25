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
const {
  validateVoter, nameKey, normName, normMobile, normSerial, normStreet, clean, phonKey, nameScore, sameName,
} = require('./src/normalize');

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
  attempts.delete(req.ip + '|' + username); // only failed attempts count towards the limit
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

// Note: there is no public sign-up. Only the admin creates volunteer accounts
// (POST /api/users).

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
    `SELECT count(*) FILTER (WHERE money_given)::int AS given, count(*)::int AS total,
            count(*) FILTER (WHERE double_vote)::int AS double_votes,
            count(*) FILTER (WHERE roll_check = 'mismatch')::int AS name_checks,
            (SELECT count(*)::int FROM reference_voters) AS roll_total
     FROM voters`
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
    double_votes: money.double_votes,
    name_checks: req.user.role === 'admin' ? money.name_checks : 0,
    roll_total: money.roll_total,
    top_streets: streets.rows,
    volunteers: volunteers.rows,
    daily: daily.rows,
    recent: recent.rows,
  });
}));

// ---------- statistics (filterable) ----------
// Filters: street (street key), volunteer (user id), from / to (YYYY-MM-DD, local
// date the voter was verified). Every section below uses the same filters.
const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;
app.get('/api/statistics', auth, wrap(async (req, res) => {
  const q = req.query;
  const where = [];
  const args = [];
  const add = (sql, val) => { args.push(val); where.push(sql.replace('?', `$${args.length}`)); };
  const day = `(v.verified_at AT TIME ZONE '${TZ}')::date`;
  if (q.street) add('v.street_key = ?', String(q.street).slice(0, 200));
  if (/^\d{1,9}$/.test(q.volunteer || '')) add('v.verified_by = ?', Number(q.volunteer));
  if (ISO_DAY.test(q.from || '')) add(`${day} >= ?::date`, q.from);
  if (ISO_DAY.test(q.to || '')) add(`${day} <= ?::date`, q.to);
  const W = where.length ? `WHERE ${where.join(' AND ')}` : '';
  // The voter-list entry for a voter: same serial and same (official) name.
  const ROLL = 'LEFT JOIN reference_voters r ON r.serial_no = v.serial_no AND r.name_key = v.name_key';

  // Daily chart: the chosen range, or the last 30 days (at most 120 days shown).
  const today = (await pool.query(`SELECT to_char((now() AT TIME ZONE '${TZ}')::date, 'YYYY-MM-DD') AS d`)).rows[0].d;
  let to = ISO_DAY.test(q.to || '') ? q.to : today;
  let from = ISO_DAY.test(q.from || '') ? q.from : null;
  if (to > today) to = today;
  if (!from || from > to) from = new Date(Date.parse(to + 'T00:00:00Z') - 29 * 864e5).toISOString().slice(0, 10);
  if (Date.parse(to) - Date.parse(from) > 119 * 864e5) from = new Date(Date.parse(to + 'T00:00:00Z') - 119 * 864e5).toISOString().slice(0, 10);

  const [summary, daily, streets, volunteers, famSizes, ages, genders, rollGender, quality, hours, options] = await Promise.all([
    pool.query(`
      WITH f AS (SELECT v.mobile, count(*) AS members, max(v.family_votes) AS votes FROM voters v ${W} GROUP BY v.mobile)
      SELECT (SELECT count(*) FROM voters v ${W})::int AS voters,
             (SELECT count(*) FROM f)::int AS families,
             COALESCE((SELECT sum(votes) FROM f), 0)::int AS family_votes,
             COALESCE((SELECT sum(GREATEST(votes - members, 0)) FROM f), 0)::int AS family_remaining,
             (SELECT count(DISTINCT v.street_key) FROM voters v ${W})::int AS streets,
             (SELECT count(DISTINCT v.verified_by) FROM voters v ${W})::int AS volunteers,
             (SELECT count(DISTINCT ${day}) FROM voters v ${W})::int AS active_days,
             (SELECT count(*) FROM reference_voters)::int AS roll_total,
             (SELECT count(DISTINCT r.id) FROM voters v ${ROLL} ${W}${W ? ' AND' : ' WHERE'} r.id IS NOT NULL)::int AS in_roll`, args),
    pool.query(`
      SELECT to_char(d, 'YYYY-MM-DD') AS day, COALESCE(c.n, 0)::int AS n
      FROM generate_series($${args.length + 1}::date, $${args.length + 2}::date, '1 day') d
      LEFT JOIN (SELECT ${day} AS day, count(*) n FROM voters v ${W} GROUP BY 1) c ON c.day = d::date
      ORDER BY d`, [...args, from, to]),
    pool.query(`
      SELECT v.street_key AS key, min(v.street) AS street, count(*)::int AS voters,
             count(DISTINCT v.mobile)::int AS families,
             count(*) FILTER (WHERE v.double_vote)::int AS double_votes,
             count(DISTINCT v.verified_by)::int AS volunteers,
             max(v.verified_at) AS last_at
      FROM voters v ${W} GROUP BY v.street_key ORDER BY voters DESC, street`, args),
    pool.query(`
      SELECT u.id, u.full_name, u.active, count(v.id)::int AS voters,
             count(DISTINCT v.mobile)::int AS families,
             count(DISTINCT v.street_key)::int AS streets,
             count(*) FILTER (WHERE ${day} = (now() AT TIME ZONE '${TZ}')::date)::int AS today,
             count(DISTINCT ${day})::int AS days,
             max(v.verified_at) AS last_at
      FROM voters v JOIN users u ON u.id = v.verified_by ${W}
      GROUP BY u.id ORDER BY voters DESC, u.full_name`, args),
    pool.query(`
      SELECT LEAST(members, 6)::int AS size, count(*)::int AS families
      FROM (SELECT count(*) AS members FROM voters v ${W} GROUP BY v.mobile) f GROUP BY 1 ORDER BY 1`, args),
    pool.query(`
      SELECT CASE WHEN r.age IS NULL THEN 'unknown' WHEN r.age < 26 THEN '18-25' WHEN r.age < 36 THEN '26-35'
                  WHEN r.age < 46 THEN '36-45' WHEN r.age < 61 THEN '46-60' ELSE '60+' END AS band,
             count(*)::int AS n
      FROM (SELECT DISTINCT ON (v.id) v.id, r.age FROM voters v ${ROLL} ${W} ORDER BY v.id, r.id) r GROUP BY 1`, args),
    pool.query(`
      SELECT g, count(*)::int AS n FROM (
        SELECT DISTINCT ON (v.id) CASE WHEN upper(left(r.gender, 1)) IN ('M', 'F') THEN upper(left(r.gender, 1))
                                       WHEN r.gender IS NULL OR r.gender = '' THEN 'unknown' ELSE 'other' END AS g
        FROM voters v ${ROLL} ${W} ORDER BY v.id, r.id) x GROUP BY 1`, args),
    pool.query(`
      SELECT CASE WHEN upper(left(gender, 1)) IN ('M', 'F') THEN upper(left(gender, 1))
                  WHEN gender = '' THEN 'unknown' ELSE 'other' END AS g, count(*)::int AS n
      FROM reference_voters GROUP BY 1`),
    pool.query(`
      SELECT count(*) FILTER (WHERE v.double_vote)::int AS double_votes,
             count(*) FILTER (WHERE v.roll_check = 'mismatch')::int AS name_checks,
             count(*) FILTER (WHERE v.door_no = '')::int AS no_door,
             count(*) FILTER (WHERE (SELECT count(*) FROM reference_voters) > 0
                              AND NOT EXISTS (SELECT 1 FROM reference_voters r WHERE r.serial_no = v.serial_no))::int AS not_in_roll,
             (SELECT count(*) FROM review_queue)::int AS review_pending
      FROM voters v ${W}`, args),
    pool.query(`
      SELECT extract(hour FROM v.verified_at AT TIME ZONE '${TZ}')::int AS hour, count(*)::int AS n
      FROM voters v ${W} GROUP BY 1 ORDER BY 1`, args),
    Promise.all([
      pool.query('SELECT street_key AS key, min(street) AS street FROM voters GROUP BY street_key ORDER BY min(street)'),
      pool.query(`SELECT u.id, u.full_name FROM users u WHERE EXISTS (SELECT 1 FROM voters v WHERE v.verified_by = u.id)
                  ORDER BY u.full_name`),
    ]),
  ]);

  const isAdmin = req.user.role === 'admin';
  const qual = quality.rows[0];
  if (!isAdmin) qual.name_checks = null;
  res.json({
    filters: { street: q.street || '', volunteer: q.volunteer || '', from: q.from || '', to: q.to || '' },
    range: { from, to },
    summary: summary.rows[0],
    daily: daily.rows,
    hours: hours.rows,
    streets: streets.rows,
    volunteers: volunteers.rows,
    family_sizes: famSizes.rows,
    ages: ages.rows,
    genders: genders.rows,
    roll_genders: rollGender.rows,
    quality: qual,
    options: { streets: options[0].rows, volunteers: options[1].rows },
  });
}));

// ---------- voters ----------
// Creates the family for this mobile if it doesn't exist yet (the creator is
// the volunteer who adds its first member). Returns { id, created }.
async function ensureFamily(client, mobile, userId, uploadId = null) {
  const { rows } = await client.query(
    `INSERT INTO families (mobile, created_by, upload_id) VALUES ($1, $2, $3)
     ON CONFLICT (mobile) DO UPDATE SET mobile = EXCLUDED.mobile
     RETURNING id, (xmax = 0) AS created`,
    [mobile, userId, uploadId]
  );
  return rows[0];
}

// Family history: who did what, and when.
async function logFamily(client, familyId, userId, action, detail = {}) {
  if (!familyId) return;
  await client.query('INSERT INTO family_log (family_id, user_id, action, detail) VALUES ($1, $2, $3, $4)',
    [familyId, userId, action, detail]);
}
const familyIdOf = async (client, mobile) =>
  ((await client.query('SELECT id FROM families WHERE mobile = $1', [mobile])).rows[0] || {}).id;

// Voter-list entries at a serial number (normally one).
async function rollAt(client, serial) {
  if (!serial) return [];
  const { rows } = await client.query(
    `SELECT id, name, name_te, serial_no, door_no, relation_type, relation_en, relation_te, age, gender, epic, listed_twice
     FROM reference_voters WHERE serial_no = $1 ORDER BY (name_te <> '') DESC, id`,
    [serial]
  );
  return rows;
}

// Lines a voter up with the voter list by serial number. When the typed name is
// the same person as the list entry, the official spelling (English from the
// Telugu) is used; otherwise the voter is flagged for the admin to check.
// Mutates v: name, name_key, name_te, door_no, roll_check.
async function applyRoll(client, v) {
  const list = await rollAt(client, v.serial_no);
  const hit = list.find((r) => sameName(v.name, r.name));
  if (hit) {
    v.name = hit.name;
    v.name_key = nameKey(hit.name);
    v.name_te = hit.name_te;
    if (!v.door_no) v.door_no = hit.door_no;
    v.roll_check = '';
  } else {
    v.name_te = '';
    v.roll_check = list.length ? 'mismatch' : '';
  }
  return { hit, list };
}

async function insertVoter(client, v, userId, reviewedIds = [], { uploadId = null, via = '' } = {}) {
  const fam = await ensureFamily(client, v.mobile, userId, uploadId);
  const who = { name: v.name, serial_no: v.serial_no, ...(via ? { via } : {}) };
  await logFamily(client, fam.id, userId, fam.created ? 'created' : 'member_added', who);
  const { rows } = await client.query(
    `INSERT INTO voters (name, name_key, serial_no, mobile, street, street_key, family_votes, notes, reviewed_matches, verified_by,
                         door_no, name_te, double_vote, double_vote_note, roll_check)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING id`,
    [v.name, v.name_key, v.serial_no, v.mobile, v.street, v.street_key, v.family_votes, v.notes, reviewedIds, userId,
      v.door_no || '', v.name_te || '', !!v.double_vote, v.double_vote_note || '', v.roll_check || '']
  );
  return { id: rows[0].id, family_id: fam.id, family_created: fam.created };
}

const fidText = (n) => `F-${String(n).padStart(4, '0')}`;

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
    return res.json({ level: 'none', matches: [], roll: null });
  }
  // What the voter list says at this serial number, and whether the typed name fits.
  let roll = null;
  const list = await rollAt(pool, v.serial_no);
  if (list.length) {
    const typed = clean(b.name);
    const hit = typed ? list.find((r) => sameName(typed, r.name)) : null;
    roll = { entry: hit || list[0], name_matches: typed ? !!hit : null };
    if (hit) v.name_key = nameKey(hit.name); // check duplicates with the official spelling
    // The same person's other entries in the voter list (duplicate votes).
    const d = (await dupPartners([roll.entry.id])).get(roll.entry.id);
    roll.entry.dups = d ? d.others : [];
    roll.entry.dup_reasons = d ? d.reasons : [];
  }
  const dup = await findDuplicates(v, { excludeId: b.exclude_id ? Number(b.exclude_id) : null });
  // The family that already owns this mobile number, if any.
  const mobile_family = v.mobile ? await familyByMobile(pool, v.mobile) : null;
  res.json({ ...dup, roll, mobile_family });
}));

app.post('/api/voters', auth, wrap(async (req, res) => {
  const { value: v, error } = validateVoter(req.body);
  if (error) return res.status(400).json({ error });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // Serialise inserts so two volunteers can't save the same voter at the same instant.
    await client.query('SELECT pg_advisory_xact_lock(34)');
    // One mobile number = one family. Using a number that a family already has
    // must be a deliberate "add to this family", never a new family by accident.
    const fam = await familyByMobile(client, v.mobile);
    if (fam && req.body.join_family !== true) {
      await client.query('ROLLBACK');
      return res.status(409).json({
        error: `This mobile number already belongs to family ${fidText(fam.id)}. Add the voter to that family, or use a different number.`,
        family_taken: true, family: fam,
      });
    }
    await applyRoll(client, v);
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
    const conds = [`lower(v.name) LIKE $${p}`, `lower(v.serial_no) LIKE $${p}`, `lower(v.street) LIKE $${p}`, `lower(v.door_no) LIKE $${p}`, `v.name_te LIKE $${p}`];
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
  if (req.query.double === '1') where.push('v.double_vote');
  if (req.query.dup === '1') {
    // Voters whose entry in the voter list is a duplicate (the person is listed more than once).
    params.push([...(await dupIndex()).byId.keys()]);
    where.push(`EXISTS (SELECT 1 FROM reference_voters r WHERE r.id = ANY($${params.length}::int[]) AND r.serial_no = v.serial_no
                 AND (v.name_key = r.name_key OR (v.name_te <> '' AND v.name_te = r.name_te)))`);
  }
  if (req.query.check === '1') where.push("v.roll_check = 'mismatch'");
  if (req.query.mobile) {
    params.push(normMobile(req.query.mobile));
    where.push(`v.mobile = $${params.length}`);
  }
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const [list, count] = await Promise.all([
    pool.query(`${SELECT_VOTER} ${whereSql} ORDER BY v.verified_at DESC LIMIT ${size} OFFSET ${(page - 1) * size}`, params),
    pool.query(`SELECT count(*)::int AS n FROM voters v LEFT JOIN families f ON f.mobile = v.mobile ${whereSql}`, params),
  ]);
  await attachVoterDups(list.rows);
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
  // Moving a voter onto a mobile number of ANOTHER family must be confirmed.
  const { rows: cur } = await pool.query('SELECT mobile FROM voters WHERE id = $1', [id]);
  if (!cur[0]) return res.status(404).json({ error: 'Voter not found.' });
  if (v.mobile !== cur[0].mobile && req.body.join_family !== true) {
    const fam = await familyByMobile(pool, v.mobile);
    if (fam) {
      return res.status(409).json({
        error: `This mobile number already belongs to family ${fidText(fam.id)}. Confirm to move the voter into that family.`,
        family_taken: true, family: fam,
      });
    }
  }
  await applyRoll(pool, v);
  // The admin's own edit is final: a name that differs from the list is kept as typed.
  if (v.roll_check === 'mismatch') v.roll_check = 'kept';
  const dup = await findDuplicates(v, { excludeId: id });
  if (dup.level === 'exact') return res.status(409).json({ error: 'Another verified voter already has these details.', ...dup });
  const moved = v.mobile !== cur[0].mobile;
  const newFam = await ensureFamily(pool, v.mobile, req.user.id);
  if (moved) {
    // Record the move in both families' history.
    const who = { name: v.name, serial_no: v.serial_no };
    await logFamily(pool, await familyIdOf(pool, cur[0].mobile), req.user.id, 'member_moved_out', { ...who, to: fidText(newFam.id) });
    await logFamily(pool, newFam.id, req.user.id, newFam.created ? 'created' : 'member_moved_in',
      { ...who, from: fidText(await familyIdOf(pool, cur[0].mobile)) });
  }
  try {
    const r = await pool.query(
      `UPDATE voters SET name=$1, name_key=$2, serial_no=$3, mobile=$4, street=$5, street_key=$6, family_votes=$7, notes=$8,
              door_no=$10, name_te=$11, double_vote=$12, double_vote_note=$13, roll_check=$14, updated_at=now()
       WHERE id=$9`,
      [v.name, v.name_key, v.serial_no, v.mobile, v.street, v.street_key, v.family_votes, v.notes, id, v.door_no,
        v.name_te, v.double_vote, v.double_vote_note, v.roll_check]
    );
    if (!r.rowCount) return res.status(404).json({ error: 'Voter not found.' });
  } catch (e) {
    if (e.code === '23505') return res.status(409).json({ error: 'Another verified voter already has this name and serial number.' });
    throw e;
  }
  res.json({ ok: true });
}));

app.delete('/api/voters/:id', auth, adminOnly, wrap(async (req, res) => {
  const { rows } = await pool.query('DELETE FROM voters WHERE id = $1 RETURNING name, serial_no, mobile', [Number(req.params.id)]);
  if (rows[0]) {
    await logFamily(pool, await familyIdOf(pool, rows[0].mobile), req.user.id, 'member_removed',
      { name: rows[0].name, serial_no: rows[0].serial_no });
  }
  res.json({ ok: true });
}));

// ---------- families ----------
const FAMILY_SELECT = `
  SELECT f.id, f.mobile, f.created_at, cu.full_name AS created_by_name, f.updated_at,
         (SELECT full_name FROM users WHERE id = f.updated_by) AS updated_by_name,
         count(v.id)::int AS member_count, max(v.family_votes)::int AS family_votes, min(v.street) AS street,
         count(v.id) FILTER (WHERE v.money_given)::int AS money_count,
         json_agg(json_build_object('id', v.id, 'name', v.name, 'serial_no', v.serial_no,
                  'verified_by_name', vu.full_name, 'verified_at', v.verified_at,
                  'name_te', v.name_te, 'door_no', v.door_no, 'double_vote', v.double_vote, 'mobile', v.mobile,
                  'money_given', v.money_given, 'money_at', v.money_at, 'money_by_name', mu.full_name,
                  'money_received_by', v.money_received_by,
                  'money_logged', EXISTS (SELECT 1 FROM money_log ml WHERE ml.voter_id = v.id))
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

app.get('/api/families/:id(\\d+)', auth, wrap(async (req, res) => {
  const { rows } = await pool.query(`${FAMILY_SELECT} WHERE f.id = $1 ${FAMILY_GROUP}`, [Number(req.params.id)]);
  if (!rows[0]) return res.status(404).json({ error: 'Family not found.' });
  res.json({ family: rows[0] });
}));

// Ticks "money given" for one or more voters of the SAME family in one go, recording
// who received it (the voter, another family member, or someone else typed in).
// Voters already ticked are skipped. Every tick is logged in money_log.
async function giveMoney(client, ids, receivedBy, userId) {
  const { rows } = await client.query(
    `SELECT v.id, v.name, v.mobile, v.money_given, u.full_name AS money_by_name FROM voters v
     LEFT JOIN users u ON u.id = v.money_by WHERE v.id = ANY($1) FOR UPDATE OF v`,
    [ids]
  );
  if (rows.length !== ids.length) return { error: 'Voter not found.', status: 404 };
  if (new Set(rows.map((r) => r.mobile)).size > 1) return { error: 'These voters are not in the same family.', status: 400 };
  const todo = rows.filter((r) => !r.money_given);
  if (!todo.length) {
    const r = rows[0];
    return { error: `Already ticked by ${r.money_by_name || 'someone'}.`, status: 409 };
  }
  const recv = clean(receivedBy).slice(0, 120);
  for (const r of todo) {
    const who = recv || r.name;
    await client.query(
      'UPDATE voters SET money_given = TRUE, money_by = $2, money_at = now(), money_received_by = $3 WHERE id = $1',
      [r.id, userId, who]
    );
    await client.query('INSERT INTO money_log (voter_id, given, user_id, received_by) VALUES ($1, TRUE, $2, $3)', [r.id, userId, who]);
  }
  return { ids: todo.map((r) => r.id), skipped: rows.length - todo.length };
}

async function inTransaction(fn) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const out = await fn(client);
    await client.query(out && out.error ? 'ROLLBACK' : 'COMMIT');
    return out;
  } catch (e) {
    await client.query('ROLLBACK').catch(() => {});
    throw e;
  } finally {
    client.release();
  }
}

// Tick / undo "money given" for ONE voter (optionally with more members of the
// same family: also_ids). Any signed-in user can do either.
app.post('/api/voters/:id/money', auth, wrap(async (req, res) => {
  const id = Number(req.params.id);
  const given = req.body.given === true;
  if (given) {
    const extra = (Array.isArray(req.body.also_ids) ? req.body.also_ids : []).map(Number).filter((x) => Number.isInteger(x) && x !== id);
    const out = await inTransaction((c) => giveMoney(c, [id, ...new Set(extra)], req.body.received_by, req.user.id));
    if (out.error) return res.status(out.status).json({ error: out.error });
    const { rows } = await pool.query(`${SELECT_VOTER} WHERE v.id = ANY($1)`, [[id, ...extra]]);
    return res.json({ voter: rows.find((r) => r.id === id), voters: rows, skipped: out.skipped });
  }
  const out = await inTransaction(async (client) => {
    const { rows } = await client.query('SELECT money_given FROM voters WHERE id = $1 FOR UPDATE', [id]);
    if (!rows[0]) return { error: 'Voter not found.', status: 404 };
    if (!rows[0].money_given) return { error: 'Money tick was already undone.', status: 409 };
    await client.query(
      "UPDATE voters SET money_given = FALSE, money_by = NULL, money_at = NULL, money_received_by = '' WHERE id = $1", [id]
    );
    await client.query('INSERT INTO money_log (voter_id, given, user_id) VALUES ($1, FALSE, $2)', [id, req.user.id]);
    return {};
  });
  if (out.error) return res.status(out.status).json({ error: out.error });
  const { rows } = await pool.query(`${SELECT_VOTER} WHERE v.id = $1`, [id]);
  res.json({ voter: rows[0], voters: rows });
}));

app.get('/api/voters/:id/money-log', auth, wrap(async (req, res) => {
  const { rows } = await pool.query(
    `SELECT l.given, l.at, l.received_by, u.full_name AS by_name FROM money_log l
     LEFT JOIN users u ON u.id = l.user_id WHERE l.voter_id = $1 ORDER BY l.at DESC LIMIT 50`,
    [Number(req.params.id)]
  );
  res.json(rows);
}));

// Money for several members of one family at once.
app.post('/api/families/:id/money', auth, wrap(async (req, res) => {
  const { rows: fam } = await pool.query('SELECT mobile FROM families WHERE id = $1', [Number(req.params.id)]);
  if (!fam[0]) return res.status(404).json({ error: 'Family not found.' });
  const ids = [...new Set((Array.isArray(req.body.voter_ids) ? req.body.voter_ids : []).map(Number).filter(Number.isInteger))];
  if (!ids.length) return res.status(400).json({ error: 'Choose at least one family member.' });
  const { rows: members } = await pool.query('SELECT id FROM voters WHERE mobile = $1 AND id = ANY($2)', [fam[0].mobile, ids]);
  if (members.length !== ids.length) return res.status(400).json({ error: 'Some of these voters are not in this family.' });
  const out = await inTransaction((c) => giveMoney(c, ids, req.body.received_by, req.user.id));
  if (out.error) return res.status(out.status).json({ error: out.error });
  const { rows } = await pool.query(`${SELECT_VOTER} WHERE v.id = ANY($1)`, [ids]);
  res.json({ voters: rows, skipped: out.skipped });
}));

// Family that owns a mobile number (one mobile number = one family), or null.
async function familyByMobile(client, mobile) {
  if (!mobile) return null;
  const { rows } = await client.query(
    `SELECT f.id, f.mobile, min(v.street) AS street, count(v.id)::int AS member_count, max(v.family_votes)::int AS family_votes,
            json_agg(json_build_object('id', v.id, 'name', v.name, 'name_te', v.name_te, 'serial_no', v.serial_no,
                     'money_given', v.money_given, 'money_received_by', v.money_received_by) ORDER BY v.verified_at) AS members
     FROM families f JOIN voters v ON v.mobile = f.mobile WHERE f.mobile = $1 GROUP BY f.id`,
    [mobile]
  );
  return rows[0] || null;
}

app.get('/api/families/lookup', auth, wrap(async (req, res) => {
  const m = normMobile(req.query.mobile);
  res.json({ family: m.length === 10 ? await familyByMobile(pool, m) : null });
}));

// Full history of a family: who created it, added / moved / removed members, edited it.
app.get('/api/families/:id(\\d+)/history', auth, wrap(async (req, res) => {
  const { rows } = await pool.query(
    `SELECT l.action, l.detail, l.at, u.full_name AS by_name FROM family_log l
     LEFT JOIN users u ON u.id = l.user_id WHERE l.family_id = $1 ORDER BY l.at DESC, l.id DESC LIMIT 200`,
    [Number(req.params.id)]
  );
  res.json(rows);
}));

// Edit a family's shared details: mobile number, street and family votes apply to
// every member. A mobile number already used by another family is refused.
app.patch('/api/families/:id', auth, wrap(async (req, res) => {
  const id = Number(req.params.id);
  const out = await inTransaction(async (client) => {
    const { rows: fam } = await client.query('SELECT id, mobile FROM families WHERE id = $1 FOR UPDATE', [id]);
    if (!fam[0]) return { error: 'Family not found.', status: 404 };
    const oldMobile = fam[0].mobile;
    const mobile = req.body.mobile !== undefined ? normMobile(req.body.mobile) : oldMobile;
    const street = req.body.street !== undefined ? clean(req.body.street) : null;
    const fv = req.body.family_votes !== undefined ? Number.parseInt(req.body.family_votes, 10) : null;
    if (!/^[6-9]\d{9}$/.test(mobile)) return { error: 'Enter a valid 10-digit mobile number.', status: 400 };
    if (street !== null && (!street || street.length > 120)) return { error: 'Please enter the street name.', status: 400 };
    if (fv !== null && !(fv >= 1 && fv <= 99)) return { error: 'Family votes must be between 1 and 99.', status: 400 };
    // Current values, to record exactly what changed.
    const { rows: was } = await client.query(
      'SELECT min(street) AS street, max(family_votes)::int AS family_votes FROM voters WHERE mobile = $1', [oldMobile]
    );
    const changes = {};
    if (mobile !== oldMobile) changes.mobile = { from: oldMobile, to: mobile };
    if (street !== null && street !== (was[0].street || '')) changes.street = { from: was[0].street || '', to: street };
    if (fv !== null && fv !== was[0].family_votes) changes.family_votes = { from: was[0].family_votes, to: fv };
    if (!Object.keys(changes).length) return {}; // nothing changed: nothing to save or log
    if (mobile !== oldMobile) {
      const other = await familyByMobile(client, mobile);
      const { rows: taken } = await client.query('SELECT id FROM families WHERE mobile = $1', [mobile]);
      if (taken[0]) {
        return {
          status: 409, family_taken: true, family: other,
          error: `This mobile number already belongs to family ${fidText(taken[0].id)}${other ? ` (${other.members.map((x) => x.name).join(', ')})` : ''}. One mobile number can only be used by one family.`,
        };
      }
      await client.query('UPDATE voters SET mobile = $1, updated_at = now() WHERE mobile = $2', [mobile, oldMobile]);
      await client.query('UPDATE families SET mobile = $1 WHERE id = $2', [mobile, id]);
    }
    if (street !== null) {
      await client.query('UPDATE voters SET street = $1, street_key = $2, updated_at = now() WHERE mobile = $3', [street, normStreet(street), mobile]);
    }
    if (fv !== null) await client.query('UPDATE voters SET family_votes = $1, updated_at = now() WHERE mobile = $2', [fv, mobile]);
    await client.query('UPDATE families SET updated_by = $1, updated_at = now() WHERE id = $2', [req.user.id, id]);
    await logFamily(client, id, req.user.id, 'edited', changes);
    return {};
  });
  if (out.error) return res.status(out.status).json(out);
  const { rows } = await pool.query(`${FAMILY_SELECT} WHERE f.id = $1 ${FAMILY_GROUP}`, [id]);
  res.json({ family: rows[0] });
}));

// ---------- voter list (official roll): suggestions, auto-fill, name checks ----------
const REF_COLS = `r.id, r.name, r.name_te, r.serial_no, r.door_no, r.relation_type, r.relation_en, r.relation_te,
         r.age, r.gender, r.epic, r.part_no, r.listed_twice`;
// "verified" = a saved voter already has this serial number and this person's name.
const REF_SELECT = `
  SELECT ${REF_COLS},
         (SELECT u.full_name FROM voters v LEFT JOIN users u ON u.id = v.verified_by
          WHERE v.serial_no = r.serial_no AND (v.name_key = r.name_key OR (v.name_te <> '' AND v.name_te = r.name_te))
          LIMIT 1) AS verified_by_name,
         EXISTS (SELECT 1 FROM voters v WHERE v.serial_no = r.serial_no
                 AND (v.name_key = r.name_key OR (v.name_te <> '' AND v.name_te = r.name_te))) AS verified
  FROM reference_voters r`;
const likeEsc = (s) => s.replace(/[\\%_]/g, '\\$&');

// Suggestions while typing on the Add voter form (and the Voter list page).
//   field=name   -> English name (any spelling), Telugu name, or voter ID
//   field=serial -> exact serial first, then serials that start with it
//   field=door   -> door / house numbers containing what was typed
app.get('/api/reference/search', auth, wrap(async (req, res) => {
  const field = ['serial', 'door'].includes(req.query.field) ? req.query.field : 'name';
  const raw = clean(req.query.q);
  const limit = Math.min(50, Math.max(1, Number.parseInt(req.query.limit, 10) || 30));
  if (!raw) return res.json([]);
  let rows;
  if (field === 'serial') {
    const s = normSerial(raw);
    ({ rows } = await pool.query(
      `${REF_SELECT} WHERE r.serial_no = $1 OR r.serial_no LIKE $2
       ORDER BY (r.serial_no = $1) DESC, length(r.serial_no), r.serial_no, r.name LIMIT ${limit}`,
      [s, `${likeEsc(s)}%`]
    ));
  } else if (field === 'door') {
    const d = raw.toLowerCase().replace(/\s+/g, '');
    ({ rows } = await pool.query(
      `${REF_SELECT} WHERE replace(lower(r.door_no), ' ', '') LIKE $2
       ORDER BY (replace(lower(r.door_no), ' ', '') = $1) DESC, (replace(lower(r.door_no), ' ', '') LIKE $3) DESC,
                r.door_no, r.serial_no LIMIT ${limit}`,
      [d, `%${likeEsc(d)}%`, `${likeEsc(d)}%`]
    ));
  } else if (/[ఀ-౿]/.test(raw)) {
    // Telugu typed: match the Telugu name as written.
    ({ rows } = await pool.query(
      `${REF_SELECT} WHERE r.name_te LIKE $1 ORDER BY position($2 in r.name_te), r.name_te LIMIT ${limit}`,
      [`%${likeEsc(raw)}%`, raw]
    ));
  } else if (/^[a-z]{2,4}\d{3,}$/i.test(raw.replace(/\s+/g, ''))) {
    ({ rows } = await pool.query(`${REF_SELECT} WHERE r.epic LIKE $1 ORDER BY r.epic LIMIT ${limit}`,
      [`${likeEsc(raw.replace(/\s+/g, '').toUpperCase())}%`]));
  } else {
    const q = normName(raw);
    const p = phonKey(raw);
    if (q.length < 2) return res.json([]);
    ({ rows } = await pool.query(
      `${REF_SELECT}
       WHERE r.name_norm LIKE $1 OR r.name_norm LIKE $2 OR r.name_phon LIKE $4 OR r.name_phon LIKE $5
          OR (length($3::text) >= 3 AND $3::text <% r.name_phon)
       ORDER BY (r.name_phon LIKE $4 OR r.name_norm LIKE $1) DESC, (r.name_phon LIKE $5 OR r.name_norm LIKE $2) DESC,
                word_similarity($3::text, r.name_phon) DESC, r.name_phon, r.serial_no
       LIMIT ${limit}`,
      [`${likeEsc(q)}%`, `% ${likeEsc(q)}%`, p, `${likeEsc(p)}%`, `% ${likeEsc(p)}%`]
    ));
  }
  rows.forEach((r) => { r.group = phonKey(r.name).split(' ').sort().join(' '); });
  // Duplicates in the voter list: every result carries the person's other
  // serial numbers, and those entries are listed right after it, so searching
  // any one of the serials brings all of them up together.
  const info = await dupPartners(rows.map((r) => r.id));
  if (info.size) {
    const seen = new Set(rows.map((r) => r.id));
    const extra = new Map();
    const missing = [...new Set([...info.values()].flatMap((d) => d.others.map((o) => o.id)))].filter((id) => !seen.has(id));
    if (missing.length) (await pool.query(`${REF_SELECT} WHERE r.id = ANY($1::int[])`, [missing])).rows.forEach((r) => extra.set(r.id, r));
    const out = [];
    for (const r of rows) {
      out.push(r);
      for (const o of (info.get(r.id) || { others: [] }).others) {
        if (seen.has(o.id) || !extra.has(o.id)) continue;
        seen.add(o.id);
        out.push({ ...extra.get(o.id), group: r.group });
      }
    }
    rows = out;
    rows.forEach((r) => {
      const d = info.get(r.id);
      r.dups = d ? d.others : [];
      r.dup_reasons = d ? d.reasons : [];
    });
  }
  // Same-name group size, so the screen can say "3 people named ...".
  const groups = new Map();
  rows.forEach((r) => groups.set(r.group, (groups.get(r.group) || 0) + 1));
  rows.forEach((r) => { r.same_name = groups.get(r.group); });
  res.json(rows);
}));

// ---------- duplicate entries in the voter list ----------
// Entries of the uploaded voter list that are the same person: they share a
// voter card number (EPIC), or the same name AND the same house (door) number.
// House numbers are compared without spaces / punctuation ("11-285 A/2" =
// "11-285A/2"); names in English (any word order) or in Telugu. A duplicate
// needs at least two entries; the list's own "listed twice" mark is shown as a
// reason. Worked out from the voter list only (never from the voters volunteers
// added), in memory, cached until re-upload.
const epicKey = (e) => String(e || '').replace(/\s+/g, '').toUpperCase();
const doorKey = (d) => String(d || '').toUpperCase().replace(/[^0-9A-Zఀ-౿]/g, '');
let dupCache = null;
const dupReset = () => { dupCache = null; nameDupCache = null; };
async function dupIndex() {
  if (dupCache && Date.now() - dupCache.at < 10 * 60e3) return dupCache;
  const { rows } = await pool.query(
    'SELECT id, name_key, name_te, door_no, epic, listed_twice FROM reference_voters ORDER BY id');
  const parent = rows.map((_, i) => i);
  const find = (i) => (parent[i] === i ? i : (parent[i] = find(parent[i])));
  const why = rows.map(() => new Set());
  const link = (a, b, reason) => {
    why[a].add(reason); why[b].add(reason);
    const x = find(a), y = find(b);
    if (x !== y) parent[Math.max(x, y)] = Math.min(x, y);
  };
  const seen = new Map();
  const once = (key, i, reason) => { if (seen.has(key)) link(seen.get(key), i, reason); else seen.set(key, i); };
  rows.forEach((r, i) => {
    const e = epicKey(r.epic);
    if (e) once(`id|${e}`, i, 'same_id');
    const d = doorKey(r.door_no);
    if (d) {
      if (r.name_key) once(`en|${d}|${r.name_key}`, i, 'same_house');
      const te = String(r.name_te || '').replace(/\s+/g, '');
      if (te) once(`te|${d}|${te}`, i, 'same_house');
    }
    if (r.listed_twice) why[i].add('listed_twice');
  });
  const members = new Map();
  rows.forEach((r, i) => {
    const g = find(i);
    if (!members.has(g)) members.set(g, []);
    members.get(g).push(i);
  });
  const byId = new Map();   // voter-list entry id -> group id
  const groups = new Map(); // group id -> { ids, reasons }
  for (const idx of members.values()) {
    const reasons = [...new Set(idx.flatMap((i) => [...why[i]]))];
    if (idx.length < 2) continue; // a duplicate needs at least two entries
    const gid = rows[idx[0]].id;
    groups.set(gid, { ids: idx.map((i) => rows[i].id), reasons });
    idx.forEach((i) => byId.set(rows[i].id, gid));
  }
  dupCache = { at: Date.now(), byId, groups, total: rows.length };
  return dupCache;
}

// For voter-list entry ids: the person's other entries (with whether each is
// already added). Returns Map(id -> { reasons, others: [...] }).
const DUP_FIELDS = ['id', 'serial_no', 'epic', 'name', 'name_te', 'door_no', 'age', 'gender', 'relation_type', 'relation_en', 'relation_te',
  'part_no', 'verified', 'verified_by_name'];
async function dupPartners(refIds) {
  const out = new Map();
  const idx = await dupIndex();
  const need = new Set();
  refIds.forEach((id) => { const g = idx.byId.get(id); if (g) idx.groups.get(g).ids.forEach((x) => need.add(x)); });
  if (!need.size) return out;
  const { rows } = await pool.query(`${REF_SELECT} WHERE r.id = ANY($1::int[])`, [[...need]]);
  const by = new Map(rows.map((r) => [r.id, Object.fromEntries(DUP_FIELDS.map((f) => [f, r[f]]))]));
  for (const id of need) {
    const g = idx.groups.get(idx.byId.get(id));
    out.set(id, { reasons: g.reasons, others: g.ids.filter((x) => x !== id).map((x) => by.get(x)).filter(Boolean) });
  }
  return out;
}

// Saved voter ids -> their voter-list entry id (same serial and same person).
async function refIdsOfVoters(voterIds) {
  if (!voterIds.length) return new Map();
  const { rows } = await pool.query(`
    SELECT DISTINCT ON (v.id) v.id AS vid, r.id AS rid FROM voters v
    JOIN reference_voters r ON r.serial_no = v.serial_no AND (v.name_key = r.name_key OR (v.name_te <> '' AND v.name_te = r.name_te))
    WHERE v.id = ANY($1::int[]) ORDER BY v.id, r.id`, [voterIds]);
  return new Map(rows.map((r) => [r.vid, r.rid]));
}

// Adds roll_dups (the person's other entries in the voter list) to saved voters.
async function attachVoterDups(voters) {
  const refOf = await refIdsOfVoters(voters.map((v) => v.id));
  const info = await dupPartners([...refOf.values()]);
  voters.forEach((v) => {
    const d = info.get(refOf.get(v.id));
    v.roll_dups = d ? d.others : [];
    v.roll_dup_reasons = d ? d.reasons : [];
  });
  return voters;
}

// Same name in the voter list, for checking by hand: a deliberately wide net so
// nobody is missed. Entries share a name when the English name matches in any
// word order or with/without spaces ("Durgaprasad" = "Durga Prasad"), or the
// Telugu name matches. Each group gets hints (same house / voter ID / father,
// similar age, listed twice) so the likeliest are checked first.
let nameDupCache = null;
async function nameGroups() {
  if (nameDupCache && Date.now() - nameDupCache.at < 10 * 60e3) return nameDupCache;
  const { rows } = await pool.query('SELECT id, name, name_key, name_te FROM reference_voters ORDER BY id');
  const parent = rows.map((_, i) => i);
  const find = (i) => (parent[i] === i ? i : (parent[i] = find(parent[i])));
  const seen = new Map();
  const once = (key, i) => {
    if (!seen.has(key)) { seen.set(key, i); return; }
    const x = find(seen.get(key)), y = find(i);
    if (x !== y) parent[Math.max(x, y)] = Math.min(x, y);
  };
  rows.forEach((r, i) => {
    if (r.name_key) once(`k|${r.name_key}`, i);
    const flat = normName(r.name).replace(/\s+/g, '');
    if (flat.length >= 4) once(`f|${flat}`, i);
    const te = String(r.name_te || '').replace(/\s+/g, '');
    if (te) once(`t|${te}`, i);
  });
  const members = new Map();
  rows.forEach((r, i) => { const g = find(i); if (!members.has(g)) members.set(g, []); members.get(g).push(rows[i].id); });
  nameDupCache = { at: Date.now(), groups: [...members.values()].filter((ids) => ids.length > 1), total: rows.length };
  return nameDupCache;
}

app.get('/api/same-names', auth, wrap(async (req, res) => {
  const { groups, total } = await nameGroups();
  const ids = groups.flat();
  const { rows } = ids.length ? await pool.query(`
    SELECT ${REF_COLS}, v.id AS voter_id, u.full_name AS verified_by_name
    FROM reference_voters r
    LEFT JOIN LATERAL (SELECT * FROM voters v WHERE v.serial_no = r.serial_no
                       AND (v.name_key = r.name_key OR (v.name_te <> '' AND v.name_te = r.name_te))
                       ORDER BY v.id LIMIT 1) v ON TRUE
    LEFT JOIN users u ON u.id = v.verified_by
    WHERE r.id = ANY($1::int[])`, [ids]) : { rows: [] };
  const by = new Map(rows.map((r) => [r.id, r]));
  const num = (s) => Number(s) || 0;
  const strict = await dupIndex();
  const pairs = (list, same) => list.some((a, i) => list.some((b, j) => j > i && same(a, b)));
  const out = groups.map((g) => {
    const entries = g.map((id) => by.get(id)).filter(Boolean).sort((a, b) => num(a.serial_no) - num(b.serial_no));
    const hints = [];
    if (pairs(entries, (a, b) => epicKey(a.epic) && epicKey(a.epic) === epicKey(b.epic))) hints.push('same_id');
    if (pairs(entries, (a, b) => doorKey(a.door_no) && doorKey(a.door_no) === doorKey(b.door_no))) hints.push('same_house');
    const rel = (e) => normName(e.relation_en || e.relation_te || '').replace(/\s+/g, '');
    if (pairs(entries, (a, b) => rel(a) && rel(a) === rel(b))) hints.push('same_father');
    if (pairs(entries, (a, b) => a.age != null && b.age != null && Math.abs(a.age - b.age) <= 2)) hints.push('close_age');
    if (entries.some((e) => e.listed_twice)) hints.push('listed_twice');
    if (entries.filter((e) => e.voter_id).length > 1) hints.push('added_twice');
    return { name: entries[0].name, name_te: entries[0].name_te, count: entries.length,
      duplicate: entries.some((e) => strict.byId.has(e.id)), hints, entries };
  });
  const W = { same_id: 8, same_house: 6, same_father: 4, close_age: 2, listed_twice: 3, added_twice: 5 };
  const score = (g) => g.hints.reduce((a, h) => a + W[h], 0);
  out.sort((a, b) => score(b) - score(a) || b.count - a.count || a.name.localeCompare(b.name));
  res.json({ roll_total: total, groups: out, entries: out.reduce((a, g) => a + g.count, 0) });
}));

// Everyone with more than one vote in the voter list, one row per person.
app.get('/api/multi-votes', auth, wrap(async (req, res) => {
  const idx = await dupIndex();
  const ids = [...idx.groups.values()].flatMap((g) => g.ids);
  const { rows } = ids.length ? await pool.query(`
    SELECT ${REF_COLS}, v.id AS voter_id, v.double_vote, v.double_vote_note, v.street, f.id AS family_id, u.full_name AS verified_by_name
    FROM reference_voters r
    LEFT JOIN LATERAL (SELECT * FROM voters v WHERE v.serial_no = r.serial_no
                       AND (v.name_key = r.name_key OR (v.name_te <> '' AND v.name_te = r.name_te))
                       ORDER BY v.id LIMIT 1) v ON TRUE
    LEFT JOIN families f ON f.mobile = v.mobile
    LEFT JOIN users u ON u.id = v.verified_by
    WHERE r.id = ANY($1::int[])`, [ids]) : { rows: [] };
  const by = new Map(rows.map((r) => [r.id, r]));
  const num = (s) => Number(s) || 0;
  const people = [...idx.groups.values()].map((g) => {
    const entries = g.ids.map((id) => by.get(id)).filter(Boolean).sort((a, b) => num(a.serial_no) - num(b.serial_no));
    return { votes: entries.length, reasons: g.reasons, added: entries.filter((e) => e.voter_id).length, entries };
  }).sort((a, b) => b.votes - a.votes || num(a.entries[0].serial_no) - num(b.entries[0].serial_no));
  const count = (r) => people.filter((p) => p.reasons.includes(r)).length;
  res.json({
    roll_total: idx.total,
    people,
    counts: { all: people.length, same_id: count('same_id'), same_house: count('same_house'), listed_twice: count('listed_twice'),
      added_twice: people.filter((p) => p.added > 1).length },
  });
}));

app.get('/api/reference/stats', auth, wrap(async (req, res) => {
  const { rows } = await pool.query('SELECT count(*)::int AS n FROM reference_voters');
  res.json({ total: rows[0].n });
}));

// Admin uploads the voter list in batches. Re-uploading is safe: a row with the
// same name + serial is updated instead of being duplicated.
const REF_TEXT = ['name', 'name_key', 'name_norm', 'name_phon', 'name_te', 'serial_no', 'door_no', 'relation_type',
  'relation_en', 'relation_te', 'gender', 'epic', 'part_no'];
app.post('/api/reference/import', auth, adminOnly, wrap(async (req, res) => {
  const input = Array.isArray(req.body.rows) ? req.body.rows.slice(0, 2000) : [];
  const invalid = [];
  const byKey = new Map();
  const yes = (x) => /^(true|yes|y|1)$/i.test(String(x ?? '').trim());
  input.forEach((r, i) => {
    const name = clean(r.name);
    const serial_no = normSerial(r.serial_no);
    const row = r.__row ?? i + 1;
    if (name.length < 2 || name.length > 120) return invalid.push({ row, error: 'Name is missing or too long.' });
    if (!serial_no || serial_no.length > 30) return invalid.push({ row, error: 'Serial number is missing or too long.' });
    const age = Number.parseInt(r.age, 10);
    const g = clean(r.gender).toUpperCase()[0] || '';
    const name_key = nameKey(name);
    byKey.set(`${name_key}|${serial_no}`, {
      name, name_key, name_norm: normName(name), name_phon: phonKey(name), name_te: clean(r.name_te).slice(0, 160),
      serial_no, door_no: clean(r.door_no).slice(0, 60), relation_type: clean(r.relation_type).slice(0, 20),
      relation_en: clean(r.relation_en).slice(0, 160), relation_te: clean(r.relation_te).slice(0, 160),
      age: Number.isFinite(age) && age > 0 && age < 130 ? age : null,
      gender: ['M', 'F', 'O'].includes(g) ? g : '', epic: clean(r.epic).toUpperCase().slice(0, 20),
      part_no: clean(r.part_no).slice(0, 20), listed_twice: yes(r.listed_twice),
    });
  });
  const list = [...byKey.values()];
  let added = 0;
  let updated = 0;
  if (list.length) {
    const col = (k) => list.map((x) => x[k]);
    const params = [...REF_TEXT.map(col), col('age'), col('listed_twice'), req.user.id];
    const t = REF_TEXT.map((k, i) => `$${i + 1}::text[]`).join(', ');
    const n = REF_TEXT.length;
    const { rows } = await pool.query(
      `INSERT INTO reference_voters (${REF_TEXT.join(', ')}, age, listed_twice, uploaded_by)
       SELECT *, $${n + 3} FROM unnest(${t}, $${n + 1}::int[], $${n + 2}::bool[])
       ON CONFLICT (name_key, serial_no) DO UPDATE SET
         ${[...REF_TEXT.filter((k) => !['name_key', 'serial_no'].includes(k)), 'age', 'listed_twice'].map((k) => `${k} = EXCLUDED.${k}`).join(', ')}
       RETURNING (xmax = 0) AS inserted`,
      params
    );
    added = rows.filter((r) => r.inserted).length;
    updated = rows.length - added;
  }
  dupReset();
  res.json({ added, updated, invalid });
}));

app.delete('/api/reference', auth, adminOnly, wrap(async (req, res) => {
  const r = await pool.query('DELETE FROM reference_voters');
  dupReset();
  res.json({ deleted: r.rowCount });
}));

// Lines up the voters that are already saved with the voter list, by serial
// number. When the saved name is the same person as the list entry, the official
// name (Telugu, and English spelled from it) replaces what was typed. Anything
// that doesn't fit is left untouched and listed on the admin's "Check names" page.
app.post('/api/reference/sync-names', auth, adminOnly, wrap(async (req, res) => {
  const updated = [];
  let mismatched = 0;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('SELECT pg_advisory_xact_lock(34)');
    const { rows: voters } = await client.query(
      "SELECT id, name, serial_no, door_no FROM voters WHERE name_te = '' AND roll_check <> 'kept' ORDER BY id"
    );
    for (const v of voters) {
      const list = await rollAt(client, v.serial_no);
      if (!list.length) continue;
      const hit = list.find((r) => sameName(v.name, r.name));
      if (hit) {
        await client.query('SAVEPOINT s');
        try {
          await client.query(
            `UPDATE voters SET name = $2, name_key = $3, name_te = $4, door_no = CASE WHEN door_no = '' THEN $5 ELSE door_no END,
                    roll_check = '', updated_at = now() WHERE id = $1`,
            [v.id, hit.name, nameKey(hit.name), hit.name_te, hit.door_no]
          );
          await client.query('RELEASE SAVEPOINT s');
          updated.push({ serial_no: v.serial_no, from: v.name, to: hit.name, name_te: hit.name_te });
          continue;
        } catch (e) {
          await client.query('ROLLBACK TO SAVEPOINT s');
          if (e.code !== '23505') throw e;
        }
      }
      await client.query("UPDATE voters SET roll_check = 'mismatch' WHERE id = $1", [v.id]);
      mismatched++;
    }
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK').catch(() => {});
    throw e;
  } finally {
    client.release();
  }
  res.json({ updated, mismatched });
}));

// Admin "Check names" page: saved voters whose name doesn't fit the voter list
// at their serial number, with the list entry there and the closest names elsewhere.
app.get('/api/reference/checks', auth, adminOnly, wrap(async (req, res) => {
  const { rows: items } = await pool.query(`${SELECT_VOTER} WHERE v.roll_check = 'mismatch' ORDER BY v.serial_no, v.id`);
  if (!items.length) return res.json([]);
  const [{ rows: roll }, { rows: saved }] = await Promise.all([
    pool.query(`SELECT ${REF_COLS}, r.name_key, r.name_phon FROM reference_voters r`),
    pool.query('SELECT serial_no, name_key, name_te FROM voters'),
  ]);
  const savedKeys = new Set(saved.flatMap((s) => [`${s.serial_no}|${s.name_key}`, s.name_te ? `${s.serial_no}|te:${s.name_te}` : '']));
  const bySerial = new Map();
  roll.forEach((r) => {
    r.verified = savedKeys.has(`${r.serial_no}|${r.name_key}`) || (!!r.name_te && savedKeys.has(`${r.serial_no}|te:${r.name_te}`));
    if (!bySerial.has(r.serial_no)) bySerial.set(r.serial_no, []);
    bySerial.get(r.serial_no).push(r);
  });
  for (const v of items) {
    v.at_serial = bySerial.get(v.serial_no) || [];
    // Cheap pre-filter: only list names sharing the start of a word with the saved name.
    const starts = new Set(phonKey(v.name).split(' ').filter((w) => w.length >= 3).map((w) => w.slice(0, 3)));
    v.suggestions = roll
      .filter((r) => r.serial_no !== v.serial_no && r.name_phon.split(' ').some((w) => starts.has(w.slice(0, 3))))
      .map((r) => ({ ...r, score: nameScore(v.name, r.name), same: sameName(v.name, r.name) }))
      .filter((r) => r.score >= 0.55)
      .sort((a, b) => (b.same - a.same) || (b.score - a.score))
      .slice(0, 3);
  }
  res.json(items);
}));

// Resolve a name check: use a voter-list entry (at this serial, or move the voter
// to another serial), or keep the name as typed.
app.post('/api/voters/:id/roll-fix', auth, adminOnly, wrap(async (req, res) => {
  const id = Number(req.params.id);
  if (req.body.action === 'keep') {
    await pool.query("UPDATE voters SET roll_check = 'kept' WHERE id = $1", [id]);
    return res.json({ ok: true });
  }
  const { rows: refs } = await pool.query('SELECT * FROM reference_voters WHERE id = $1', [Number(req.body.ref_id)]);
  const ref = refs[0];
  if (!ref) return res.status(404).json({ error: 'That voter-list entry was not found.' });
  const { rows: cur } = await pool.query('SELECT mobile, street, family_votes FROM voters WHERE id = $1', [id]);
  if (!cur[0]) return res.status(404).json({ error: 'Voter not found.' });
  const dup = await findDuplicates({
    name_key: nameKey(ref.name), serial_no: ref.serial_no, mobile: cur[0].mobile, street_key: normStreet(cur[0].street),
  }, { excludeId: id });
  if (dup.level === 'exact') return res.status(409).json({ error: 'Another saved voter already is this person.', ...dup });
  try {
    await pool.query(
      `UPDATE voters SET name = $2, name_key = $3, name_te = $4, serial_no = $5,
              door_no = CASE WHEN door_no = '' THEN $6 ELSE door_no END, roll_check = '', updated_at = now()
       WHERE id = $1`,
      [id, ref.name, nameKey(ref.name), ref.name_te, ref.serial_no, ref.door_no]
    );
  } catch (e) {
    if (e.code === '23505') return res.status(409).json({ error: 'Another saved voter already has this name and serial number.' });
    throw e;
  }
  res.json({ ok: true });
}));

// Double vote: any volunteer can mark it (with a short note on where the other vote is).
app.post('/api/voters/:id/double', auth, wrap(async (req, res) => {
  const on = req.body.double_vote === true;
  const note = on ? clean(req.body.note).slice(0, 200) : '';
  const r = await pool.query(
    'UPDATE voters SET double_vote = $2, double_vote_note = $3, updated_at = now() WHERE id = $1',
    [Number(req.params.id), on, note]
  );
  if (!r.rowCount) return res.status(404).json({ error: 'Voter not found.' });
  const { rows } = await pool.query(`${SELECT_VOTER} WHERE v.id = $1`, [Number(req.params.id)]);
  res.json({ voter: rows[0] });
}));

// ---------- bulk upload & review queue ----------
app.post('/api/import', auth, adminOnly, wrap(async (req, res) => {
  const rows = Array.isArray(req.body.rows) ? req.body.rows.slice(0, 1000) : [];
  // One id per uploaded file (sent with every batch). Rows of the same file that
  // share a NEW mobile number form one new family together; a number that belongs
  // to a family from anywhere else is never joined silently: the row waits in the
  // review queue until someone decides.
  const uploadId = /^[a-z0-9-]{8,64}$/i.test(String(req.body.upload_id || '')) ? String(req.body.upload_id) : `u-${Date.now()}`;
  const result = { added: 0, already_verified: 0, queued: 0, family_queued: 0, invalid: [] };
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
      await applyRoll(client, v);
      const dup = await findDuplicates(v, { client });
      const { rows: fam } = await client.query('SELECT id, upload_id FROM families WHERE mobile = $1', [v.mobile]);
      const otherFamily = fam[0] && fam[0].upload_id !== uploadId;
      if (dup.level === 'exact') result.already_verified++;
      else if (dup.level !== 'none' || otherFamily) {
        await client.query('INSERT INTO review_queue (data, match_ids, uploaded_by, reason) VALUES ($1, $2, $3, $4)', [
          v, dup.matches.map((m) => m.id), req.user.id, dup.level === 'none' ? 'family' : 'duplicate',
        ]);
        if (dup.level === 'none') result.family_queued++;
        result.queued++;
      } else {
        await insertVoter(client, v, req.user.id, [], { uploadId, via: 'upload' });
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
    `SELECT r.id, r.data, r.created_at, r.reason, u.full_name AS uploaded_by_name
     FROM review_queue r LEFT JOIN users u ON u.id = r.uploaded_by ORDER BY r.id LIMIT 20`
  );
  // Re-run the checks so matches and the family that owns the mobile number are current.
  const items = [];
  for (const r of rows) {
    items.push({ ...r, ...(await findDuplicates(r.data)), mobile_family: await familyByMobile(pool, r.data.mobile) });
  }
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
      // "Use a different number": the reviewer typed a new mobile for this voter.
      if (req.body && req.body.mobile !== undefined) {
        v.mobile = normMobile(req.body.mobile);
        if (!/^[6-9]\d{9}$/.test(v.mobile)) {
          await client.query('ROLLBACK');
          return res.status(400).json({ error: 'Enter a valid 10-digit mobile number.' });
        }
      }
      // A mobile number that belongs to a family is only used after "Add to this family".
      const fam = await familyByMobile(client, v.mobile);
      if (fam && !(req.body && req.body.join_family === true)) {
        await client.query('ROLLBACK');
        return res.status(409).json({
          error: `This mobile number already belongs to family ${fidText(fam.id)}. Add the voter to that family, or use a different number.`,
          family_taken: true, family: fam,
        });
      }
      await applyRoll(client, v);
      const dup = await findDuplicates(v, { client });
      if (dup.level === 'exact') {
        await client.query('DELETE FROM review_queue WHERE id = $1', [id]);
        await client.query('COMMIT');
        return res.status(409).json({ error: 'This voter was already verified - removed from the queue.' });
      }
      await insertVoter(client, v, req.user.id, dup.matches.map((m) => m.id), { via: 'review' });
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
    `SELECT v.name, v.name_te, v.serial_no, v.door_no, v.mobile, v.double_vote, v.double_vote_note, v.street, v.family_votes, v.notes, v.verified_at,
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
  const lines = ['Family ID,Name,Name (Telugu),Serial No,Door No,Mobile,Street,Family Votes,Double Vote,Double Vote Note,Notes,Verified By,Verified At,Family Created By,Money Given,Money Ticked By,Money Ticked At'];
  for (const r of rows) {
    lines.push([fid(r.family_id), r.name, r.name_te, r.serial_no, r.door_no, r.mobile, r.street, r.family_votes,
      r.double_vote ? 'Yes' : 'No', r.double_vote_note, r.notes, r.verified_by_name,
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
