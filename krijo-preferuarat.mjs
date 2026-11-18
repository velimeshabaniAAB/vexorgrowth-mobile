import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);
console.log("Databaza:", new URL(process.env.DATABASE_URL).host);

await sql`CREATE TABLE IF NOT EXISTS te_preferuarat_vexor (
  github_id TEXT NOT NULL REFERENCES profilet_vexor(github_id),
  sherbim_id TEXT NOT NULL REFERENCES sherbimet(id),
  krijuar TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (github_id, sherbim_id)
)`;

console.table(await sql`SELECT column_name FROM information_schema.columns
  WHERE table_name = 'te_preferuarat_vexor' ORDER BY ordinal_position`);
console.log("✅ Tabela e të preferuarave gati");