// Të dhënat e kartave te Shërbimet (si te demoja).
// id-të janë të njëjta me rreshtat te tabela "sherbimet" (shih shto-oferten.mjs),
// që "Dërgo kërkesë" të ruajë kërkesën te shërbimi i duhur.

export type Grupi = { titull: string; pikat: string[] };

export type Oferta = {
  id: string;
  lloji: "individuale" | "paketa";
  emri: string;
  pershkrimi: string;
  thekso: string;        // fjalia në kutinë me vija
  shenja?: string;       // p.sh. "Pikë e fortë" ose "Më e zgjedhura"
  cmimi?: string;        // çmimi me të cilin kreatori e shet produktin
  perKe?: string;        // "Më i miri për"
  shkurt: string[];      // 3 pikat në kartë
  detajet: Grupi[];      // lista e plotë te "Detajet"
};

const ZOOM = "Oferta dhe çmimi pas takimit në Zoom";

export const OFERTA: Oferta[] = [
  {
    id: "ebook", lloji: "individuale", emri: "eBook / udhëzues digjital",
    pershkrimi: "Libër digjital që e çon lexuesin hap pas hapi drejt zgjidhjes së një problemi.",
    thekso: "Produkti më i lehtë për të filluar", cmimi: "$47 – $97", perKe: "Produktin e parë",
    shkurt: ["6–10 kapituj, 10,000–25,000 fjalë", "Kopertinë e dizajnuar", "2–4 materiale bonus"],
    detajet: [
      { titull: "Përmbajtja", pikat: ["Hyrje, 6–10 kapituj dhe përfundim", "10,000 – 25,000 fjalë", "Çdo kapitull ka një qëllim të qartë"] },
      { titull: "Bonuset dhe dizajni", pikat: ["2–4 materiale bonus (checklista, shabllone)", "Kopertinë e dizajnuar"] },
      { titull: "Shitja", pikat: ["Faqja e dyqanit me pyetje të shpeshta"] },
    ],
  },
  {
    id: "kurs", lloji: "individuale", emri: "Kurs me video", shenja: "Pikë e fortë",
    pershkrimi: "Kurs i plotë në gjashtë faza, nga fillimi deri te rezultati i studentit.",
    thekso: "Merr skriptet gati: ti vetëm i lexon para kamerës", cmimi: "$50 – $300", perKe: "Kreatorë që flasin para kamerës",
    shkurt: ["Skript i plotë për çdo modul", "Gati për teleprompter, pa improvizim", "Fletë pune për çdo modul"],
    detajet: [
      { titull: "Struktura", pikat: ["6 faza, me 3–5 module për fazë", "E ndërtuar rreth transformimit të studentit"] },
      { titull: "Skriptet gati", pikat: ["Skript i plotë për çdo modul (~1,100–1,300 fjalë)", "Gati për teleprompter: ti vetëm i lexon, pa improvizim"] },
      { titull: "Materialet", pikat: ["Fletë pune për çdo modul", "Ti vetëm incizon, ne bëjmë pjesën tjetër"] },
    ],
  },
  {
    id: "mjete", lloji: "individuale", emri: "Paketë mjetesh digjitale",
    pershkrimi: "Asete praktike rreth një problemi specifik, që blerësi i përdor menjëherë.",
    thekso: "Shabllone, checklista dhe SOP në një paketë", cmimi: "Sipas paketës", perKe: "Audienca që duan veprim",
    shkurt: ["Shabllone të gatshme", "Checklista", "SOP: procedurë hap pas hapi"],
    detajet: [
      { titull: "Asetet digjitale", pikat: ["Shabllone të gatshme", "Checklista", "SOP: procedurë hap pas hapi", "Fletë pune"] },
      { titull: "Fokusi", pikat: ["Gjithçka e ndërtuar rreth një problemi specifik", "Blerësi i përdor menjëherë", "Shitet si një paketë e vetme"] },
    ],
  },
  {
    id: "coaching", lloji: "individuale", emri: "Program coaching-u / mentorimi",
    pershkrimi: "Punë direkte me klientët, me strukturë të plotë javë pas jave.",
    thekso: "Strukturë e plotë javë pas jave", cmimi: "$1,000 – $7,000", perKe: "Ofertë premium",
    shkurt: ["2–14 javë, sipas zgjedhjes", "Fletë pune çdo javë", "Udhëzues për çdo seancë"],
    detajet: [
      { titull: "Javë pas jave", pikat: ["Kohëzgjatje sipas zgjedhjes: 2–14 javë", "Pesë etapa: java e parë vendos themelet", "Udhëzues për seancën e çdo jave"] },
      { titull: "Materialet çdo javë", pikat: ["Rreth 3 fletë pune në javë", "Skript për një video modul"] },
      { titull: "Oferta", pikat: ["5 propozime për emrin dhe pikën unike të programit", "Çmimi yt i rekomanduar: $1,000 – $7,000"] },
    ],
  },
  {
    id: "starter", lloji: "paketa", emri: "Starter", pershkrimi: "Produkti i parë, pa kamera.", thekso: ZOOM,
    shkurt: ["eBook ose paketë mjetesh", "Faqe shitjeje", "Hostimi dhe pagesat"],
    detajet: [
      { titull: "Auditimi", pikat: ["Analizë falas e profilit dhe audiencës", "Rekomandim: eBook apo paketë mjetesh"] },
      { titull: "Produkti (njëri nga të dy)", pikat: ["eBook: hyrje, 6–10 kapituj dhe përfundim, 10,000–25,000 fjalë", "2–4 materiale bonus dhe kopertinë e dizajnuar", "ose Paketë mjetesh: fletë pune, checklist, shabllon dhe SOP"] },
      { titull: "Shitja", pikat: ["Faqe shitjeje me tekst me zërin tënd", "Hostimi dhe pagesat, pa punë teknike për ty", "Rishikim dhe ndryshime para publikimit"] },
    ],
  },
  {
    id: "launch", lloji: "paketa", emri: "Launch", shenja: "Më e zgjedhura",
    pershkrimi: "Kurs i plotë dhe lansim me listë email-esh.", thekso: ZOOM,
    shkurt: ["Kurs me video, me skripte gati", "Faqe shitjeje dhe sekuencë email-esh", "Lansim pilot"],
    detajet: [
      { titull: "Kursi me video", pikat: ["6 faza, me 3–5 module për fazë", "Skript i plotë për çdo modul, gati për teleprompter", "Fletë pune për çdo modul"] },
      { titull: "Para lansimit", pikat: ["Material falas për email-e, që ndërton listën", "Postime që e ngrohin audiencën"] },
      { titull: "Lansimi dhe shitja", pikat: ["Faqe shitjeje dhe landing page", "Sekuencë email-esh për listën e pritjes dhe ditët e shitjes", "Lansim pilot me plan të qartë", "Hostimi dhe pagesat"] },
    ],
  },
  {
    id: "premium", lloji: "paketa", emri: "Premium",
    pershkrimi: "Ofertë e nivelit të lartë, me punë direkte me klientët.", thekso: ZOOM,
    shkurt: ["Program coaching-u (2–14 javë)", "Prezantim dhe lansim me webinar", "Përmbajtje për rrjete sociale"],
    detajet: [
      { titull: "Programi i coaching-ut", pikat: ["Kohëzgjatje sipas zgjedhjes: 2–14 javë", "Udhëzues për seancën e çdo jave dhe rreth 3 fletë pune në javë", "Skript për një video modul çdo javë", "5 propozime për emrin dhe pikën unike"] },
      { titull: "Webinari", pikat: ["Prezantim me 6–50 slajde dhe shënime për folësin", "Lansim me webinar"] },
      { titull: "Marketingu dhe shitja", pikat: ["Faqe shitjeje dhe email-e", "Përmbajtje për rrjete sociale dhe YouTube", "Hostimi dhe pagesat"] },
    ],
  },
];

export const MARKETINGU: [string, string][] = [
  ["Faqe shitjeje dhe landing page", "Tekst që tingëllon si ti dhe shet."],
  ["Material falas për email-e", "Ndërton listën para lansimit."],
  ["Sekuenca email-esh", "Për listën e pritjes dhe ditët e shitjes."],
  ["Video shitëse dhe skripte", "Gati për t'u lexuar para kamerës."],
  ["Postime për rrjete sociale", "E ngrohin audiencën para lansimit."],
  ["Përmbajtje për YouTube", "Kënde, tituj, thumbnail-e, përshkrime."],
  ["Lansim pilot ose me webinar", "Çdo material ndërtohet mbi të mëparshmin."],
  ["Hostimi dhe pagesat", "Produkti online, pa punë teknike."],
];

export const PYETJET: [string, string][] = [
  ["A duhet ta shkruaj unë përmbajtjen?", "Jo. Ti na jep njohurinë dhe zërin tënd në një bisedë, ne e ndërtojmë produktin dhe të gjithë tekstin. Ti vetëm e rishikon dhe e aprovon."],
  ["A duhet të dal para kamerës?", "Vetëm për kursin me video. Edhe atëherë merr skriptet të shkruara plotësisht, gati për teleprompter."],
  ["Me cilin produkt duhet të filloj?", "Varet nga audienca jote. Prandaj fillojmë me auditimin falas: të tregojmë cili produkt ka më shumë kuptim për profilin tënd."],
  ["Si shitet produkti?", "E vendosim në një platformë që merret me pagesat dhe me qasjen e blerësve. Ti nuk merresh me asnjë pjesë teknike."],
  ["A mund të ndryshoj diçka para publikimit?", "Po. Çdo pjesë e rishikon para se të dalë publikisht, dhe ndryshimet i bëjmë ne."],
  ["Sa zgjat i gjithë procesi?", "Varet nga produkti dhe paketa. Afatin e saktë e caktojmë bashkë pas auditimit."],
];
