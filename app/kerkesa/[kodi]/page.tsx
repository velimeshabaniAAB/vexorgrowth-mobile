import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { gjejMeKod, type KerkesaIme } from "@/lib/kerkesat";
import { dataShqip } from "@/lib/email";

export const dynamic = "force-dynamic";
// Faqja është personale: motorët e kërkimit nuk e ruajnë.
export const metadata: Metadata = { title: "Kërkesa ime · Vexor Growth", robots: { index: false } };

type Hapi = { titulli: string; nen: string; bere: boolean };

function hapat(k: KerkesaIme): Hapi[] {
  if (k.statusi === "refuzuar") {
    return [
      { titulli: "Kërkesa u dërgua", nen: k.derguar, bere: true },
      { titulli: "Kërkesa u refuzua", nen: "Këtë herë nuk kemi vend për këtë shërbim.", bere: true },
    ];
  }
  return [
    { titulli: "Kërkesa u dërgua", nen: k.derguar, bere: true },
    { titulli: "Kërkesa u pranua", nen: k.pranuar ?? "Në pritje · përgjigje brenda 24 orësh", bere: k.statusi === "pranuar" },
    {
      titulli: "Takimi në Zoom",
      nen: k.data_takimit ? `${dataShqip(k.data_takimit)} · ${k.ora_takimit}` : "Caktohet pas pranimit",
      bere: false,
    },
  ];
}

export default async function KerkesaImeFaqja({ params }: { params: Promise<{ kodi: string }> }) {
  const { kodi } = await params;
  let k: KerkesaIme | undefined;
  try {
    k = await gjejMeKod(kodi);
  } catch {
    return (
      <main>
        <h1>Kërkesa ime</h1>
        <p role="alert">Nuk u lidhëm me databazën. Provo përsëri pas pak.</p>
        <Link className="action" href={`/kerkesa/${kodi}`}>Provo përsëri</Link>
      </main>
    );
  }
  if (!k) notFound();

  const takim = k.statusi === "pranuar" && k.data_takimit;

  return (
    <main>
      <header className="app-header">
        <div className="brand" aria-label="Vexor Growth"><b>VEXOR</b><span>GROWTH</span></div>
      </header>

      <p className="eyebrow">Kërkesa jote · #{k.id}</p>
      <h1>{k.sherbim}</h1>
      <p className="kerkesa-nen">{k.emri} · dërguar më {k.derguar}</p>

      <ol className="hapat-statusi">
        {hapat(k).map((h) => (
          <li key={h.titulli} className={h.bere ? "bere" : ""}>
            <span className="hapi-pika" aria-hidden="true">{h.bere ? "✓" : ""}</span>
            <div>
              <strong>{h.titulli}</strong>
              <span>{h.nen}</span>
            </div>
          </li>
        ))}
      </ol>

      {takim && (
        <section className="takimi-yt">
          <p className="eyebrow">Takimi yt</p>
          <div className="takimi-rresht"><span>Data</span><strong>{dataShqip(k.data_takimit!)}</strong></div>
          <div className="takimi-rresht"><span>Ora</span><strong>{k.ora_takimit} (45 min)</strong></div>
          <div className="takimi-butonat">
            {k.zoom_link && <a className="action" href={k.zoom_link} target="_blank" rel="noopener noreferrer">Hyr në Zoom</a>}
            <a className="action action-ghost" href={`/kerkesa/${kodi}/kalendari`}>Shto në kalendar</a>
          </div>
        </section>
      )}

      <p className="kerkesa-privat">🔒 Ky link është personal dhe të erdhi me email. Mos e ndaj me të tjerë.</p>
    </main>
  );
}