import Link from "next/link";
import { notFound } from "next/navigation";
import { gjejSherbimin } from "@/lib/sherbimet";
import { dergoKerkesen } from "@/app/actions";
import { Ikona, IKONAT } from "@/components/Ikona";

export const dynamic = "force-dynamic";

const GABIMET: Record<string, string> = {
  emri: "Please enter your name.",
  emaili: "Please enter a valid email.",
  linku: "The profile link must start with https://",
  sherbimi: "This service does not exist.",
  databaza: "Your request was not saved. Please try again shortly.",
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
        <Link className="back" href="/">← Back to services</Link>
        <h1>Something went wrong</h1>
        <p role="alert">We couldn’t reach the database. Please try again.</p>
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
          <p className="vx-etiketa">Request sent</p>
          <h1 className="vx-h2">Thank you!</h1>
          <p className="vx-lead">
            Your request for <strong>{konsulte ? "a consultation call" : sherbim.emri}</strong> has been saved.{" "}
            {konsulte
              ? "We will write to you within 24 hours to book a short Zoom call."
              : "We will contact you within 24 hours at the email you gave us."}
          </p>
          <ol className="vx-hapat-mini" aria-label="Status">
            <li className="bere"><i aria-hidden="true">✓</i>Sent</li>
            <li className="tani"><i aria-hidden="true">2</i>Pending</li>
            <li><i aria-hidden="true">3</i>Zoom meeting</li>
          </ol>
          <p className="vx-shenim">We also sent you an email with your personal link. If you don’t see it, check your Spam folder.</p>
          <div className="vx-butonat">
            {kaKod && <Link className="vx-btn" href={`/kerkesa/${kodi}`}>Track your request</Link>}
            <Link className="vx-btn vx-btn-ghost" href="/sherbimet">Back to services</Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <Link className="back" href={`/sherbimi/${id}`}>← Kthehu te detajet</Link>
      <p className="eyebrow">Reply within 24 hours</p>
      <h1>Request for: {sherbim.emri}</h1>
      <p>Tell us who you are and where your audience finds you.</p>

      <ol className="vx-si-funksionon" aria-label="How the request works">
        <li><b>1</b><span><strong>Send your request</strong>Choose the service, or ask for a consultation call.</span></li>
        <li><b>2</b><span><strong>Get an email from us</strong>We write to you to book the meeting.</span></li>
        <li><b>3</b><span><strong>Zoom meeting</strong>We talk in depth about you and the product.</span></li>
        <li><b>4</b><span><strong>Get the offer</strong>A clear price, no obligation. Then we start.</span></li>
      </ol>

      <form className="form" action={dergoKerkesen}>
        <input type="hidden" name="sherbimId" value={sherbim.id} />
        <fieldset className="lloji-zgjedhje">
          <legend>What are you looking for?</legend>
          <label className="lloji-opsion">
            <input type="radio" name="lloji" value="sherbim" defaultChecked />
            <span><strong>I know what I need</strong>Send a request for this service.</span>
          </label>
          <label className="lloji-opsion">
            <input type="radio" name="lloji" value="konsulte" />
            <span><strong>I’m not sure yet</strong>Ask for a consultation call and we’ll help you choose.</span>
          </label>
        </fieldset>
        <label className="field">
          <span>Full name</span>
          <input name="emri" type="text" required maxLength={120} autoComplete="name"
            placeholder="First Last" />
        </label>
        <label className="field">
          <span>Email</span>
          <input name="emaili" type="email" required maxLength={200} autoComplete="email"
            placeholder="name@email.com" />
        </label>
        <label className="field">
          <span>Instagram, TikTok or YouTube link (optional)</span>
          <input name="linku" type="url" maxLength={300} placeholder="https://instagram.com/yourname" />
        </label>
        <label className="field">
          <span>Message (optional)</span>
          <textarea name="mesazhi" rows={4} maxLength={1500}
            placeholder="What does your audience talk about? What should we build together?" />
        </label>
        {gabim && GABIMET[gabim] && <p className="err" role="alert">{GABIMET[gabim]}</p>}
        <button className="action" type="submit">
          <Ikona d={IKONAT.dergo} size={18} sw={2} /> Send request
        </button>
      </form>
    </main>
  );
}