import Link from "next/link";
import { dergoLinqet } from "./actions";

export const dynamic = "force-dynamic";

const mesazhet: Record<string, string> = {
  derguar: "Nëse ky email ka kërkesa, linqet të vijnë brenda pak minutash. Shiko edhe te Spam.",
  emaili: "Shkruaj një email të saktë.",
};

export default async function KerkesatEMia({ searchParams }: {
  searchParams: Promise<{ m?: string }>;
}) {
  const { m } = await searchParams;
  return (
    <main>
      <p className="eyebrow">Për kreatorët</p>
      <h1>Kërkesat e mia</h1>
      <p className="lead">
        Nuk të duhet llogari. Kur dërgon kërkesën, të vjen me email një link personal ku sheh
        statusin, datën dhe linkun e takimit.
      </p>

      <div className="kerkesat-info">
        <span aria-hidden="true">✉️</span>
        <div>
          <strong>Hape linkun nga emaili</strong>
          <span>&quot;E morëm kërkesën tënde&quot; · nga Vexor Growth</span>
        </div>
      </div>

      <form action={dergoLinqet} className="kerkesat-forma">
        <h2>E humbe emailin?</h2>
        <label htmlFor="emaili">Emaili me të cilin dërgove kërkesën</label>
        <input id="emaili" name="emaili" type="email" required maxLength={200}
          autoComplete="email" placeholder="emri@gmail.com" />
        <button className="action" type="submit">Ma dërgo linkun përsëri</button>
        {m && mesazhet[m] && (
          <p role="status" className="panel-mesazh" data-m={m === "derguar" ? "ruajtur" : "fushe"}>
            {mesazhet[m]}
          </p>
        )}
      </form>

      <p className="kerkesat-fund">
        Ende s&apos;ke dërguar kërkesë? <Link href="/sherbimet">Shiko shërbimet</Link>
      </p>
    </main>
  );
}