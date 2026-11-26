import Link from "next/link";
import { dergoLinqet } from "./actions";

export const dynamic = "force-dynamic";

const mesazhet: Record<string, string> = {
  derguar: "If this email has requests, the links will arrive within a few minutes. Check Spam too.",
  emaili: "Please enter a valid email.",
};

export default async function KerkesatEMia({ searchParams }: {
  searchParams: Promise<{ m?: string }>;
}) {
  const { m } = await searchParams;
  return (
    <main>
      <p className="eyebrow">For creators</p>
      <h1>My requests</h1>
      <p className="lead">
        No account needed. When you send a request, you get a personal link by email where you see
        the status, the date and the meeting link.
      </p>

      <div className="kerkesat-info">
        <span aria-hidden="true">✉️</span>
        <div>
          <strong>Open the link from your email</strong>
          <span>&quot;We received your request&quot; · from Vexor Growth</span>
        </div>
      </div>

      <form action={dergoLinqet} className="kerkesat-forma">
        <h2>Lost the email?</h2>
        <label htmlFor="emaili">The email you used for your request</label>
        <input id="emaili" name="emaili" type="email" required maxLength={200}
          autoComplete="email" placeholder="name@gmail.com" />
        <button className="action" type="submit">Send me the link again</button>
        {m && mesazhet[m] && (
          <p role="status" className="panel-mesazh" data-m={m === "derguar" ? "ruajtur" : "fushe"}>
            {mesazhet[m]}
          </p>
        )}
      </form>

      <p className="kerkesat-fund">
        Haven&apos;t sent a request yet? <Link href="/sherbimet">View services</Link>
      </p>
    </main>
  );
}