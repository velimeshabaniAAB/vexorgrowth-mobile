import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);
console.log("Databaza:", new URL(process.env.DATABASE_URL).host);
const OPERATORI = "330841884"; // ID-ja jote GitHub (si te bej-pronare.mjs)

// Produktet individuale dhe paketat e reja. Shërbimet e vjetra (1, 2, 3) mbeten.
const rreshtat = [
  ["ebook", "eBook / udhëzues digjital", "Individuale", "Libër digjital që e çon lexuesin hap pas hapi drejt zgjidhjes së një problemi.", ["6–10 kapituj, 10,000–25,000 fjalë", "Kopertinë e dizajnuar", "2–4 materiale bonus"], "Kreatorë që nisin produktin e parë."],
  ["kurs", "Kurs me video", "Individuale", "Kurs i plotë në gjashtë faza. Merr skriptet gati: ti vetëm i lexon para kamerës.", ["Skript i plotë për çdo modul", "Gati për teleprompter", "Fletë pune për çdo modul"], "Kreatorë që flasin para kamerës."],
  ["mjete", "Paketë mjetesh digjitale", "Individuale", "Shabllone, checklista dhe SOP rreth një problemi specifik.", ["Shabllone të gatshme", "Checklista", "SOP: procedurë hap pas hapi"], "Audienca që duan veprim."],
  ["coaching", "Program coaching-u / mentorimi", "Individuale", "Punë direkte me klientët, me strukturë të plotë javë pas jave.", ["2–14 javë", "Fletë pune çdo javë", "Udhëzues për çdo seancë"], "Ofertë premium."],
  ["starter", "Starter", "Paketë", "Produkti i parë, pa kamera.", ["eBook ose paketë mjetesh", "Faqe shitjeje", "Hostimi dhe pagesat"], "Kreatorë që nisin nga zero."],
  ["launch", "Launch", "Paketë", "Kurs i plotë dhe lansim me listë email-esh.", ["Kurs me video, me skripte gati", "Faqe shitjeje dhe sekuencë email-esh", "Lansim pilot"], "Kreatorë gati për lansim."],
  ["premium", "Premium", "Paketë", "Ofertë e nivelit të lartë, me punë direkte me klientët.", ["Program coaching-u", "Lansim me webinar", "Përmbajtje për rrjete sociale"], "Ofertë premium."],
];

for (const [id, emri, kategoria, pershkrimi, perfshin, perKe] of rreshtat) {
  await sql`INSERT INTO sherbimet (id, emri, kategoria, afati, menyra, vende, pershkrimi, perfshin, per_ke, operator_id)
    VALUES (${id}, ${emri}, ${kategoria}, 'Pas takimit', 'Takim në Zoom', 0, ${pershkrimi}, ${perfshin}, ${perKe}, ${OPERATORI})
    ON CONFLICT (id) DO UPDATE SET emri = EXCLUDED.emri, kategoria = EXCLUDED.kategoria,
      pershkrimi = EXCLUDED.pershkrimi, perfshin = EXCLUDED.perfshin, per_ke = EXCLUDED.per_ke`;
}

console.table(await sql`SELECT id, emri, kategoria, operator_id FROM sherbimet ORDER BY kategoria, id`);
console.log("✅ Produktet dhe paketat gati");
