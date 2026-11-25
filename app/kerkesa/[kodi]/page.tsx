import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { gjejMeKod, type KerkesaIme } from "@/lib/kerkesat";
import { dataShqip } from "@/lib/email";
import RifreskoAutomatik from "@/components/RifreskoAutomatik";

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
  const titulli = k.lloji === "konsulte" ? `Konsultë · ${k.sherbim}` : k.sherbim;
  const etiketa = { ne_pritje: "Në pritje", pranuar: "Pranuar", refuzuar: "Refuzuar" }[k.statusi];

  return (
    <main className="vx-faqe vx-kerkesa">
      <RifreskoAutomatik />
      <section className="vx-kerkesa-koka">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-rreth.png" alt="Vexor Growth" width={120} height={120} />
        <div>
          <p className="vx-etiketa">Kërkesa jote · #{k.id}</p>
          <h1 className="vx-h1">{titulli}</h1>
          <p className="vx-lead">{k.emri} · dërguar më {k.derguar}</p>
          <span className={"vx-statusi vx-statusi-" + k.statusi}>{etiketa}</span>
        </div>
      </section>

      <div className="vx-kerkesa-kolonat">
        <ol className="vx-afati" aria-label="Statusi i kërkesës">
          {hapat(k).map((h, i, lista) => (
            <li key={h.titulli} className={h.bere ? "bere" : ""}>
              <span className="vx-afati-pika" aria-hidden="true">{h.bere ? "✓" : ""}</span>
              {i < lista.length - 1 && <span className="vx-afati-vija" aria-hidden="true" />}
              <div>
                <strong>{h.titulli}</strong>
                <span>{h.nen}</span>
              </div>
            </li>
          ))}
        </ol>

        <div className="vx-kerkesa-djathtas">
          {takim ? (
            <section className="vx-takimi">
              <p className="vx-etiketa-vogel">Takimi yt</p>
              <h2>Takim në Zoom</h2>
              <div><span>Data</span><strong>{dataShqip(k.data_takimit!)}</strong></div>
              <div><span>Ora</span><strong>{k.ora_takimit} (45 min)</strong></div>
              <div className="vx-takimi-butonat">
                {k.zoom_link && <a className="vx-btn-zi" href={k.zoom_link} target="_blank" rel="noopener noreferrer">Hyr në Zoom</a>}
                <a className="vx-btn-kufi" href={`/kerkesa/${kodi}/kalendari`}>Shto në kalendar</a>
              </div>
            </section>
          ) : k.statusi === "refuzuar" ? (
            <section className="vx-kutia">
              <strong>Këtë herë nuk mund ta pranojmë kërkesën.</strong>
              <p>Mund të dërgosh një kërkesë të re më vonë, ose të na shkruash në vexorgrowth@gmail.com.</p>
              <Link className="vx-btn" href="/sherbimet">Shiko shërbimet</Link>
            </section>
          ) : (
            <section className="vx-kutia">
              <strong>Kërkesa jote është në pritje.</strong>
              <p>Do të të shkruajmë brenda 24 orësh. Kur të pranohet, këtu del data, ora dhe linku i Zoom.</p>
            </section>
          )}
          <p className="vx-privat">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
            Ky link është personal dhe të erdhi me email. Mos e ndaj me të tjerë.
          </p>
        </div>
      </div>
    </main>
  );
}
