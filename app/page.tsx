import Link from "next/link";

// Ballina: vetëm prezantimi. Lista e shërbimeve është te /sherbimet.
const hapat = [
  { nr: "1", titulli: "Zgjidh shërbimin", teksti: "Auditim, ebook ose lansim." },
  { nr: "2", titulli: "Dërgo kërkesën", teksti: "Emri, emaili dhe linku i profilit." },
  { nr: "3", titulli: "Takim në Zoom", teksti: "Të kontaktojmë brenda 24 orësh." },
];

export default function Home() {
  return (
    <main>
      <header className="app-header">
        <div className="brand" aria-label="Vexor Growth">
          <b>VEXOR</b>
          <span>GROWTH</span>
        </div>
      </header>

      <section className="hero">
        <p className="eyebrow">Shadow operating për kreatorë</p>
        <h1>Ti mbetesh eksperti. Ne ndërtojmë produktin.</h1>
        <p className="lead">
          Kthejmë njohurinë tënde në një produkt digjital: ebook, mini-kurs ose template.
          Pastaj e lansojmë bashkë te audienca jote.
        </p>
        <div className="hero-butonat">
          <Link className="action" href="/sherbimet">Shiko shërbimet</Link>
          <Link className="action action-ghost" href="/rreth-nesh">Si punojmë</Link>
        </div>
      </section>

      <section className="hapat" aria-labelledby="hapat-titulli">
        <p className="eyebrow" id="hapat-titulli">Si funksionon</p>
        <ol>
          {hapat.map((h) => (
            <li key={h.nr}>
              <span className="hapat-nr">{h.nr}</span>
              <div>
                <strong>{h.titulli}</strong>
                <span>{h.teksti}</span>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="per-ke">
        <p className="eyebrow">Për kë është</p>
        <p>Kreatorë me 10k–200k ndjekës në Instagram, TikTok dhe YouTube.</p>
      </section>
    </main>
  );
}