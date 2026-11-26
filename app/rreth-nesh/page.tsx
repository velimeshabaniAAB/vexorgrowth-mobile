import Link from "next/link";
import { PYETJET } from "@/lib/oferta";

// Kontaktet: zëvendëso vlerat me të dhënat e vërteta të Vexor Growth.
const kontaktet: { emri: string; vlera: string; linku?: string }[] = [
  { emri: "Email", vlera: "vexorgrowth@gmail.com", linku: "mailto:vexorgrowth@gmail.com" },
  { emri: "Instagram", vlera: "@vexorgrowth", linku: "https://instagram.com/vexorgrowth" },
  // Numri i plotë shtohet më vonë; deri atëherë pa link.
  { emri: "WhatsApp", vlera: "048 *** ***" },
];

const parimet = [
  { nr: "01", titulli: "You're the face, we're the engine", teksti: "We handle the technical work so you can keep creating content." },
  { nr: "02", titulli: "Products your audience asks for", teksti: "We start from the questions your followers ask you every week." },
  { nr: "03", titulli: "A reply within 24 hours", teksti: "No request gets lost like it does in DMs." },
];

export default function RrethNesh() {
  return (
    <main className="vx-faqe vx-rreth">
      <Link href="/panel" className="ekipi-link">🔒 Team login</Link>
      <p className="eyebrow">Who we are</p>
      <h1>About us</h1>
      <p className="lead">
        Vexor Growth works behind the scenes for creators. We build the product, the sales page
        and the launch; you stay the face and the expert your audience knows.
      </p>

      <ol className="parimet">
        {parimet.map((p) => (
          <li key={p.nr}>
            <span className="parimet-nr">{p.nr}</span>
            <div>
              <h2>{p.titulli}</h2>
              <p>{p.teksti}</p>
            </div>
          </li>
        ))}
      </ol>

      <section className="vx-seksion vx-faq" aria-labelledby="faq-titulli">
        <p className="vx-etiketa">FAQ</p>
        <h2 className="vx-h2" id="faq-titulli">What creators ask us</h2>
        <div>
          {PYETJET.map(([q, a], i) => (
            <details key={q} open={i === 0}>
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="vx-kontaktet" aria-labelledby="kontakt-titulli">
        <div className="vx-kontaktet-koka">
          <p className="vx-etiketa" id="kontakt-titulli">Contact us</p>
          <span>Write to us anytime</span>
        </div>
        <div className="vx-kontaktet-lista">
          {kontaktet.map((k) => {
            const brenda = <><span className="vx-kontakt-ikona" aria-hidden="true">{k.emri[0]}</span>
              <span><small>{k.emri}</small><b>{k.vlera}</b></span></>;
            return k.linku ? (
              <a key={k.emri} href={k.linku} className="vx-kontakt"
                target={k.linku.startsWith("http") ? "_blank" : undefined}
                rel={k.linku.startsWith("http") ? "noopener noreferrer" : undefined}>{brenda}</a>
            ) : <div key={k.emri} className="vx-kontakt">{brenda}</div>;
          })}
        </div>
      </section>

      <Link className="action" href="/sherbimet">View services</Link>
    </main>
  );
}