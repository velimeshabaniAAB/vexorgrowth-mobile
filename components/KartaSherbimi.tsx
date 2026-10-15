import Link from "next/link";
import type { Sherbim } from "@/lib/sherbimet";
import { Ikona, IKONAT } from "./Ikona";

// Ikona sipas kategorisë së shërbimit.
const ikonat: Record<string, string> = {
  "Analizë": IKONAT.analiza,
  "Produkt digjital": IKONAT.liber,
  "Marketing": IKONAT.rritje,
};

export function KartaSherbimi({ sherbim }: { sherbim: Sherbim }) {
  return (
    <article className="trip-card">
      <div className="card-head">
        <div className="icon-box">
          <Ikona d={ikonat[sherbim.kategoria] ?? IKONAT.yll} />
        </div>
        <div className="card-title">
          <span className="badge">{sherbim.kategoria}</span>
          <h2>{sherbim.emri}</h2>
        </div>
      </div>
      <p>Afati: {sherbim.afati} · {sherbim.menyra}</p>
      <div className="card-actions">
        <Link className="action" href={`/sherbimi/${sherbim.id}/kerkesa`}>
          Dërgo kërkesë
        </Link>
        <Link className="action action-ghost" href={`/sherbimi/${sherbim.id}`}>
          Detajet
        </Link>
      </div>
    </article>
  );
}