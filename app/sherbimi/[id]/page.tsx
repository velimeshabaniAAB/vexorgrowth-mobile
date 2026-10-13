import Link from "next/link";
import { notFound } from "next/navigation";
import { gjejSherbimin } from "@/lib/sherbimet";

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
        <h1>Vexor Growth</h1>
        <p role="alert">Nuk u lidhëm me databazën. Provo përsëri.</p>
        <Link href="/">← Kthehu te lista</Link>
      </main>
    );
  }
  if (!sherbim) notFound();

  return (
    <main>
      <Link href="/">← Kthehu te lista</Link>
      <h1>{sherbim.emri}</h1>
      <p>Kategoria: {sherbim.kategoria}</p>
      <p>Afati: {sherbim.afati}</p>
      <p>Si punojmë: {sherbim.menyra}</p>
      <p>Vende të lira: {sherbim.vende}</p>
      {sherbim.vende > 0 ? (
        <Link className="action" href={`/sherbimi/${id}/kerkesa`}>
          Kërko bashkëpunim
        </Link>
      ) : <button className="action" disabled>Nuk ka vende të lira</button>}
    </main>
  );
}