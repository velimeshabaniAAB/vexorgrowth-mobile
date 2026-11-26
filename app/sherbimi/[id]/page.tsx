import Link from "next/link";
import { notFound } from "next/navigation";
import { gjejSherbimin } from "@/lib/sherbimet";
import { Ikona, IKONAT } from "@/components/Ikona";
import VendiTakimit from "@/components/VendiTakimit";
import RuajSherbimin from "@/components/RuajSherbimin";

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
        <Link className="back" href="/">← Back to services</Link>
        <h1>Something went wrong</h1>
        <p role="alert">We couldn’t reach the database. Please try again.</p>
      </main>
    );
  }
  if (!sherbim) notFound();

  return (
    <main>
      <Link className="back" href="/">← Back to services</Link>
      <span className="badge">{sherbim.kategoria}</span>
      <h1>{sherbim.emri}</h1>
      <p className="lead">{sherbim.pershkrimi}</p>
      <RuajSherbimin sherbimId={sherbim.id} />

      <dl className="info-card">
        <div>
          <dt>Timeline</dt>
          <dd>{sherbim.afati}</dd>
        </div>
        <div>
          <dt>How we work</dt>
          <dd>{sherbim.menyra}</dd>
        </div>
      </dl>

      <section className="panel">
        <h2>What’s included</h2>
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
        <h2>Who it’s for</h2>
        <p>{sherbim.per_ke}</p>
      </section>

      <Link className="action" href={`/sherbimi/${id}/kerkesa`}>
        Send a request
      </Link>
      <VendiTakimit />
    </main>
  );
}