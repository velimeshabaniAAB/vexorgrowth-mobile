import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);
const ID = "330841884";

// Të gjitha shërbimet i menaxhon operatorja Velime.
await sql`UPDATE sherbimet SET operator_id = ${ID}`;

console.table(await sql`SELECT id, emri, operator_id FROM sherbimet ORDER BY id`);
console.log("✅ Je pronare e të gjitha shërbimeve");