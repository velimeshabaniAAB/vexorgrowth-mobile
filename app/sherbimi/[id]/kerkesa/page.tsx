import Link from "next/link";
import { notFound } from "next/navigation";
import { gjejSherbimin } from "@/lib/sherbimet";
import { dergoKerkesen } from "@/app/actions";
import { Ikona, IKONAT } from "@/components/Ikona";

export const dynamic = "force-dynamic";

const GABIMET: Record<string, string> = {
  emri: "Shkruaj emrin tënd.",
  emaili: "Shkruaj një email të saktë.",
  linku: "Linku i profilit duhet të fillojë me https://",
  sherbimi: "Ky shërbim nuk ekziston.",
  databaza: "Kërkesa nuk u ruajt. Provo përsëri pas pak.",
};

export default async function Kerkesa({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ derguar?: string; gabim?: string }>;
}) {
  const { id } = await params;
  const { derguar, gabim } = await searchParams;

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

  // Pas dërgimit të suksesshëm
  if (derguar) {
    return (
      <main>
        <section className="center">
          <div className="status-icon">
            <Ikona d={IKONAT.check} size={34} sw={2.4} />
          </div>
          <h1>Kërkesa u dërgua</h1>
          <p>Faleminderit! Kërkesa për <strong>{sherbim.emri}</strong> u ruajt.</p>
          <p className="status-pill">Statusi: Në pritje</p>
          <p>Do të të kontaktojmë brenda 24 orësh në emailin që na dhe.</p>
          <Link className="action" href="/">Kthehu te shërbimet</Link>
        </section>
      </main>
    );
  }

  return (
    <main>
      <Link className="back" href={`/sherbimi/${id}`}>← Kthehu te detajet</Link>
      <p className="eyebrow">Përgjigje brenda 24 orësh</p>
      <h1>Kërkesë për: {sherbim.emri}</h1>
      <p>Na trego kush je dhe ku të gjen audienca.</p>

      <form className="form" action={dergoKerkesen}>
        <input type="hidden" name="sherbimId" value={sherbim.id} />
        <label className="field">
          <span>Emri dhe mbiemri</span>
          <input name="emri" type="text" required maxLength={120} autoComplete="name"
            placeholder="p.sh. Arta Krasniqi" />
        </label>
        <label className="field">
          <span>Email</span>
          <input name="emaili" type="email" required maxLength={200} autoComplete="email"
            placeholder="emri@email.com" />
        </label>
        <label className="field">
          <span>Linku i Instagram, TikTok ose YouTube (opsional)</span>
          <input name="linku" type="url" maxLength={300} placeholder="https://instagram.com/emri" />
        </label>
        <label className="field">
          <span>Mesazhi (opsional)</span>
          <textarea name="mesazhi" rows={4} maxLength={1500}
            placeholder="Për çka flet audienca jote? Çka do të ndërtojmë bashkë?" />
        </label>
        {gabim && GABIMET[gabim] && <p className="err" role="alert">{GABIMET[gabim]}</p>}
        <button className="action" type="submit">
          <Ikona d={IKONAT.dergo} size={18} sw={2} /> Dërgo kërkesën
        </button>
      </form>
    </main>
  );
}