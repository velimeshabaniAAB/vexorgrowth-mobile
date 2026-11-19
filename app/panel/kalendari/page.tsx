import Link from "next/link";
import HyrjaEkipit from "@/components/HyrjaEkipit";
import { profiliIm, type Profil } from "@/lib/lejet";
import { dataShqip } from "@/lib/email";
import {
  takimet, detyrat, sotKosove, shtoDite, eHenaEJaves, type Takim, type Detyre,
} from "@/lib/kalendari";
import { shtoDetyren, kryejDetyren } from "./actions";

export const dynamic = "force-dynamic";

const DITET_SHKURT = ["Hën", "Mar", "Mër", "Enj", "Pre", "Sht", "Die"];
const MUAJT = ["Janar", "Shkurt", "Mars", "Prill", "Maj", "Qershor",
  "Korrik", "Gusht", "Shtator", "Tetor", "Nëntor", "Dhjetor"];

const mesazhet: Record<string, string> = {
  titulli: "Shkruaj titullin e detyrës.",
  databaza: "Nuk u lidhëm me databazën. Provo përsëri.",
};

export default async function Kalendari({ searchParams }: {
  searchParams: Promise<{ dita?: string; m?: string }>;
}) {
  const { dita: ditaParam, m } = await searchParams;
  const sot = sotKosove();
  const dita = ditaParam && /^\d{4}-\d{2}-\d{2}$/.test(ditaParam) ? ditaParam : sot;
  const hena = eHenaEJaves(dita);
  const java = Array.from({ length: 7 }, (_, i) => shtoDite(hena, i));

  let p: Profil | null;
  let takimetEJaves: Takim[] = [];
  let lista: Detyre[] = [];
  try {
    p = await profiliIm();
    if (p?.roli === "operator") {
      [takimetEJaves, lista] = await Promise.all([takimet(p, java[0], java[6]), detyrat(p)]);
    }
  } catch (e) {
    console.error("Gabimi i kalendarit:", e);
    return <main><h1>Kalendari</h1><p role="alert">{mesazhet.databaza}</p></main>;
  }
  if (!p) return <HyrjaEkipit />;
  if (p.roli !== "operator") return <HyrjaEkipit pa_qasje />;

  const [v, mu] = dita.split("-").map(Number);
  const takimetESotme = takimetEJaves.filter((t) => t.data === dita);
  const kaTakim = new Set(takimetEJaves.map((t) => t.data));

  return <main>
    <p className="eyebrow">Operatori</p>
    <h1>Kalendari</h1>
    <div className="kal-muaji">
      <Link href={`/panel/kalendari?dita=${shtoDite(hena, -7)}`} aria-label="Java e kaluar">←</Link>
      <span>{MUAJT[mu - 1]} {v}</span>
      <Link href={`/panel/kalendari?dita=${shtoDite(hena, 7)}`} aria-label="Java tjetër">→</Link>
    </div>

    <nav className="kal-java" aria-label="Ditët e javës">
      {java.map((d, i) => (
        <Link key={d} href={`/panel/kalendari?dita=${d}`}
          className={"kal-dita" + (d === dita ? " zgjedhur" : "") + (d === sot ? " sot" : "")}
          aria-current={d === dita ? "date" : undefined}>
          <span>{DITET_SHKURT[i]}</span>
          <strong>{Number(d.slice(8))}</strong>
          <i className={kaTakim.has(d) ? "kal-pika" : "kal-pika bosh"} aria-hidden="true" />
        </Link>
      ))}
    </nav>

    <p className="eyebrow panel-titull">Takimet · {dataShqip(dita)}</p>
    {takimetESotme.length === 0 ? <p className="panel-bosh">Nuk ka takime këtë ditë.</p> :
      takimetESotme.map((t) => (
        <article key={t.id} className="kal-takim">
          <div className="kal-ora"><strong>{t.ora}</strong><span>45 min</span></div>
          <div>
            <strong>{t.emri}</strong>
            <span>{t.sherbim}</span>
            {t.zoom_link && <a href={t.zoom_link} target="_blank" rel="noopener noreferrer">Hap Zoom</a>}
          </div>
        </article>
      ))}

    <p className="eyebrow panel-titull">Detyrat</p>
    {m && mesazhet[m] && <p role="status" className="panel-mesazh" data-m="fushe">{mesazhet[m]}</p>}
    <ul className="kal-detyrat">
      {lista.length === 0 && <li className="panel-bosh">Nuk ke detyra. Shto të parën më poshtë.</li>}
      {lista.map((d) => (
        <li key={d.id} className={d.kryer ? "kryer" : ""}>
          <form action={kryejDetyren}>
            <input type="hidden" name="id" value={d.id} />
            <input type="hidden" name="dita" value={dita} />
            <input type="hidden" name="kryer" value={d.kryer ? "0" : "1"} />
            <button type="submit" className="kal-kutia" aria-pressed={d.kryer}
              aria-label={d.kryer ? `Shëno si të pakryer: ${d.titulli}` : `Shëno si të kryer: ${d.titulli}`}>
              {d.kryer ? "✓" : ""}
            </button>
          </form>
          <div>
            <span>{d.titulli}</span>
            {d.afati && <small className={!d.kryer && d.afati < sot ? "vonuar" : ""}>Afati: {dataShqip(d.afati)}</small>}
          </div>
        </li>
      ))}
    </ul>

    <form action={shtoDetyren} className="kal-shto">
      <input type="hidden" name="dita" value={dita} />
      <label htmlFor="titulli">Detyrë e re</label>
      <input id="titulli" name="titulli" required maxLength={200} placeholder="p.sh. Përgatit auditimin para takimit" />      <label htmlFor="afati">Afati (opsional)</label>
      <input id="afati" name="afati" type="date" />
      <button className="action" type="submit">+ Shto detyrën</button>
    </form>
  </main>;
}