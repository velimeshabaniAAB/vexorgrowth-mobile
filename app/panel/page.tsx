import Link from "next/link";
import Hyrja from "@/components/Hyrja";
import HyrjaEkipit from "@/components/HyrjaEkipit";
import RifreskoAutomatik from "@/components/RifreskoAutomatik";
import { profiliIm, kerkesatEMia, type KerkesaPanel, type Profil } from "@/lib/lejet";
import { ruajStatusin, pranoKerkesen } from "./actions";
import { dataShqip } from "@/lib/email";

export const dynamic = "force-dynamic";

const mesazhet: Record<string, string> = {
  hyr: "Log in before managing requests.",
  ndaluar: "You don't have permission for this request. The status did not change.",
  fushe: "The request ID must be a number, and the status accepted or declined.",
  ruajtur: "Status saved successfully.",
  databaza: "We couldn't reach the database. Check Neon and try again.",
  pranuar: "Request accepted and the invite was emailed to the creator.",
  "pranuar-pa-email": "Request accepted, but the email to the creator was not sent. Check the Gmail settings in .env.local.",
  refuzuar: "Request declined and the creator was notified by email.",
  perpunuar: "This request was already handled. No second email was sent.",
  "refuzuar-pa-email": "Request declined, but the email to the creator was not sent. Check the Gmail settings in .env.local.",
  takimi: "Pick a date and time, and enter a Zoom link starting with https:// (e.g. https://zoom.us/j/...).",
};

const etiketat = { ne_pritje: "Pending", pranuar: "Accepted", refuzuar: "Declined" };

// Shfaq linkun e profilit vetëm nëse është adresë http(s).
const linkIsigurt = (l: string | null) => (l && /^https?:\/\//i.test(l) ? l : null);

export default async function Panel({ searchParams }: {
  searchParams: Promise<{ m?: string }>;
}) {
  const { m } = await searchParams;
  // Linku yt personal i Zoom nga .env.local (mbush fushën automatikisht).
  const zoomIm = process.env.ZOOM_LINK ?? "";
  const sot = new Date().toISOString().slice(0, 10);
  let p: Profil | null;
  let kerkesat: KerkesaPanel[] = [];
  try {
    p = await profiliIm();
    if (p) kerkesat = await kerkesatEMia(p);
  } catch (e) {
    console.error("Gabimi i panelit:", e);
    return <main>
      <h1>My panel</h1>
      <p role="alert">{mesazhet.databaza}</p>
      <Link className="action" href="/panel">Try again</Link>
    </main>;
  }

  // Pa hyrje: faqja "Hyrja e ekipit". Kreator: pa qasje në panel.
  if (!p) return <HyrjaEkipit />;
  if (p.roli !== "operator") return <HyrjaEkipit pa_qasje />;

  const teReja = kerkesat.filter((k) => k.statusi === "ne_pritje");
  const teTjera = kerkesat.filter((k) => k.statusi !== "ne_pritje");
  const numri = (s: KerkesaPanel["statusi"]) => kerkesat.filter((k) => k.statusi === s).length;

  // Një kartë kërkese (e njëjta për të rejat dhe të tjerat).
  const Karta = ({ k }: { k: KerkesaPanel }) => (
    <article className="panel-karta">
      <div className="panel-karta-krye">
        <p className="eyebrow">#{k.id} · {k.sherbim}</p>
        {k.lloji === "konsulte" && <span className="lloji-pill">Consultation</span>}
        {k.statusi !== "ne_pritje" && (
          <span className={"statusi-pill statusi-pill-" + k.statusi}>{etiketat[k.statusi]}</span>
        )}
      </div>
      <h3>{k.emri}</h3>
      <p className="panel-karta-nen">
        {k.emaili}
        {linkIsigurt(k.linku) && <> · <a href={linkIsigurt(k.linku)!} target="_blank" rel="noopener noreferrer">Profile</a></>}
      </p>
      {k.mesazhi && <p className="panel-karta-mesazhi">{k.mesazhi}</p>}
      {k.statusi === "pranuar" && k.data_takimit && <p className="takimi-info">
        Meeting: <strong>{dataShqip(k.data_takimit)} · {k.ora_takimit}</strong>
        {k.zoom_link && <> · <a href={k.zoom_link} target="_blank" rel="noopener noreferrer">Open Zoom</a></>}
      </p>}
      {k.statusi === "ne_pritje" && <>
        <form action={pranoKerkesen} className="pranimi">
          <input type="hidden" name="id" value={k.id} />
          <div className="pranimi-rresht">
            <label>Date<input type="date" name="data" required min={sot} /></label>
            <label>Time<input type="time" name="ora" required defaultValue="14:00" /></label>
          </div>
          <label>Zoom link<input type="url" name="zoom" required defaultValue={zoomIm}
            placeholder="https://zoom.us/j/..." /></label>
          <button className="action" type="submit">
            {k.lloji === "konsulte" ? "Book the consultation and send invite" : "Accept and send invite"}
          </button>
        </form>
        <form action={ruajStatusin}>
          <input type="hidden" name="id" value={k.id} />
          <button className="refuzo-btn" type="submit" name="statusi" value="refuzuar">Decline</button>
        </form>
      </>}
    </article>
  );

  return <main className="vx-faqe vx-panel">
    <RifreskoAutomatik />
    <header className="panel-krye">
      <div>
        <p className="vx-etiketa">Workspace</p>
        <h1 className="vx-h1">Operator panel</h1>
        <p className="panel-krye-nen">{p.emri} · operator</p>
      </div>
      <Hyrja brenda klasa="dil-btn" />
    </header>

    {m && mesazhet[m] && <p role="status" className="panel-mesazh" data-m={m}>{mesazhet[m]}</p>}

    <div className="panel-numrat">
      <div><strong>{numri("ne_pritje")}</strong><span className="statusi-ne_pritje">Pending</span></div>
      <div><strong>{kerkesat.filter((k) => k.lloji === "konsulte" && k.statusi === "ne_pritje").length}</strong><span>Consultations</span></div>
      <div><strong>{numri("pranuar")}</strong><span className="statusi-pranuar">Accepted</span></div>
      <div><strong>{numri("refuzuar")}</strong><span className="statusi-refuzuar">Declined</span></div>
    </div>

    <p className="vx-etiketa panel-titull">New requests</p>
    {teReja.length === 0 ? <p className="panel-bosh">No new requests.</p>
      : <div className="vx-panel-rrjeta">{teReja.map((k) => <Karta key={k.id} k={k} />)}</div>}

    {teTjera.length > 0 && <>
      <p className="vx-etiketa panel-titull">Completed</p>
      <div className="vx-panel-rrjeta">{teTjera.map((k) => <Karta key={k.id} k={k} />)}</div>
    </>}

    {/* Java 5: prova e lejeve (mbetet për demonstrim në klasë) */}
    <details className="panel-prova">
      <summary>Permission test (Java 5)</summary>
      <p>My GitHub ID: <code>{p.id}</code></p>
      <form action={ruajStatusin}>
        <label htmlFor="id">Request ID</label>{" "}
        <input id="id" name="id" type="number" min="1" required />{" "}
        <input type="hidden" name="statusi" value="pranuar" />
        <button type="submit">Try to accept</button>
      </form>
      <p>Enter the ID of a request for a service you don’t own. The server rejects it.</p>
    </details>
  </main>;
}