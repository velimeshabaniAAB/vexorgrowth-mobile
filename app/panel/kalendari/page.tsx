import Link from "next/link";
import HyrjaEkipit from "@/components/HyrjaEkipit";
import { profiliIm, type Profil } from "@/lib/lejet";
import { dataShqip } from "@/lib/email";
import {
  takimet, detyrat, sotKosove, shtoDite, eHenaEJaves, type Takim, type Detyre,
} from "@/lib/kalendari";
import { shtoDetyren, kryejDetyren } from "./actions";

export const dynamic = "force-dynamic";

const DITET_SHKURT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MUAJT = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

const mesazhet: Record<string, string> = {
  titulli: "Enter a task title.",
  databaza: "We couldn't reach the database. Please try again.",
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
    return <main><h1>Calendar</h1><p role="alert">{mesazhet.databaza}</p></main>;
  }
  if (!p) return <HyrjaEkipit />;
  if (p.roli !== "operator") return <HyrjaEkipit pa_qasje />;

  const [v, mu] = dita.split("-").map(Number);
  const takimetESotme = takimetEJaves.filter((t) => t.data === dita);
  const kaTakim = new Set(takimetEJaves.map((t) => t.data));

  return <main className="vx-faqe vx-panel">
    <p className="vx-etiketa">Operator</p>
    <h1 className="vx-h1">Calendar</h1>
    <div className="kal-muaji">
      <Link href={`/panel/kalendari?dita=${shtoDite(hena, -7)}`} aria-label="Previous week">←</Link>
      <span>{MUAJT[mu - 1]} {v}</span>
      <Link href={`/panel/kalendari?dita=${shtoDite(hena, 7)}`} aria-label="Next week">→</Link>
    </div>

    <nav className="kal-java" aria-label="Days of the week">
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

    <div className="vx-kal-kolonat">
    <section>
    <p className="vx-etiketa panel-titull">Takimet · {dataShqip(dita)}</p>
    {takimetESotme.length === 0 ? <p className="panel-bosh">No meetings on this day.</p> :
      takimetESotme.map((t) => (
        <article key={t.id} className="kal-takim">
          <div className="kal-ora"><strong>{t.ora}</strong><span>45 min</span></div>
          <div>
            <strong>{t.emri}</strong>
            <span>{t.sherbim}</span>
            {t.zoom_link && <a href={t.zoom_link} target="_blank" rel="noopener noreferrer">Open Zoom</a>}
          </div>
        </article>
      ))}

    </section>

    <section className="vx-kal-detyrat">
    <p className="vx-etiketa panel-titull">Tasks</p>
    {m && mesazhet[m] && <p role="status" className="panel-mesazh" data-m="fushe">{mesazhet[m]}</p>}
    <ul className="kal-detyrat">
      {lista.length === 0 && <li className="panel-bosh">No tasks yet. Add your first one below.</li>}
      {lista.map((d) => (
        <li key={d.id} className={d.kryer ? "kryer" : ""}>
          <form action={kryejDetyren}>
            <input type="hidden" name="id" value={d.id} />
            <input type="hidden" name="dita" value={dita} />
            <input type="hidden" name="kryer" value={d.kryer ? "0" : "1"} />
            <button type="submit" className="kal-kutia" aria-pressed={d.kryer}
              aria-label={d.kryer ? `Mark as not done: ${d.titulli}` : `Mark as done: ${d.titulli}`}>
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
      <label htmlFor="titulli">New task</label>
      <input id="titulli" name="titulli" required maxLength={200} placeholder="e.g. Prepare the audit before the meeting" />
      <label htmlFor="afati">Due date (optional)</label>
      <input id="afati" name="afati" type="date" />
      <button className="action" type="submit">+ Add task</button>
    </form>
    </section>
    </div>
  </main>;
}