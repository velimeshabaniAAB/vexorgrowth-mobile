import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { gjejMeKod, type KerkesaIme } from "@/lib/kerkesat";
import { dataShqip } from "@/lib/email";
import RifreskoAutomatik from "@/components/RifreskoAutomatik";

export const dynamic = "force-dynamic";
// Faqja është personale: motorët e kërkimit nuk e ruajnë.
export const metadata: Metadata = { title: "My request · Vexor Growth", robots: { index: false } };

type Hapi = { titulli: string; nen: string; bere: boolean };

function hapat(k: KerkesaIme): Hapi[] {
  if (k.statusi === "refuzuar") {
    return [
      { titulli: "Request sent", nen: k.derguar, bere: true },
      { titulli: "Request declined", nen: "This time we don't have room for this service.", bere: true },
    ];
  }
  return [
    { titulli: "Request sent", nen: k.derguar, bere: true },
    { titulli: "Request accepted", nen: k.pranuar ?? "Pending · reply within 24 hours", bere: k.statusi === "pranuar" },
    {
      titulli: "Zoom meeting",
      nen: k.data_takimit ? `${dataShqip(k.data_takimit)} · ${k.ora_takimit}` : "Booked after acceptance",
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
        <h1>My request</h1>
        <p role="alert">We couldn’t reach the database. Please try again shortly.</p>
        <Link className="action" href={`/kerkesa/${kodi}`}>Try again</Link>
      </main>
    );
  }
  if (!k) notFound();

  const takim = k.statusi === "pranuar" && k.data_takimit;
  const titulli = k.lloji === "konsulte" ? `Consultation · ${k.sherbim}` : k.sherbim;
  const etiketa = { ne_pritje: "Pending", pranuar: "Accepted", refuzuar: "Declined" }[k.statusi];

  return (
    <main className="vx-faqe vx-kerkesa">
      <RifreskoAutomatik />
      <section className="vx-kerkesa-koka">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-rreth.png" alt="Vexor Growth" width={120} height={120} />
        <div>
          <p className="vx-etiketa">Your request · #{k.id}</p>
          <h1 className="vx-h1">{titulli}</h1>
          <p className="vx-lead">{k.emri} · sent on {k.derguar}</p>
          <span className={"vx-statusi vx-statusi-" + k.statusi}>{etiketa}</span>
        </div>
      </section>

      <div className="vx-kerkesa-kolonat">
        <ol className="vx-afati" aria-label="Request status">
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
              <p className="vx-etiketa-vogel">Your meeting</p>
              <h2>Zoom meeting</h2>
              <div><span>Date</span><strong>{dataShqip(k.data_takimit!)}</strong></div>
              <div><span>Time</span><strong>{k.ora_takimit} (45 min)</strong></div>
              <div className="vx-takimi-butonat">
                {k.zoom_link && <a className="vx-btn-zi" href={k.zoom_link} target="_blank" rel="noopener noreferrer">Join Zoom</a>}
                <a className="vx-btn-kufi" href={`/kerkesa/${kodi}/kalendari`}>Add to calendar</a>
              </div>
            </section>
          ) : k.statusi === "refuzuar" ? (
            <section className="vx-kutia">
              <strong>We can’t accept this request this time.</strong>
              <p>You can send a new request later, or write to us at vexorgrowth@gmail.com.</p>
              <Link className="vx-btn" href="/sherbimet">View services</Link>
            </section>
          ) : (
            <section className="vx-kutia">
              <strong>Your request is pending.</strong>
              <p>We will write to you within 24 hours. Once it is accepted, the date, time and Zoom link will appear here.</p>
            </section>
          )}
          <p className="vx-privat">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
            This link is personal and was sent to you by email. Please don’t share it.
          </p>
        </div>
      </div>
    </main>
  );
}
