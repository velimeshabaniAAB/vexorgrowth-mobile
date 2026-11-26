"use client";
import Link from "next/link";
import { useState } from "react";

// Kalkulatori i potencialit: ndjekës × % blerës × çmimi i produktit.
const PRODUKTET = [
  { id: "ebook", emri: "eBook", cmimi: 67 },
  { id: "kurs", emri: "Video course", cmimi: 197 },
  { id: "mjete", emri: "Toolkit", cmimi: 47 },
  { id: "coaching", emri: "Coaching", cmimi: 2000 },
];

const fmt = (n: number) => n.toLocaleString("en-US");

export default function Kalkulatori() {
  const [ndjekes, setNdjekes] = useState(19000);
  const [perqind, setPerqind] = useState(1);
  const [produkti, setProdukti] = useState("ebook");
  const p = PRODUKTET.find((x) => x.id === produkti) ?? PRODUKTET[0];
  const bleres = Math.round((ndjekes * perqind) / 100);

  return (
    <section className="vx-kalk" aria-labelledby="kalk-titulli">
      <div className="vx-kalk-kontrollet">
        <p className="vx-etiketa">Potential calculator</p>
        <h2 id="kalk-titulli" className="vx-h2">How much could you earn from one launch?</h2>

        <div className="vx-rreshqites">
          <div><label htmlFor="kalk-ndjekes">Followers</label><strong>{fmt(ndjekes)}</strong></div>
          <input id="kalk-ndjekes" type="range" min={1000} max={500000} step={1000}
            value={ndjekes} onChange={(e) => setNdjekes(Number(e.target.value))} />
        </div>
        <div className="vx-rreshqites">
          <div><label htmlFor="kalk-perqind">% of followers who buy</label><strong>{perqind.toFixed(1)}%</strong></div>
          <input id="kalk-perqind" type="range" min={0.1} max={3} step={0.1}
            value={perqind} onChange={(e) => setPerqind(Number(e.target.value))} />
        </div>

        <fieldset className="vx-kalk-produktet">
          <legend>Product</legend>
          {PRODUKTET.map((x) => (
            <button key={x.id} type="button" aria-pressed={x.id === produkti}
              className={x.id === produkti ? "aktiv" : undefined} onClick={() => setProdukti(x.id)}>
              <strong>{x.emri}</strong><span>${fmt(x.cmimi)}</span>
            </button>
          ))}
        </fieldset>
      </div>

      <div className="vx-kalk-rezultati" aria-live="polite">
        <span>Potential revenue from one launch</span>
        <strong className="vx-kalk-shuma">${fmt(bleres * p.cmimi)}</strong>
        <div className="vx-kalk-detajet">
          <div><span>Buyers</span><b>{fmt(bleres)}</b></div>
          <div><span>Product price</span><b>${fmt(p.cmimi)}</b></div>
        </div>
        <p>A simple estimate, not a promise. Get the real number for your profile with the free audit.</p>
        <Link className="vx-btn-zi" href="/sherbimet">Get the real number</Link>
      </div>
    </section>
  );
}
