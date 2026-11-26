import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);
console.log("Databaza:", new URL(process.env.DATABASE_URL).host);
const OPERATORI = "330841884"; // ID-ja jote GitHub (si te bej-pronare.mjs)

// Produktet individuale dhe paketat e reja. Shërbimet e vjetra (1, 2, 3) mbeten.
const rreshtat = [
  ["ebook", "eBook / digital guide", "Individuale", "A digital book that takes the reader step by step to the solution of one problem.", ["6–10 chapters, 10,000–25,000 words", "Designed cover", "2–4 bonus materials"], "Creators launching their first product."],
  ["kurs", "Video course", "Individuale", "A complete course in six phases, from the start to the student's result.", ["Full script for every module", "Teleprompter-ready", "Worksheet for every module"], "Creators who speak on camera."],
  ["mjete", "Digital toolkit", "Individuale", "Templates, checklists and SOPs around one specific problem.", ["Ready-made templates", "Checklists", "SOP: step-by-step procedure"], "Audiences who want action."],
  ["coaching", "Coaching / mentoring program", "Individuale", "Direct work with clients, with a complete week-by-week structure.", ["2–14 weeks", "Worksheets every week", "A guide for every session"], "Premium offer."],
  ["starter", "Starter", "Paketë", "Your first product, no camera needed.", ["eBook or digital toolkit", "Sales page", "Hosting and payments"], "Creators starting from zero."],
  ["launch", "Launch", "Paketë", "A complete course and a launch with an email list.", ["Video course with ready scripts", "Sales page and email sequence", "Pilot launch"], "Creators ready to launch."],
  ["premium", "Premium", "Paketë", "A high-end offer with direct client work.", ["Coaching program", "Webinar launch", "Social media content"], "Premium offer."],
];

for (const [id, emri, kategoria, pershkrimi, perfshin, perKe] of rreshtat) {
  await sql`INSERT INTO sherbimet (id, emri, kategoria, afati, menyra, vende, pershkrimi, perfshin, per_ke, operator_id)
    VALUES (${id}, ${emri}, ${kategoria}, 'After the call', 'Zoom meeting', 0, ${pershkrimi}, ${perfshin}, ${perKe}, ${OPERATORI})
    ON CONFLICT (id) DO UPDATE SET emri = EXCLUDED.emri, kategoria = EXCLUDED.kategoria,
      afati = EXCLUDED.afati, menyra = EXCLUDED.menyra,
      pershkrimi = EXCLUDED.pershkrimi, perfshin = EXCLUDED.perfshin, per_ke = EXCLUDED.per_ke`;
}

// Shërbimet e vjetra (1, 2, 3) në anglisht, që edhe kërkesat e vjetra të duken njësoj.
await sql`UPDATE sherbimet SET emri = 'Monetisation audit', afati = '2 days', menyra = 'Online, with your profile link',
  pershkrimi = 'We analyse your profile and show you how to earn from the audience you already have.',
  perfshin = ARRAY['Profile analysis', 'Product ideas', 'Earning plan', 'Walkthrough meeting'],
  per_ke = 'Creators with 10k–200k followers who don''t sell products yet.' WHERE id = '1'`;
await sql`UPDATE sherbimet SET emri = 'eBook with the creator', afati = '7 days', menyra = 'Zoom meeting',
  pershkrimi = 'Together we build an eBook from your knowledge, ready to sell.',
  perfshin = ARRAY['Structure and chapters', 'Writing and editing', 'Worksheets and bonus materials', 'Cover and sales page'],
  per_ke = 'Creators who keep getting the same questions from followers.' WHERE id = '2'`;
await sql`UPDATE sherbimet SET emri = 'Product launch', afati = '10 days', menyra = 'Zoom meeting',
  pershkrimi = 'We take your product to your audience step by step, so the first sales come in launch week.',
  perfshin = ARRAY['Waitlist', 'Sales page and emails', 'Video and story scripts', 'Post-launch report'],
  per_ke = 'Creators who have a product ready and want their first sales.' WHERE id = '3'`;

console.table(await sql`SELECT id, emri, kategoria, operator_id FROM sherbimet ORDER BY kategoria, id`);
console.log("✅ Services are now in English");
