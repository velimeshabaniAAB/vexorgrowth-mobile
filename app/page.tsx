import Link from "next/link";
import Kalkulatori from "@/components/Kalkulatori";

// Ballina: prezantimi (si te demoja finale). Lista e shërbimeve është te /sherbimet.
const NICHET = ["Fitness", "Pilates", "Online business", "Personal finance", "Marketing", "Nutrition", "Mindset", "Beauty"];

const THENIET = [
  "My followers ask me the same questions in my DMs every day.",
  "I have an audience, but I only earn from sponsorships and they're not reliable.",
  "I know I need a course or an eBook, but I don't have time to build it myself.",
];

const HAPAT = [
  { nr: "01", titulli: "Audit", teksti: "We analyse your profile and audience and show you where the money is.", ti: "You: send the link" },
  { nr: "02", titulli: "Strategy", teksti: "We learn your voice, choose the niche and the transformation you promise your audience.", ti: "You: one conversation" },
  { nr: "03", titulli: "Product", teksti: "We build the complete product: content, worksheets and design.", ti: "You: review and approve" },
  { nr: "04", titulli: "Launch", teksti: "Sales page, emails, posts and the launch plan, all ready.", ti: "You: post on your profile" },
  { nr: "05", titulli: "Sales", teksti: "Product online, payments and buyer access, with zero technical work for you.", ti: "You: get paid" },
];

const Shigjeta = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);

export default function Home() {
  return (
    <main className="vx-faqe">
      {/* Telefon: logoja lart (në laptop është te koka) */}
      <header className="vx-koka-tel">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-horizontal.png" alt="Vexor Growth" width={112} height={36} />
        <Link href="/kerkesat" aria-label="My requests" className="vx-rreth-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
            strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></svg>
        </Link>
      </header>

      <section className="vx-hero">
        <div className="vx-hero-teksti">
          <span className="vx-pill"><i aria-hidden="true" />Shadow operating for creators</span>
          <h1 className="vx-h1">You stay the expert.<br /><span>We build the product.</span></h1>
          <p className="vx-lead">We turn your knowledge into a digital product and launch it together to your audience.</p>
          <div className="vx-butonat">
            <Link className="vx-btn" href="/sherbimet">Send a request <Shigjeta /></Link>
            <Link className="vx-btn vx-btn-ghost" href="/sherbimet">See the products</Link>
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="vx-hero-logo" src="/logo-rreth.png" alt="Vexor Growth logo" width={440} height={440} />
      </section>

      <div className="vx-shirit" aria-label={NICHET.join(", ")}>
        <div className="vx-shirit-levizje" aria-hidden="true">
          {[0, 1].map((i) => (
            <div key={i}>{NICHET.map((n) => <span key={n}>{n}<i>✦</i></span>)}</div>
          ))}
        </div>
      </div>

      <section className="vx-seksion">
        <p className="vx-etiketa">Who it’s for</p>
        <h2 className="vx-h2">If you see yourself here, there’s a product waiting for you.</h2>
        <div className="vx-thenie">
          {THENIET.map((t) => (
            <figure key={t}>
              <svg width="30" height="24" viewBox="0 0 30 24" fill="currentColor" aria-hidden="true">
                <path d="M0 24V14C0 6 4 1.5 12 0l1.5 3.5C9 5 7 7.5 7 11h5v13zm17 0V14c0-8 4-12.5 12-14l1.5 3.5C26 5 24 7.5 24 11h5v13z" />
              </svg>
              <blockquote>{t}</blockquote>
            </figure>
          ))}
        </div>
      </section>

      <div className="vx-seksion"><Kalkulatori /></div>

      <section className="vx-seksion">
        <p className="vx-etiketa">The process</p>
        <h2 className="vx-h2">Five steps. You only step in where it matters.</h2>
        <ol className="vx-procesi">
          {HAPAT.map((h, i) => (
            <li key={h.nr}>
              <span className={i === 0 ? "vx-nr vx-nr-aktiv" : "vx-nr"}>{h.nr}</span>
              <strong>{h.titulli}</strong>
              <p>{h.teksti}</p>
              <span className={i === HAPAT.length - 1 ? "vx-ti vx-ti-aktiv" : "vx-ti"}>{h.ti}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="vx-seksion">
        <div className="vx-cta">
          <h2>Your audience is ready.<br />Are you?</h2>
          <Link className="vx-btn-zi" href="/sherbimet">Send a request <Shigjeta /></Link>
        </div>
      </section>
    </main>
  );
}
