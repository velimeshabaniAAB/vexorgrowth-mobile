import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);
console.log("Databaza:", new URL(process.env.DATABASE_URL).host);

// Shto kolonat që mungojnë (nuk prek ato që ekzistojnë)
await sql`ALTER TABLE sherbimet ADD COLUMN IF NOT EXISTS kategoria TEXT`;
await sql`ALTER TABLE sherbimet ADD COLUMN IF NOT EXISTS afati TEXT`;
await sql`ALTER TABLE sherbimet ADD COLUMN IF NOT EXISTS menyra TEXT`;
await sql`ALTER TABLE sherbimet ADD COLUMN IF NOT EXISTS vende INTEGER NOT NULL DEFAULT 0`;
await sql`ALTER TABLE sherbimet ADD COLUMN IF NOT EXISTS pershkrimi TEXT`;
await sql`ALTER TABLE sherbimet ADD COLUMN IF NOT EXISTS perfshin TEXT[]`;
await sql`ALTER TABLE sherbimet ADD COLUMN IF NOT EXISTS per_ke TEXT`;

// Tri shërbimet e Vexor
await sql`INSERT INTO sherbimet (id, emri, kategoria, afati, menyra, vende, pershkrimi, perfshin, per_ke) VALUES
  ('1', 'Auditim i monetizimit', 'Analizë', '2 ditë', 'Online, me linkun e profilit', 3,
   'Analizojmë profilin tënd dhe të tregojmë si mund të fitosh nga audienca që ke tashmë.',
   ARRAY['Analiza e profilit', 'Idetë për produkte', 'Plani i fitimit', 'Takim shpjegues'],
   'Kreatorë me 10k–200k ndjekës që ende nuk shesin produkte.'),
  ('2', 'Ebook me kreatorin', 'Produkt digjital', '7 ditë', 'Takim në Zoom', 2,
   'Ndërtojmë bashkë një ebook nga njohuritë e tua, gati për t''u shitur.',
   ARRAY['Struktura dhe kapitujt', 'Shkrimi dhe redaktimi', 'Fletë pune dhe materiale bonus', 'Kopertina dhe faqja e shitjes'],
   'Kreatorë që marrin vazhdimisht të njëjtat pyetje nga ndjekësit.'),
  ('3', 'Lansimi i produktit', 'Marketing', '10 ditë', 'Takim në Zoom', 0,
   'E çojmë produktin tënd te audienca fazë pas faze, që shitjet e para të vijnë që në javën e lansimit.',
   ARRAY['Lista e pritjes', 'Faqja e shitjes dhe emailat', 'Skripte për video dhe story', 'Raport pas lansimit'],
   'Kreatorë që kanë një produkt gati dhe duan shitjet e para.')
ON CONFLICT (id) DO NOTHING`;

console.table(await sql`SELECT id, emri, kategoria, afati FROM sherbimet ORDER BY id`);
console.log("✅ Shërbimet gati");