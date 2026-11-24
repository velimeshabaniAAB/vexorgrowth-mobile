import Link from "next/link";
import Kalkulatori from "@/components/Kalkulatori";

// Ballina: prezantimi (si te demoja finale). Lista e shërbimeve është te /sherbimet.
const NICHET = ["Fitness", "Pilates", "Biznes online", "Financa personale", "Marketing", "Ushqim", "Mindset", "Bukuri"];

const THENIET = [
  "Ndjekësit më pyesin çdo ditë për të njëjtat gjëra në DM.",
  "Kam audiencë, por fitoj vetëm nga sponsorizimet dhe ato s'janë të sigurta.",
  "E di që duhet një kurs ose eBook, por s'kam kohë ta ndërtoj vetë.",
];

const HAPAT = [
  { nr: "01", titulli: "Auditimi", teksti: "Analizojmë profilin dhe audiencën dhe të tregojmë ku janë paratë.", ti: "Ti: dërgon linkun" },
  { nr: "02", titulli: "Strategjia", teksti: "Mësojmë zërin tënd, zgjedhim niche-n dhe transformimin që i premton audiencës.", ti: "Ti: një bisedë" },
  { nr: "03", titulli: "Produkti", teksti: "Ndërtojmë produktin e plotë: përmbajtjen, fletët e punës dhe dizajnin.", ti: "Ti: rishikon dhe aprovon" },
  { nr: "04", titulli: "Lansimi", teksti: "Faqja e shitjes, email-et, postimet dhe plani i lansimit, gati.", ti: "Ti: poston në profil" },
  { nr: "05", titulli: "Shitjet", teksti: "Produkti online, pagesat dhe qasja e blerësve, pa asnjë punë teknike për ty.", ti: "Ti: merr pagesat" },
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
        <Link href="/kerkesat" aria-label="Kërkesat e mia" className="vx-rreth-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
            strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></svg>
        </Link>
      </header>

      <section className="vx-hero">
        <div className="vx-hero-teksti">
          <span className="vx-pill"><i aria-hidden="true" />Shadow operating për kreatorë</span>
          <h1 className="vx-h1">Ti mbetesh eksperti.<br /><span>Ne ndërtojmë produktin.</span></h1>
          <p className="vx-lead">Kthejmë njohurinë tënde në një produkt digjital dhe e lansojmë bashkë te audienca jote.</p>
          <div className="vx-butonat">
            <Link className="vx-btn" href="/sherbimet">Dërgo kërkesë <Shigjeta /></Link>
            <Link className="vx-btn vx-btn-ghost" href="/sherbimet">Shiko produktet</Link>
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="vx-hero-logo" src="/logo-rreth.png" alt="Logoja e Vexor Growth" width={440} height={440} />
      </section>

      <div className="vx-shirit" aria-label={NICHET.join(", ")}>
        <div className="vx-shirit-levizje" aria-hidden="true">
          {[0, 1].map((i) => (
            <div key={i}>{NICHET.map((n) => <span key={n}>{n}<i>✦</i></span>)}</div>
          ))}
        </div>
      </div>

      <section className="vx-seksion">
        <p className="vx-etiketa">Për kë është</p>
        <h2 className="vx-h2">Nëse e njeh veten këtu, ke një produkt që të pret.</h2>
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
        <p className="vx-etiketa">Procesi</p>
        <h2 className="vx-h2">Pesë hapa. Ti përfshihesh vetëm aty ku duhet.</h2>
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
          <h2>Audienca jote është gati.<br />Po ti?</h2>
          <Link className="vx-btn-zi" href="/sherbimet">Dërgo kërkesë <Shigjeta /></Link>
        </div>
      </section>
    </main>
  );
}
