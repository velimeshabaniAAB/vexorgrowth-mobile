import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);
console.log("Databaza:", new URL(process.env.DATABASE_URL).host);

// Detyrat e operatorit, me afat dhe (opsionale) lidhje me një kërkesë.
await sql`CREATE TABLE IF NOT EXISTS detyrat_vexor (
  id SERIAL PRIMARY KEY,
  github_id TEXT NOT NULL REFERENCES profilet_vexor(github_id),
  titulli TEXT NOT NULL CHECK (length(titulli) BETWEEN 1 AND 200),
  afati DATE,
  kryer BOOLEAN NOT NULL DEFAULT false,
  krijuar TIMESTAMPTZ NOT NULL DEFAULT now()
)`;

console.table(await sql`SELECT column_name FROM information_schema.columns
  WHERE table_name = 'detyrat_vexor' ORDER BY ordinal_position`);
console.log("✅ Tabela e detyrave gati");