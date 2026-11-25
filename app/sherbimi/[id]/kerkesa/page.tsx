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
  searchParams: Promise<{ derguar?: string; gabim?: string; kodi?: string; lloji?: string }>;
}) {
  const { id } = await params;
  const { derguar, gabim, kodi, lloji } = await searchParams;
  const konsulte = lloji === "konsulte";

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
    const kaKod = !!kodi && /^[A-Za-z0-9_-]{8,40}$/.test(kodi);
    return (
      <main className="vx-faqe">
        <section className="vx-konfirmimi">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-rreth.png" alt="Vexor Growth" width={170} height={170} />
          <p className="vx-etiketa">Kërkesa u dërgua</p>
          <h1 className="vx-h2">Faleminderit!</h1>
          <p className="vx-lead">
            Kërkesa për <strong>{konsulte ? "bisedë konsultuese" : sherbim.emri}</strong> u ruajt.{" "}
            {konsulte
              ? "Do të të shkruajmë brenda 24 orësh për të caktuar një bisedë të shkurtër në Zoom."
              : "Do të të kontaktojmë brenda 24 orësh në emailin që na dhe."}
          </p>
          <ol className="vx-hapat-mini" aria-label="Statusi">
            <li className="bere"><i aria-hidden="true">✓</i>Dërguar</li>
            <li className="tani"><i aria-hidden="true">2</i>Në pritje</li>
            <li><i aria-hidden="true">3</i>Takim në Zoom</li>
          </ol>
          <p className="vx-shenim">Të dërguam edhe një email me linkun personal. Nëse nuk e sheh, kontrollo te Spam.</p>
          <div className="vx-butonat">
            {kaKod && <Link className="vx-btn" href={`/kerkesa/${kodi}`}>Ndiq kërkesën</Link>}
            <Link className="vx-btn vx-btn-ghost" href="/sherbimet">Kthehu te shërbimet</Link>
          </div>
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

      <ol className="vx-si-funksionon" aria-label="Si funksionon kërkesa">
        <li><b>1</b><span><strong>Dërgon kërkesën</strong>Zgjedh shërbimin, ose kërko një bisedë konsultuese.</span></li>
        <li><b>2</b><span><strong>Merr email nga ne</strong>Të shkruajmë për të caktuar takimin.</span></li>
        <li><b>3</b><span><strong>Takim në Zoom</strong>Flasim gjerësisht për ty dhe produktin.</span></li>
        <li><b>4</b><span><strong>Merr ofertën</strong>Çmim i qartë, pa detyrim. Pastaj fillojmë.</span></li>
      </ol>

      <form className="form" action={dergoKerkesen}>
        <input type="hidden" name="sherbimId" value={sherbim.id} />
        <fieldset className="lloji-zgjedhje">
          <legend>Çfarë kërkon?</legend>
          <label className="lloji-opsion">
            <input type="radio" name="lloji" value="sherbim" defaultChecked />
            <span><strong>E di çfarë më duhet</strong>Dërgo kërkesë për këtë shërbim.</span>
          </label>
          <label className="lloji-opsion">
            <input type="radio" name="lloji" value="konsulte" />
            <span><strong>Nuk jam ende e sigurt</strong>Kërko një bisedë konsultuese dhe të ndihmojmë të zgjedhësh.</span>
          </label>
        </fieldset>
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