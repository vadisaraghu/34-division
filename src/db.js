const { Pool } = require('pg');

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set. Copy .env.example to .env and fill it in.');
  process.exit(1);
}

// TLS is configured explicitly (full certificate verification), so strip sslmode
// options from the URL to avoid pg's ambiguous-sslmode warning.
const dbUrl = new URL(process.env.DATABASE_URL);
const isLocal = ['localhost', '127.0.0.1'].includes(dbUrl.hostname);
dbUrl.searchParams.delete('sslmode');
dbUrl.searchParams.delete('channel_binding');

const pool = new Pool({
  connectionString: dbUrl.toString(),
  ssl: isLocal ? false : { rejectUnauthorized: true },
  max: 5,
});

const SCHEMA = `
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  username      TEXT NOT NULL UNIQUE,
  full_name     TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'volunteer' CHECK (role IN ('admin','volunteer')),
  active        BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Self-registered volunteers start unapproved until an admin approves them.
ALTER TABLE users ADD COLUMN IF NOT EXISTS approved BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS mobile TEXT NOT NULL DEFAULT '';

CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  user_id    INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS voters (
  id            SERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  name_key      TEXT NOT NULL,
  serial_no     TEXT NOT NULL,
  mobile        TEXT NOT NULL,
  street        TEXT NOT NULL,
  street_key    TEXT NOT NULL,
  family_votes  INT  NOT NULL,
  notes         TEXT NOT NULL DEFAULT '',
  reviewed_matches INT[] NOT NULL DEFAULT '{}',
  verified_by   INT REFERENCES users(id) ON DELETE SET NULL,
  verified_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- The same person (name) can never be stored twice under the same serial number.
CREATE UNIQUE INDEX IF NOT EXISTS voters_name_serial_uq ON voters (name_key, serial_no);
CREATE INDEX IF NOT EXISTS voters_serial_idx ON voters (serial_no);
CREATE INDEX IF NOT EXISTS voters_mobile_idx ON voters (mobile);
CREATE INDEX IF NOT EXISTS voters_street_idx ON voters (street_key);
CREATE INDEX IF NOT EXISTS voters_name_trgm ON voters USING gin (name_key gin_trgm_ops);

-- One family = everyone sharing a mobile number. Records who created it
-- (the volunteer who added its first member).
CREATE TABLE IF NOT EXISTS families (
  id          SERIAL PRIMARY KEY,
  mobile      TEXT NOT NULL UNIQUE,
  created_by  INT REFERENCES users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Money check-box per voter, with who ticked it and when.
ALTER TABLE voters ADD COLUMN IF NOT EXISTS money_given BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE voters ADD COLUMN IF NOT EXISTS money_by INT REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE voters ADD COLUMN IF NOT EXISTS money_at TIMESTAMPTZ;

-- Full history of every money tick / untick.
CREATE TABLE IF NOT EXISTS money_log (
  id         SERIAL PRIMARY KEY,
  voter_id   INT NOT NULL REFERENCES voters(id) ON DELETE CASCADE,
  given      BOOLEAN NOT NULL,
  user_id    INT REFERENCES users(id) ON DELETE SET NULL,
  at         TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- Backfill families for voters saved before families existed.
INSERT INTO families (mobile, created_by, created_at)
SELECT DISTINCT ON (mobile) mobile, verified_by, verified_at FROM voters ORDER BY mobile, verified_at
ON CONFLICT (mobile) DO NOTHING;

-- Door number of the voter (from the reference list or typed in).
ALTER TABLE voters ADD COLUMN IF NOT EXISTS door_no TEXT NOT NULL DEFAULT '';

-- Reference voter list (e.g. the electoral roll) uploaded by the admin.
-- Used only for suggestions / auto-fill on the Add voter form; it is NOT the
-- verified list. The same serial can appear with different names (several
-- polling parts), but a name + serial pair is stored once.
CREATE TABLE IF NOT EXISTS reference_voters (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  name_key    TEXT NOT NULL,
  name_norm   TEXT NOT NULL,
  serial_no   TEXT NOT NULL,
  door_no     TEXT NOT NULL DEFAULT '',
  uploaded_by INT REFERENCES users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS reference_name_serial_uq ON reference_voters (name_key, serial_no);
CREATE INDEX IF NOT EXISTS reference_serial_idx ON reference_voters (serial_no);
CREATE INDEX IF NOT EXISTS reference_name_trgm ON reference_voters USING gin (name_norm gin_trgm_ops);
-- Extra details from the official roll (all optional for other uploads).
ALTER TABLE reference_voters ADD COLUMN IF NOT EXISTS name_te TEXT NOT NULL DEFAULT '';
ALTER TABLE reference_voters ADD COLUMN IF NOT EXISTS name_phon TEXT NOT NULL DEFAULT '';
ALTER TABLE reference_voters ADD COLUMN IF NOT EXISTS relation_type TEXT NOT NULL DEFAULT '';
ALTER TABLE reference_voters ADD COLUMN IF NOT EXISTS relation_en TEXT NOT NULL DEFAULT '';
ALTER TABLE reference_voters ADD COLUMN IF NOT EXISTS relation_te TEXT NOT NULL DEFAULT '';
ALTER TABLE reference_voters ADD COLUMN IF NOT EXISTS age INT;
ALTER TABLE reference_voters ADD COLUMN IF NOT EXISTS gender TEXT NOT NULL DEFAULT '';
ALTER TABLE reference_voters ADD COLUMN IF NOT EXISTS epic TEXT NOT NULL DEFAULT '';
ALTER TABLE reference_voters ADD COLUMN IF NOT EXISTS part_no TEXT NOT NULL DEFAULT '';
ALTER TABLE reference_voters ADD COLUMN IF NOT EXISTS listed_twice BOOLEAN NOT NULL DEFAULT FALSE;
CREATE INDEX IF NOT EXISTS reference_phon_trgm ON reference_voters USING gin (name_phon gin_trgm_ops);

-- Telugu name (from the voter list), double vote, and the voter-list name check.
ALTER TABLE voters ADD COLUMN IF NOT EXISTS name_te TEXT NOT NULL DEFAULT '';
ALTER TABLE voters ADD COLUMN IF NOT EXISTS double_vote BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE voters ADD COLUMN IF NOT EXISTS double_vote_note TEXT NOT NULL DEFAULT '';
-- '' = not checked yet / matches, 'mismatch' = admin must check, 'kept' = admin kept the typed name
ALTER TABLE voters ADD COLUMN IF NOT EXISTS roll_check TEXT NOT NULL DEFAULT '';

-- Who actually received the money (the voter, another family member, or someone else).
ALTER TABLE voters ADD COLUMN IF NOT EXISTS money_received_by TEXT NOT NULL DEFAULT '';
ALTER TABLE money_log ADD COLUMN IF NOT EXISTS received_by TEXT NOT NULL DEFAULT '';
-- Last edit of a family's details (mobile / street / family votes).
ALTER TABLE families ADD COLUMN IF NOT EXISTS updated_by INT REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE families ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ;

-- Rows from a bulk upload that look like possible duplicates wait here
-- until a volunteer decides "different person" or "duplicate".
CREATE TABLE IF NOT EXISTS review_queue (
  id           SERIAL PRIMARY KEY,
  data         JSONB NOT NULL,
  match_ids    INT[] NOT NULL DEFAULT '{}',
  uploaded_by  INT REFERENCES users(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
`;

async function migrate() {
  await pool.query(SCHEMA);
}

module.exports = { pool, migrate };
