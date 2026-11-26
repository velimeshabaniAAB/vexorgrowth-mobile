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

const ZOOM = "Offer and price after a Zoom call";

export const OFERTA: Oferta[] = [
  {
    id: "ebook", lloji: "individuale", emri: "eBook / digital guide",
    pershkrimi: "A digital book that takes the reader step by step to the solution of one problem.",
    thekso: "The easiest product to start with", cmimi: "$47 – $97", perKe: "Your first product",
    shkurt: ["6–10 chapters, 10,000–25,000 words", "Designed cover", "2–4 bonus materials"],
    detajet: [
      { titull: "Content", pikat: ["Introduction, 6–10 chapters and conclusion", "10,000 – 25,000 words", "Every chapter has a clear goal"] },
      { titull: "Bonuses and design", pikat: ["2–4 bonus materials (checklists, templates)", "Designed cover"] },
      { titull: "Selling", pikat: ["Store page with frequently asked questions"] },
    ],
  },
  {
    id: "kurs", lloji: "individuale", emri: "Video course", shenja: "Key selling point",
    pershkrimi: "A complete course in six phases, from the start to the student's result.",
    thekso: "Scripts ready: you just read them on camera", cmimi: "$50 – $300", perKe: "Creators who speak on camera",
    shkurt: ["Full script for every module", "Teleprompter-ready, no improvising", "Worksheet for every module"],
    detajet: [
      { titull: "Structure", pikat: ["6 phases, 3–5 modules per phase", "Built around the student's transformation"] },
      { titull: "Ready-made scripts", pikat: ["Full script for every module (~1,100–1,300 words)", "Teleprompter-ready: you just read, no improvising"] },
      { titull: "Materials", pikat: ["Worksheet for every module", "You just record, we do the rest"] },
    ],
  },
  {
    id: "mjete", lloji: "individuale", emri: "Digital toolkit",
    pershkrimi: "Practical assets around one specific problem that the buyer can use right away.",
    thekso: "Templates, checklists and SOPs in one bundle", cmimi: "Depends on the bundle", perKe: "Audiences who want action",
    shkurt: ["Ready-made templates", "Checklists", "SOP: step-by-step procedure"],
    detajet: [
      { titull: "Digital assets", pikat: ["Ready-made templates", "Checklists", "SOP: step-by-step procedure", "Worksheets"] },
      { titull: "Focus", pikat: ["Everything built around one specific problem", "The buyer uses it right away", "Sold as a single bundle"] },
    ],
  },
  {
    id: "coaching", lloji: "individuale", emri: "Coaching / mentoring program",
    pershkrimi: "Direct work with clients, with a complete week-by-week structure.",
    thekso: "Complete week-by-week structure", cmimi: "$1,000 – $7,000", perKe: "Premium offer",
    shkurt: ["2–14 weeks, your choice", "Worksheets every week", "A guide for every session"],
    detajet: [
      { titull: "Week by week", pikat: ["Length of your choice: 2–14 weeks", "Five stages: week one lays the foundation", "A guide for every weekly session"] },
      { titull: "Weekly materials", pikat: ["About 3 worksheets per week", "Script for one video module"] },
      { titull: "The offer", pikat: ["5 suggestions for the program name and unique angle", "Your recommended price: $1,000 – $7,000"] },
    ],
  },
  {
    id: "starter", lloji: "paketa", emri: "Starter", pershkrimi: "Your first product, no camera needed.", thekso: ZOOM,
    shkurt: ["eBook or digital toolkit", "Sales page", "Hosting and payments"],
    detajet: [
      { titull: "Audit", pikat: ["Free analysis of your profile and audience", "Recommendation: eBook or toolkit"] },
      { titull: "Product (one of the two)", pikat: ["eBook: introduction, 6–10 chapters and conclusion, 10,000–25,000 words", "2–4 bonus materials and a designed cover", "or Digital toolkit: worksheets, checklist, template and SOP"] },
      { titull: "Selling", pikat: ["Sales page written in your voice", "Hosting and payments, no technical work for you", "Review and edits before publishing"] },
    ],
  },
  {
    id: "launch", lloji: "paketa", emri: "Launch", shenja: "Most popular",
    pershkrimi: "A complete course and a launch with an email list.", thekso: ZOOM,
    shkurt: ["Video course with ready scripts", "Sales page and email sequence", "Pilot launch"],
    detajet: [
      { titull: "Video course", pikat: ["6 phases, 3–5 modules per phase", "Full teleprompter-ready script for every module", "Worksheet for every module"] },
      { titull: "Before the launch", pikat: ["Free lead magnet that builds your email list", "Posts that warm up your audience"] },
      { titull: "Launch and sales", pikat: ["Sales page and landing page", "Email sequence for the waitlist and sales days", "Pilot launch with a clear plan", "Hosting and payments"] },
    ],
  },
  {
    id: "premium", lloji: "paketa", emri: "Premium",
    pershkrimi: "A high-end offer with direct client work.", thekso: ZOOM,
    shkurt: ["Coaching program (2–14 weeks)", "Presentation and webinar launch", "Social media content"],
    detajet: [
      { titull: "Coaching program", pikat: ["Length of your choice: 2–14 weeks", "A guide for every weekly session and about 3 worksheets per week", "Script for one video module each week", "5 suggestions for the name and unique angle"] },
      { titull: "Webinar", pikat: ["Presentation with 6–50 slides and speaker notes", "Webinar launch"] },
      { titull: "Marketing and sales", pikat: ["Sales page and emails", "Content for social media and YouTube", "Hosting and payments"] },
    ],
  },
];

export const MARKETINGU: [string, string][] = [
  ["Sales page and landing page", "Copy that sounds like you and sells."],
  ["Free lead magnet", "Builds your list before the launch."],
  ["Email sequences", "For the waitlist and the sales days."],
  ["Sales videos and scripts", "Ready to read on camera."],
  ["Social media posts", "Warm up your audience before the launch."],
  ["YouTube content", "Angles, titles, thumbnails, descriptions."],
  ["Pilot or webinar launch", "Every piece builds on the previous one."],
  ["Hosting and payments", "Your product online, no technical work."],
];

export const PYETJET: [string, string][] = [
  ["Do I have to write the content myself?", "No. You give us your knowledge and your voice in one conversation, we build the product and write all the copy. You just review and approve."],
  ["Do I have to be on camera?", "Only for the video course. Even then, you get fully written scripts, ready for a teleprompter."],
  ["Which product should I start with?", "It depends on your audience. That is why we start with the free audit: we show you which product makes the most sense for your profile."],
  ["How is the product sold?", "We set it up on a platform that handles payments and buyer access. You don't deal with anything technical."],
  ["Can I change something before it goes live?", "Yes. You review every part before it is published, and we make the changes."],
  ["How long does the whole process take?", "It depends on the product and the package. We set the exact timeline together after the audit."],
];
