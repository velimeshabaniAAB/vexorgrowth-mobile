import Link from "next/link";
import { KartaSherbimi } from "@/components/KartaSherbimi";
import { lexoSherbimet, type Sherbim } from "@/lib/sherbimet";

export const dynamic = "force-dynamic";

export default async function Sherbimet({ searchParams }: {
  searchParams: Promise<{ kategoria?: string }>;
}) {
  const { kategoria } = await searchParams;
  let sherbimet: Sherbim[];
  try {
    sherbimet = await lexoSherbimet();
  } catch {
    return (
      <main>
        <h1>Shërbimet</h1>
        <p role="alert">Nuk u lidhëm me databazën. Provo përsëri.</p>
        <Link className="action" href="/sherbimet">Provo përsëri</Link>
      </main>
    );
  }

  // Kategoritë merren nga vetë shërbimet, pa dyfishime.
  const kategorite = [...new Set(sherbimet.map((s) => s.kategoria))];
  const teZgjedhura = kategoria ? sherbimet.filter((s) => s.kategoria === kategoria) : sherbimet;

  return (
    <main>
      <p className="eyebrow">Çfarë ofrojmë</p>
      <h1>Shërbimet</h1>

      <nav className="filtrat" aria-label="Filtro sipas kategorisë">
        <Link href="/sherbimet" className={!kategoria ? "filtri aktiv" : "filtri"}
          aria-current={!kategoria ? "page" : undefined}>Të gjitha</Link>
        {kategorite.map((k) => (
          <Link key={k} href={`/sherbimet?kategoria=${encodeURIComponent(k)}`}
            className={kategoria === k ? "filtri aktiv" : "filtri"}
            aria-current={kategoria === k ? "page" : undefined}>{k}</Link>
        ))}
      </nav>

      {teZgjedhura.length === 0 ? (
        <p>Nuk ka shërbime në këtë kategori.</p>
      ) : (
        <div className="trip-list">
          {teZgjedhura.map((sherbim) => (
            <KartaSherbimi key={sherbim.id} sherbim={sherbim} />
          ))}
        </div>
      )}
    </main>
  );
}