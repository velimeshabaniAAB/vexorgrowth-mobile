import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);
console.log("Databaza:", new URL(process.env.DATABASE_URL).host);

// Kodi personal i kërkesës (për linkun /kerkesa/[kodi]) dhe koha e pranimit.
await sql`ALTER TABLE kerkesat_vexor ADD COLUMN IF NOT EXISTS kodi TEXT UNIQUE`;
await sql`ALTER TABLE kerkesat_vexor ADD COLUMN IF NOT EXISTS pranuar_me TIMESTAMPTZ`;

// Kërkesave të vjetra u jepet një kod i rastësishëm.
await sql`UPDATE kerkesat_vexor
  SET kodi = substr(md5(random()::text || id::text || clock_timestamp()::text), 1, 16)
  WHERE kodi IS NULL`;

console.table(await sql`SELECT id, emri, statusi, kodi FROM kerkesat_vexor ORDER BY id`);
console.log("✅ Kodet personale gati");