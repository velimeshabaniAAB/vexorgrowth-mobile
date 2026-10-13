import { KartaSherbimi } from "@/components/KartaSherbimi";
import { lexoSherbimet, type Sherbim } from "@/lib/sherbimet";

// Lexo bazën përsëri në çdo kërkesë për këtë faqe.
export const dynamic = "force-dynamic";

export default async function Home() {
  let sherbimet: Sherbim[];
  try {
    sherbimet = await lexoSherbimet();
  } catch {
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
      <h1>Vexor Growth · Shërbimet për kreatorë</h1>
      <p>Burimi: Neon · të dhëna fiktive për ushtrime</p>
      {sherbimet.length === 0 ? (
        <p>Nuk ka shërbime për momentin.</p>
      ) : (
        <div className="trip-list">
          {sherbimet.map((sherbim) => (
            <KartaSherbimi key={sherbim.id} sherbim={sherbim} />
          ))}
        </div>
      )}
    </main>
  );
}