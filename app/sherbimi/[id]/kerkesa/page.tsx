import Link from "next/link";
import { notFound } from "next/navigation";
import { gjejSherbimin } from "@/lib/sherbimet";

export const dynamic = "force-dynamic";

export default async function Kerkesa({
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
      <Link href={`/sherbimi/${id}`}>← Kthehu te detajet</Link>
      {sherbim.vende > 0 ? (
        <>
          <h1>Simulim: Në pritje</h1>
          <p>Kërkesa për {sherbim.emri} nuk është dërguar te Vexor Growth.</p>
          <p>Ruajtjen dhe konfirmimin real do t’i shtojmë më vonë.</p>
        </>
      ) : <h1>Nuk ka vende të lira.</h1>}
    </main>
  );
}