import Link from "next/link";

// Kontaktet: zëvendëso vlerat me të dhënat e vërteta të Vexor Growth.
const kontaktet = [
  { emri: "Email", vlera: "[EMAILI I VEXOR]", linku: "mailto:[EMAILI I VEXOR]" },
  { emri: "Instagram", vlera: "[@INSTAGRAMI]", linku: "https://instagram.com/" },
  { emri: "WhatsApp", vlera: "[NUMRI]", linku: "https://wa.me/" },
];

const parimet = [
  { nr: "01", titulli: "Ti je fytyra, ne jemi motori", teksti: "Merremi me punën teknike që ti të vazhdosh të krijosh përmbajtje." },
  { nr: "02", titulli: "Produkte që audienca i kërkon", teksti: "Nisemi nga pyetjet që të bëjnë ndjekësit çdo javë." },
  { nr: "03", titulli: "Përgjigje brenda 24 orësh", teksti: "Asnjë kërkesë nuk humbet si në DM." },
];

export default function RrethNesh() {
  return (
    <main>
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

      <section className="kontakti">
        <p className="eyebrow">Na kontakto</p>
        {kontaktet.map((k) => (
          <a key={k.emri} href={k.linku} className="kontakti-rresht">
            <span>{k.emri}</span>
            <span>{k.vlera}</span>
          </a>
        ))}
      </section>

      <Link className="action" href="/sherbimet">Shiko shërbimet</Link>
    </main>
  );
}