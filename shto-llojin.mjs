import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);
console.log("Databaza:", new URL(process.env.DATABASE_URL).host);

// Lloji i kërkesës: për një shërbim, ose bisedë konsultuese.
await sql`ALTER TABLE kerkesat_vexor
  ADD COLUMN IF NOT EXISTS lloji TEXT NOT NULL DEFAULT 'sherbim'`;
await sql`ALTER TABLE kerkesat_vexor DROP CONSTRAINT IF EXISTS kerkesat_vexor_lloji_check`;
await sql`ALTER TABLE kerkesat_vexor
  ADD CONSTRAINT kerkesat_vexor_lloji_check CHECK (lloji IN ('sherbim', 'konsulte'))`;

console.table(await sql`SELECT id, emri, statusi, lloji FROM kerkesat_vexor ORDER BY id`);
console.log("✅ Kolona lloji gati");
