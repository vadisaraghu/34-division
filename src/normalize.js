// Helpers that turn messy user input into comparable keys.

function clean(s) {
  return String(s ?? '').replace(/\s+/g, ' ').trim();
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

// Validate & normalise an incoming voter payload. Returns { value } or { error }.
function validateVoter(body) {
  const name = clean(body.name);
  const serial_no = normSerial(body.serial_no);
  const mobile = normMobile(body.mobile);
  const street = clean(body.street);
  const fv = Number.parseInt(body.family_votes, 10);
  const notes = clean(body.notes).slice(0, 500);

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
    },
  };
}

module.exports = { clean, normName, nameKey, normMobile, normSerial, normStreet, similarity, validateVoter };
