import Link from "next/link";
import type { Sherbim } from "@/lib/sherbimet";

export function KartaSherbimi({ sherbim }: { sherbim: Sherbim }) {
  return (
    <article className="trip-card">
      <h2>{sherbim.emri}</h2>
      <p>Afati: {sherbim.afati} · Vende të lira: {sherbim.vende}</p>
      <Link className="action" href={`/sherbimi/${sherbim.id}`}>
        Shiko detajet
      </Link>
    </article>
  );
}