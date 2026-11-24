import Link from "next/link";
import DetajetOferte from "@/components/DetajetOferte";
import RuajSherbimin from "@/components/RuajSherbimin";
import { OFERTA, MARKETINGU, type Oferta } from "@/lib/oferta";

export const dynamic = "force-dynamic";

// Kartë për një produkt individual ose një paketë.
function KartaOferte({ o }: { o: Oferta }) {
  return (
    <article className={o.shenja ? "vx-oferta vx-oferta-vecant" : "vx-oferta"}>
      {o.shenja && <span className="vx-shenja">{o.shenja}</span>}
      <div className="vx-oferta-koka">
        <div>
          <h2>{o.emri}</h2>
          <p>{o.pershkrimi}</p>
        </div>
        <RuajSherbimin sherbimId={o.id} kompakt />
      </div>
      <p className="vx-thekso">{o.thekso}</p>
      {o.cmimi && (
        <div className="vx-cmimet">
          <div><span>Çmimi yt i shitjes</span><strong>{o.cmimi}</strong></div>
          <div><span>Më i miri për</span><strong>{o.perKe}</strong></div>
        </div>
      )}
      <ul className="vx-lista">{o.shkurt.map((x) => <li key={x}>{x}</li>)}</ul>
      <div className="vx-oferta-butonat">
        <Link className="vx-btn" href={`/sherbimi/${o.id}/kerkesa`}>Dërgo kërkesë</Link>
        <DetajetOferte o={o} />
      </div>
    </article>
  );
}

export default async function Sherbimet({ searchParams }: {
  searchParams: Promise<{ lloji?: string }>;
}) {
  const { lloji } = await searchParams;
  const paketat = lloji === "paketat";

  const lista = OFERTA.filter((o) => o.lloji === (paketat ? "paketa" : "individuale"));

  return (
    <main className="vx-faqe">
      <section className="vx-sherbimet-koka">
        <div>
          <p className="vx-etiketa">Çfarë ofrojmë</p>
          <h1 className="vx-h1">Shërbimet</h1>
          <p className="vx-lead">Një produkt i vetëm kur e di çfarë do, ose një paketë e plotë nga ideja deri te shitja.</p>
        </div>
        <nav className="vx-tabet" aria-label="Kategoria">
          <Link href="/sherbimet" className={!paketat ? "aktiv" : undefined} aria-current={!paketat ? "page" : undefined}>Individuale</Link>
          <Link href="/sherbimet?lloji=paketat" className={paketat ? "aktiv" : undefined} aria-current={paketat ? "page" : undefined}>Paketat</Link>
        </nav>
      </section>

      <div className={paketat ? "vx-rrjeta vx-rrjeta-3" : "vx-rrjeta vx-rrjeta-2"}>
        {lista.map((o) => <KartaOferte key={o.id} o={o} />)}
      </div>

      <section className="vx-seksion vx-marketingu">
        <div>
          <p className="vx-etiketa">Marketingu dhe lansimi</p>
          <h2 className="vx-h2">Një produkt pa lansim nuk shitet.</h2>
          <p className="vx-lead">Çdo tekst shkruhet me zërin tënd dhe i flet drejtpërdrejt audiencës tënde.</p>
        </div>
        <div className="vx-marketingu-kartat">
          {MARKETINGU.map(([t, p]) => <div key={t}><strong>{t}</strong><span>{p}</span></div>)}
        </div>
      </section>
    </main>
  );
}
