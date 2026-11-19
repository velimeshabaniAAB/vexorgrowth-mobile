import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);
console.log("Databaza:", new URL(process.env.DATABASE_URL).host);

// Takimi i kërkesës së pranuar: data, ora dhe linku i Zoom.
await sql`ALTER TABLE kerkesat_vexor ADD COLUMN IF NOT EXISTS data_takimit DATE`;
await sql`ALTER TABLE kerkesat_vexor ADD COLUMN IF NOT EXISTS ora_takimit TEXT`;
await sql`ALTER TABLE kerkesat_vexor ADD COLUMN IF NOT EXISTS zoom_link TEXT`;

console.table(await sql`SELECT column_name FROM information_schema.columns
  WHERE table_name = 'kerkesat_vexor' ORDER BY ordinal_position`);
console.log("✅ Kolonat e takimit gati");