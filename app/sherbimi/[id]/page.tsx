import Link from "next/link";
import { notFound } from "next/navigation";
import { gjejSherbimin } from "@/lib/sherbimet";
import { Ikona, IKONAT } from "@/components/Ikona";

export const dynamic = "force-dynamic";

export default async function Detajet({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let sherbim;
  try {
    sherbim = await gjejSherbimin(id);
  } catch {
    return (
      <main>
        <Link className="back" href="/">← Kthehu te shërbimet</Link>
        <h1>Diçka nuk shkoi</h1>
        <p role="alert">Nuk u lidhëm me databazën. Provo përsëri.</p>
      </main>
    );
  }
  if (!sherbim) notFound();

  return (
    <main>
      <Link className="back" href="/">← Kthehu te shërbimet</Link>
      <span className="badge">{sherbim.kategoria}</span>
      <h1>{sherbim.emri}</h1>
      <p className="lead">{sherbim.pershkrimi}</p>

      <dl className="info-card">
        <div>
          <dt>Afati</dt>
          <dd>{sherbim.afati}</dd>
        </div>
        <div>
          <dt>Si punojmë</dt>
          <dd>{sherbim.menyra}</dd>
        </div>
      </dl>

      <section className="panel">
        <h2>Çka përfshin</h2>
        <ul className="check-list">
          {sherbim.perfshin.map((pika) => (
            <li key={pika}>
              <Ikona d={IKONAT.check} size={18} sw={2.2} />
              <span>{pika}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="panel">
        <h2>Për kë është</h2>
        <p>{sherbim.per_ke}</p>
      </section>

      <Link className="action" href={`/sherbimi/${id}/kerkesa`}>
        Dërgo kërkesë
      </Link>
    </main>
  );
}