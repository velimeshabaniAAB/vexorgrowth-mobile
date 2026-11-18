import Link from "next/link";
import { KartaSherbimi } from "@/components/KartaSherbimi";
import { lexoSherbimet, type Sherbim } from "@/lib/sherbimet";

// Lexo bazën përsëri në çdo kërkesë për këtë faqe.
export const dynamic = "force-dynamic";

const hapat = [
  { nr: "1", titulli: "Zgjidh shërbimin", teksti: "Auditim, ebook ose lansim." },
  { nr: "2", titulli: "Dërgo kërkesën", teksti: "Emri, emaili dhe linku i profilit." },
  { nr: "3", titulli: "Takim në Zoom", teksti: "Të kontaktojmë brenda 24 orësh." },
];

export default async function Home() {
  let sherbimet: Sherbim[];
  try {
    sherbimet = await lexoSherbimet();
  } catch (e) {
    console.error("Gabimi i databazës:", e);
    return (
      <main>
        <h1>Vexor Growth</h1>
        <p role="alert">Nuk u lidhëm me databazën. Provo përsëri.</p>
        <Link className="action" href="/">Provo përsëri</Link>
      </main>
    );
  }

  return (
    <main>
      <header className="app-header">
        <div className="brand" aria-label="Vexor Growth">
          <b>VEXOR</b>
          <span>GROWTH</span>
        </div>
        <Link href="/panel" className="panel-link">Hyr / Paneli im</Link>
      </header>

      {/* Ballina: prezantimi */}
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

      {/* Lista e shërbimeve nga Neon (si më parë) */}
      <p className="eyebrow">Çfarë ofrojmë</p>
      <h2>Shërbimet</h2>
      <p>Zgjidh një shërbim dhe dërgo kërkesën. Ne punojmë prapa skenës, ti mbetesh eksperti.</p>

      {sherbimet.length === 0 ? (
        <p>Nuk ka shërbime për momentin.</p>
      ) : (
        <div className="trip-list">
          {sherbimet.map((sherbim) => (
            <KartaSherbimi key={sherbim.id} sherbim={sherbim} />
          ))}
        </div>
      )}
      <p className="footnote">Burimi: Neon · të dhëna fiktive për ushtrime</p>
    </main>
  );
}