import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);
const ID = "330841884";

await sql`UPDATE profilet_vexor SET roli = 'operator' WHERE github_id = ${ID}`;
await sql`UPDATE sherbimet SET operator_id = ${ID} WHERE id = '2'`;

console.table(await sql`SELECT id, emri, operator_id FROM sherbimet ORDER BY id`);
console.table(await sql`SELECT github_id, emri, roli FROM profilet_vexor`);
console.log("✅ Gati");