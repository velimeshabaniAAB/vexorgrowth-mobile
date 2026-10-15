import { KartaSherbimi } from "@/components/KartaSherbimi";
import { lexoSherbimet, type Sherbim } from "@/lib/sherbimet";

// Lexo bazën përsëri në çdo kërkesë për këtë faqe.
export const dynamic = "force-dynamic";

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
        <a className="action" href="/">Provo përsëri</a>
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
      </header>

      <p className="eyebrow">Çfarë ofrojmë</p>
      <h1>Shërbimet</h1>
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