"use client";
import Link from "next/link";
import { useRef } from "react";
import type { Oferta } from "@/lib/oferta";

// Butoni "Detajet": hap një dritare sipër faqes, kartat e tjera nuk lëvizin.
export default function DetajetOferte({ o }: { o: Oferta }) {
  const dritarja = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button type="button" className="vx-btn vx-btn-ghost" onClick={() => dritarja.current?.showModal()}>
        Detajet
      </button>
      <dialog ref={dritarja} className="vx-dritare" aria-labelledby={`d-${o.id}`}
        onClick={(e) => { if (e.target === e.currentTarget) e.currentTarget.close(); }}>
        <div className="vx-dritare-brenda">
          <div className="vx-dritare-koka">
            <div>
              <p className="vx-etiketa-vogel">Çka përfshin</p>
              <h2 id={`d-${o.id}`}>{o.emri}</h2>
              <p>{o.pershkrimi}</p>
            </div>
            <button type="button" aria-label="Mbyll" className="vx-mbyll" onClick={() => dritarja.current?.close()}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
            </button>
          </div>
          <div className="vx-grupet">
            {o.detajet.map((g) => (
              <div key={g.titull}>
                <strong>{g.titull}</strong>
                <ul className="vx-lista">{g.pikat.map((p) => <li key={p}>{p}</li>)}</ul>
              </div>
            ))}
          </div>
          <div className="vx-dritare-fund">
            <span>Oferta dhe çmimi i punës sonë: pas takimit në Zoom.</span>
            <Link className="vx-btn" href={`/sherbimi/${o.id}/kerkesa`}>Dërgo kërkesë</Link>
          </div>
        </div>
      </dialog>
    </>
  );
}
