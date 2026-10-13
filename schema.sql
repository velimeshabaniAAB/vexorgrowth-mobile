-- Skedari: schema.sql (pranë package.json)
-- Të dhëna fiktive për laboratorin; ekzekutohet në Neon SQL Editor.
CREATE TABLE IF NOT EXISTS sherbimet (
  id TEXT PRIMARY KEY,
  emri TEXT NOT NULL,
  kategoria TEXT NOT NULL,
  afati TEXT NOT NULL,
  menyra TEXT NOT NULL,
  vende INTEGER NOT NULL CHECK (vende >= 0)
);

INSERT INTO sherbimet (id, emri, kategoria, afati, menyra, vende)
VALUES
  ('1', 'Auditim i monetizimit', 'Analizë', '2 ditë', 'Online, me linkun e profilit', 3),
  ('2', 'Ebook me kreatorin', 'Produkt digjital', '7 ditë', 'Takim në Zoom', 2),
  ('3', 'Lansimi i produktit', 'Marketing', '10 ditë', 'Takim në Zoom', 0)
ON CONFLICT (id) DO NOTHING;

SELECT * FROM sherbimet ORDER BY id;