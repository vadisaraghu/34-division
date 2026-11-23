// Helpers that turn messy user input into comparable keys.

function clean(s) {
  // Control characters (e.g. a NUL from a PDF export) are dropped: Postgres rejects them.
  // eslint-disable-next-line no-control-regex
  return String(s ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').replace(/\s+/g, ' ').trim();
}

// "  K.  Venkata   RAO " -> "k venkata rao"
function normName(name) {
  return clean(name)
    .toLowerCase()
    .normalize('NFKC')
    .replace(/[^\p{L}\p{M}\p{N} ]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Order-independent key so "Rao Venkata K" == "K Venkata Rao".
function nameKey(name) {
  return normName(name).split(' ').filter(Boolean).sort().join(' ');
}

// Keep the last 10 digits ("+91 98480-12345" -> "9848012345").
function normMobile(m) {
  const d = String(m ?? '').replace(/\D/g, '');
  return d.length > 10 ? d.slice(-10) : d;
}

function normSerial(s) {
  return clean(s).toUpperCase().replace(/\s+/g, '');
}

function normStreet(s) {
  return clean(s).toLowerCase().replace(/[^\p{L}\p{M}\p{N} ]+/gu, ' ').replace(/\s+/g, ' ').trim();
}

// Levenshtein-based similarity 0..1
function similarity(a, b) {
  if (!a || !b) return 0;
  if (a === b) return 1;
  const m = a.length, n = b.length;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return 1 - prev[n] / Math.max(m, n);
}

// Sound-alike key for English spellings of Telugu names, so different spellings of
// the same name compare equal: "Srinivasarao" ~ "Sreenivasa Ravu", "Shek" ~ "Shaik",
// "Swathi" ~ "Swati", "Mallikharjuna" ~ "Mallikarjuna".
function phonWord(w) {
  let s = w.toLowerCase().replace(/[^a-z]/g, '');
  s = s.replace(/ravu$/, 'rao').replace(/rau$/, 'rao');
  s = s.replace(/([bcdgkpt])h/g, '$1').replace(/sh/g, 's').replace(/ph/g, 'p').replace(/z/g, 'j').replace(/q/g, 'k')
    .replace(/x/g, 'ks').replace(/w/g, 'v').replace(/y/g, 'i').replace(/ai/g, 'e').replace(/ee/g, 'i').replace(/oo/g, 'u')
    .replace(/ou/g, 'u');
  return s.replace(/(.)\1+/g, '$1');
}
function phonKey(name) {
  return normName(name).split(' ').map(phonWord).filter(Boolean).join(' ');
}

// How well a typed name matches a name from the voter list (0..1), allowing
// different word order, joined/split words ("Koteswarao" vs "Koteswara Rao")
// and small spelling differences.
function nameScore(a, b) {
  const A = phonKey(a).split(' ').filter(Boolean);
  const B = phonKey(b).split(' ').filter(Boolean);
  if (!A.length || !B.length) return 0;
  if (A.join('') === B.join('') || [...A].sort().join(' ') === [...B].sort().join(' ')) return 1;
  const withPairs = (T) => {
    const out = [...T];
    for (let i = 0; i < T.length; i++) for (let j = 0; j < T.length; j++) if (i !== j) out.push(T[i] + T[j]);
    return out;
  };
  const Ax = withPairs(A);
  const Bx = withPairs(B);
  const best = (t, pool) => Math.max(...pool.map((p) => similarity(t, p)));
  // Each word on one side is compared with the closest word (or pair of words) on the other.
  const cover = (T, pool) => {
    const w = T.map((t) => Math.max(1, t.length));
    const sum = T.reduce((acc, t, i) => acc + best(t, pool) * w[i], 0);
    return sum / w.reduce((x, y) => x + y, 0);
  };
  return (cover(A, Bx) + cover(B, Ax)) / 2;
}
const NAME_MATCH = 0.68;

// Is the typed name the same person as the list name? Besides the overall score,
// every typed word must resemble some word of the list name. That stops a shared
// family surname alone from matching ("Kandula Sita" is not "Ramarao Kandula").
function sameName(typed, listName) {
  const score = nameScore(typed, listName);
  if (score >= 0.999) return true;
  if (score < NAME_MATCH) return false;
  const A = phonKey(typed).split(' ').filter(Boolean);
  const B = phonKey(listName).split(' ').filter(Boolean);
  const pool = [...B];
  for (let i = 0; i < B.length; i++) for (let j = 0; j < B.length; j++) if (i !== j) pool.push(B[i] + B[j]);
  const fits = (w, min) => Math.max(...pool.map((p) => similarity(w, p))) >= min;
  // A typed word may also be half of a name written as one word ("Uma Devi" ~ "Umadevi").
  return A.every((a, i) => fits(a, 0.6)
    || (i > 0 && fits(A[i - 1] + a, 0.75))
    || (i < A.length - 1 && fits(a + A[i + 1], 0.75)));
}

// Validate & normalise an incoming voter payload. Returns { value } or { error }.
function validateVoter(body) {
  const name = clean(body.name);
  const serial_no = normSerial(body.serial_no);
  const mobile = normMobile(body.mobile);
  const street = clean(body.street);
  const fv = Number.parseInt(body.family_votes, 10);
  const notes = clean(body.notes).slice(0, 500);
  const door_no = clean(body.door_no).slice(0, 60);
  const double_vote = body.double_vote === true || /^(true|yes|y|1)$/i.test(String(body.double_vote ?? ''));
  const double_vote_note = double_vote ? clean(body.double_vote_note).slice(0, 200) : '';

  if (name.length < 2) return { error: 'Please enter the voter name.' };
  if (name.length > 120) return { error: 'Name is too long.' };
  if (!serial_no) return { error: 'Please enter the serial number.' };
  if (serial_no.length > 30) return { error: 'Serial number is too long.' };
  if (!/^[6-9]\d{9}$/.test(mobile)) return { error: 'Enter a valid 10-digit mobile number.' };
  if (!street) return { error: 'Please enter the street name.' };
  if (street.length > 120) return { error: 'Street name is too long.' };
  if (!Number.isFinite(fv) || fv < 1 || fv > 99) return { error: 'Family votes must be between 1 and 99.' };

  return {
    value: {
      name,
      name_key: nameKey(name),
      serial_no,
      mobile,
      street,
      street_key: normStreet(street),
      family_votes: fv,
      notes,
      door_no,
      double_vote,
      double_vote_note,
    },
  };
}

module.exports = {
  clean, normName, nameKey, normMobile, normSerial, normStreet, similarity, validateVoter, phonKey, nameScore, sameName,
};
