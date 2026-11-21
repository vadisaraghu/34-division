// Duplicate detection: compares a new voter against everything already verified,
// using ALL fields (name, serial number, mobile, street).
const { pool } = require('./db');
const { similarity } = require('./normalize');

const SELECT_VOTER = `
  SELECT v.id, v.name, v.name_key, v.serial_no, v.mobile, v.street, v.street_key, v.family_votes,
         v.notes, v.verified_at, u.full_name AS verified_by_name,
         f.id AS family_id, fu.full_name AS family_created_by,
         v.money_given, v.money_at, mu.full_name AS money_by_name,
         EXISTS (SELECT 1 FROM money_log ml WHERE ml.voter_id = v.id) AS money_logged
  FROM voters v LEFT JOIN users u ON u.id = v.verified_by
  LEFT JOIN families f ON f.mobile = v.mobile
  LEFT JOIN users fu ON fu.id = f.created_by
  LEFT JOIN users mu ON mu.id = v.money_by`;

// Share of the typed name's words (>= 3 letters) that appear in the other name,
// capped at 0.9 so it never counts as an exact name match.
// "kandula venkata" vs "kandula rao venkata" -> 0.9
function tokenOverlap(typed, other) {
  const a = typed.split(' ').filter((w) => w.length >= 3);
  if (!a.length) return 0;
  const b = new Set(other.split(' '));
  return (a.filter((w) => b.has(w)).length / a.length) * 0.9;
}

/**
 * Returns { level, matches }
 *   level: 'exact'   -> same voter already verified, must be blocked
 *          'likely'  -> strong match, volunteer must confirm "different person"
 *          'possible'-> weak match, volunteer must confirm "different person"
 *          'none'    -> safe to save
 *   matches: possible duplicates; family: same-mobile members (info only)
 */
async function findDuplicates(v, { excludeId = null, client = pool } = {}) {
  const { rows } = await client.query(
    `${SELECT_VOTER}
     WHERE (v.serial_no = $1 OR v.mobile = $2 OR v.name_key = $3
            OR (length($3) >= 3 AND (similarity(v.name_key, $3) > 0.4 OR word_similarity($3, v.name_key) > 0.6)))
       AND ($4::int IS NULL OR v.id <> $4)
     LIMIT 60`,
    [v.serial_no, v.mobile, v.name_key, excludeId]
  );

  const scored = rows
    .map((r) => {
      const nameSim = r.name_key === v.name_key ? 1 : Math.max(similarity(r.name_key, v.name_key), tokenOverlap(v.name_key, r.name_key));
      const sameSerial = r.serial_no === v.serial_no;
      const sameMobile = r.mobile === v.mobile;
      const sameStreet = r.street_key === v.street_key;

      let score = 0;
      if (nameSim >= 0.6) score += Math.round(50 * nameSim);
      if (sameSerial) score += 35;
      if (sameMobile) score += 25;
      if (sameStreet) score += 10;

      const nameLike = nameSim >= 0.6;
      let level = 'none';
      if (nameSim === 1 && (sameSerial || sameMobile)) level = 'exact';
      else if (nameLike && (sameSerial || sameMobile || sameStreet)) level = 'likely';
      else if (nameLike || sameSerial) level = 'possible';
      // Same mobile but a clearly different name = another member of the family.
      // Shown for information only; it never blocks saving.
      else if (sameMobile) level = 'family';

      const fields = [];
      if (nameSim === 1) fields.push('name');
      else if (nameSim >= 0.6) fields.push('similar name');
      if (sameSerial) fields.push('serial no');
      if (sameMobile) fields.push('mobile');
      if (sameStreet) fields.push('street');

      const { name_key, street_key, ...pub } = r;
      return { ...pub, score, level, matched_on: fields };
    })
    .filter((m) => m.level !== 'none')
    .sort((a, b) => b.score - a.score)
    .slice(0, 12);

  const rank = { exact: 3, likely: 2, possible: 1, family: 0, none: 0 };
  const level = scored.reduce((acc, m) => (rank[m.level] > rank[acc] ? m.level : acc), 'none');
  const matches = scored.filter((m) => m.level !== 'family');
  const family = scored.filter((m) => m.level === 'family');
  return { level, matches, family };
}

module.exports = { findDuplicates, SELECT_VOTER };
