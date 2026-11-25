import Link from "next/link";
import Hyrja from "@/components/Hyrja";
import HyrjaEkipit from "@/components/HyrjaEkipit";
import RifreskoAutomatik from "@/components/RifreskoAutomatik";
import { profiliIm, kerkesatEMia, type KerkesaPanel, type Profil } from "@/lib/lejet";
import { ruajStatusin, pranoKerkesen } from "./actions";
import { dataShqip } from "@/lib/email";

export const dynamic = "force-dynamic";

const mesazhet: Record<string, string> = {
  hyr: "Hyr në llogari para se të menaxhosh kërkesat.",
  ndaluar: "Nuk ke leje për këtë kërkesë. Statusi nuk ndryshoi.",
  fushe: "ID e kërkesës duhet të jetë numër, statusi pranuar ose refuzuar.",
  ruajtur: "Statusi u ruajt me sukses.",
  databaza: "Nuk u lidhëm me databazën. Kontrollo Neon dhe provo përsëri.",
  pranuar: "Kërkesa u pranua dhe kreatorit iu dërgua ftesa me email.",
  "pranuar-pa-email": "Kërkesa u pranua, por emaili te kreatori nuk u dërgua. Kontrollo Gmail-in te .env.local.",
  refuzuar: "Kërkesa u refuzua dhe kreatorit iu dërgua email.",
  perpunuar: "Kjo kërkesë ishte përpunuar tashmë. Nuk u dërgua email i dytë.",
  "refuzuar-pa-email": "Kërkesa u refuzua, por emaili te kreatori nuk u dërgua. Kontrollo Gmail-in te .env.local.",
  takimi: "Zgjidh datën dhe orën, dhe shkruaj një link Zoom që fillon me https:// (p.sh. https://zoom.us/j/...).",
};

const etiketat = { ne_pritje: "Në pritje", pranuar: "Pranuar", refuzuar: "Refuzuar" };

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
      <h1>Paneli im</h1>
      <p role="alert">{mesazhet.databaza}</p>
      <Link className="action" href="/panel">Provo përsëri</Link>
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
        {k.lloji === "konsulte" && <span className="lloji-pill">Konsultë</span>}
        {k.statusi !== "ne_pritje" && (
          <span className={"statusi-pill statusi-pill-" + k.statusi}>{etiketat[k.statusi]}</span>
        )}
      </div>
      <h3>{k.emri}</h3>
      <p className="panel-karta-nen">
        {k.emaili}
        {linkIsigurt(k.linku) && <> · <a href={linkIsigurt(k.linku)!} target="_blank" rel="noopener noreferrer">Profili</a></>}
      </p>
      {k.mesazhi && <p className="panel-karta-mesazhi">{k.mesazhi}</p>}
      {k.statusi === "pranuar" && k.data_takimit && <p className="takimi-info">
        Takimi: <strong>{dataShqip(k.data_takimit)} · {k.ora_takimit}</strong>
        {k.zoom_link && <> · <a href={k.zoom_link} target="_blank" rel="noopener noreferrer">Hap Zoom</a></>}
      </p>}
      {k.statusi === "ne_pritje" && <>
        <form action={pranoKerkesen} className="pranimi">
          <input type="hidden" name="id" value={k.id} />
          <div className="pranimi-rresht">
            <label>Data<input type="date" name="data" required min={sot} /></label>
            <label>Ora<input type="time" name="ora" required defaultValue="14:00" /></label>
          </div>
          <label>Linku i Zoom<input type="url" name="zoom" required defaultValue={zoomIm}
            placeholder="https://zoom.us/j/..." /></label>
          <button className="action" type="submit">
            {k.lloji === "konsulte" ? "Cakto konsultën dhe dërgo ftesën" : "Prano dhe dërgo ftesën"}
          </button>
        </form>
        <form action={ruajStatusin}>
          <input type="hidden" name="id" value={k.id} />
          <button className="refuzo-btn" type="submit" name="statusi" value="refuzuar">Refuzo</button>
        </form>
      </>}
    </article>
  );

  return <main className="vx-faqe vx-panel">
    <RifreskoAutomatik />
    <header className="panel-krye">
      <div>
        <p className="vx-etiketa">Hapësira e punës</p>
        <h1 className="vx-h1">Paneli i operatorit</h1>
        <p className="panel-krye-nen">{p.emri} · operator</p>
      </div>
      <Hyrja brenda klasa="dil-btn" />
    </header>

    {m && mesazhet[m] && <p role="status" className="panel-mesazh" data-m={m}>{mesazhet[m]}</p>}

    <div className="panel-numrat">
      <div><strong>{numri("ne_pritje")}</strong><span className="statusi-ne_pritje">Në pritje</span></div>
      <div><strong>{kerkesat.filter((k) => k.lloji === "konsulte" && k.statusi === "ne_pritje").length}</strong><span>Konsulta</span></div>
      <div><strong>{numri("pranuar")}</strong><span className="statusi-pranuar">Pranuar</span></div>
      <div><strong>{numri("refuzuar")}</strong><span className="statusi-refuzuar">Refuzuar</span></div>
    </div>

    <p className="vx-etiketa panel-titull">Kërkesat e reja</p>
    {teReja.length === 0 ? <p className="panel-bosh">Nuk ka kërkesa të reja.</p>
      : <div className="vx-panel-rrjeta">{teReja.map((k) => <Karta key={k.id} k={k} />)}</div>}

    {teTjera.length > 0 && <>
      <p className="vx-etiketa panel-titull">Të përfunduara</p>
      <div className="vx-panel-rrjeta">{teTjera.map((k) => <Karta key={k.id} k={k} />)}</div>
    </>}

    {/* Java 5: prova e lejeve (mbetet për demonstrim në klasë) */}
    <details className="panel-prova">
      <summary>Provë e lejeve (Java 5)</summary>
      <p>ID ime GitHub: <code>{p.id}</code></p>
      <form action={ruajStatusin}>
        <label htmlFor="id">ID e kërkesës</label>{" "}
        <input id="id" name="id" type="number" min="1" required />{" "}
        <input type="hidden" name="statusi" value="pranuar" />
        <button type="submit">Provo ta pranosh</button>
      </form>
      <p>Shkruaj ID-në e një kërkese për shërbim që nuk e zotëron. Serveri e refuzon.</p>
    </details>
  </main>;
}