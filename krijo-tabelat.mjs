import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);
console.log("Databaza:", new URL(process.env.DATABASE_URL).host);

await sql`CREATE TABLE IF NOT EXISTS profilet_vexor (
  github_id TEXT PRIMARY KEY,
  emri TEXT NOT NULL,
  roli TEXT NOT NULL DEFAULT 'kreator' CHECK (roli IN ('kreator', 'operator'))
)`;
await sql`ALTER TABLE sherbimet ADD COLUMN IF NOT EXISTS operator_id TEXT REFERENCES profilet_vexor(github_id)`;

// Tabela e kërkesave (mungonte në këtë databazë)
await sql`CREATE TABLE IF NOT EXISTS kerkesat_vexor (
  id SERIAL PRIMARY KEY,
  sherbim_id TEXT NOT NULL REFERENCES sherbimet(id),
  emri TEXT NOT NULL,
  emaili TEXT NOT NULL,
  linku TEXT,
  mesazhi TEXT,
  statusi TEXT NOT NULL DEFAULT 'ne_pritje'
    CHECK (statusi IN ('ne_pritje', 'pranuar', 'refuzuar')),
  krijuar TIMESTAMPTZ NOT NULL DEFAULT now()
)`;

await sql`INSERT INTO profilet_vexor (github_id, emri, roli)
  VALUES ('DEMO-OPERATOR-2', 'Operatori tjetër (demo)', 'operator')
  ON CONFLICT (github_id) DO NOTHING`;
await sql`UPDATE sherbimet SET operator_id = 'DEMO-OPERATOR-2' WHERE id = '1' AND operator_id IS NULL`;
await sql`INSERT INTO kerkesat_vexor (sherbim_id, emri, emaili, mesazhi)
  SELECT '1', 'Kreator Demo 1', 'demo1@example.com', 'Kërkesë provë për auditimin.'
  WHERE NOT EXISTS (SELECT 1 FROM kerkesat_vexor WHERE emaili = 'demo1@example.com')`;
await sql`INSERT INTO kerkesat_vexor (sherbim_id, emri, emaili, mesazhi)
  SELECT '2', 'Kreator Demo 2', 'demo2@example.com', 'Kërkesë provë për ebook.'
  WHERE NOT EXISTS (SELECT 1 FROM kerkesat_vexor WHERE emaili = 'demo2@example.com')`;

console.table(await sql`SELECT id, sherbim_id, emri, statusi FROM kerkesat_vexor ORDER BY id`);
console.log("✅ Gati");