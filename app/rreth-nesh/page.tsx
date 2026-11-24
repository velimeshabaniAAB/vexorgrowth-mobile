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
  { nr: "01", titulli: "Ti je fytyra, ne jemi motori", teksti: "Merremi me punën teknike që ti të vazhdosh të krijosh përmbajtje." },
  { nr: "02", titulli: "Produkte që audienca i kërkon", teksti: "Nisemi nga pyetjet që të bëjnë ndjekësit çdo javë." },
  { nr: "03", titulli: "Përgjigje brenda 24 orësh", teksti: "Asnjë kërkesë nuk humbet si në DM." },
];

export default function RrethNesh() {
  return (
    <main className="vx-faqe vx-rreth">
      <Link href="/panel" className="ekipi-link">🔒 Hyrja e ekipit</Link>
      <p className="eyebrow">Kush jemi</p>
      <h1>Rreth nesh</h1>
      <p className="lead">
        Vexor Growth punon prapa skenës për kreatorët. Ne ndërtojmë produktin, faqen e shitjes
        dhe lansimin; ti mbetesh fytyra dhe eksperti që audienca e njeh.
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
        <p className="vx-etiketa">Pyetje të shpeshta</p>
        <h2 className="vx-h2" id="faq-titulli">Çfarë na pyesin kreatorët</h2>
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
          <p className="vx-etiketa" id="kontakt-titulli">Na kontakto</p>
          <span>Na shkruaj kur të duash</span>
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

      <Link className="action" href="/sherbimet">Shiko shërbimet</Link>
    </main>
  );
}