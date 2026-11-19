import Link from "next/link";
import Hyrja from "@/components/Hyrja";
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
  "pranuar-pa-email": "Kërkesa u pranua, por emaili te kreatori nuk u dërgua. Kontrollo Resend.",
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

  return <main>
    <header className="app-header">
      <div className="brand" aria-label="Vexor Growth"><b>VEXOR</b><span>GROWTH</span></div>
    </header>

    <p className="eyebrow">Hapësira e punës</p>
    <h1>Paneli im</h1>
    {m && mesazhet[m] && <p role="status" className="panel-mesazh" data-m={m}>{mesazhet[m]}</p>}
    {!p ? <p>Shërbimet janë publike. Për panelin hyr me llogarinë tënde GitHub.</p> : <>
      <p>Përshëndetje, {p.emri}. Roli: <strong>{p.roli}</strong>.</p>
      <p>ID ime GitHub: <code>{p.id}</code></p>
    </>}
    <Hyrja brenda={Boolean(p)} />

    {p?.roli === "operator" ? <section className="panel-seksion">
      <h2>Kërkesat për shërbimet e mia</h2>
      {kerkesat.length === 0 ? <p>Nuk ka kërkesa ende.</p> : kerkesat.map((k) => (
        <article key={k.id} className="panel-karta">
          <p className="eyebrow">#{k.id} · {k.sherbim}</p>
          <h3>{k.emri}</h3>
          <p>
            {k.emaili}
            {linkIsigurt(k.linku) && <> · <a href={linkIsigurt(k.linku)!} target="_blank" rel="noopener noreferrer">Profili</a></>}
          </p>
          {k.mesazhi && <p>{k.mesazhi}</p>}
          <p>Statusi: <strong className={"statusi statusi-" + k.statusi}>{etiketat[k.statusi]}</strong></p>
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
              <button className="action" type="submit">Prano dhe dërgo ftesën</button>
            </form>
            <form action={ruajStatusin}>
              <input type="hidden" name="id" value={k.id} />
              <button className="refuzo-btn" type="submit" name="statusi" value="refuzuar">Refuzo</button>
            </form>
          </>}
        </article>
      ))}

      <form action={ruajStatusin} className="panel-prova">
        <h2>Provë e lejeve</h2>
        <label htmlFor="id">ID e kërkesës</label>{" "}
        <input id="id" name="id" type="number" min="1" required />{" "}
        <input type="hidden" name="statusi" value="pranuar" />
        <button type="submit">Provo ta pranosh</button>
        <p>Shkruaj ID-në e një kërkese për shërbimin 1. Serveri e refuzon, sepse nuk je pronari.</p>
      </form>
    </section> : p && <p>Si kreator mund të shohësh shërbimet dhe të dërgosh kërkesa; nuk mund të pranosh kërkesat.</p>}

    <p><Link href="/">Kthehu te shërbimet</Link></p>
  </main>;
}