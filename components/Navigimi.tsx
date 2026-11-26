"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Lidhja = { href: string; emri: string; ikona: string };

// Ikonat si vija (SVG), të njëjtat si te demoja.
const IK = {
  ballina: "M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z",
  sherbimet: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
  rreth: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 11v6M12 7.5v.5",
  kalendari: "M5.5 5h13a2 2 0 0 1 2 2v11.5a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM3.5 10h17M8 3v4M16 3v4",
  kerkesat: "M4 13h4l2 3h4l2-3h4M5 5h14l1 8v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6z",
};

// Menuja e kreatorit (pjesa publike).
const kreatori: Lidhja[] = [
  { href: "/", emri: "Home", ikona: IK.ballina },
  { href: "/sherbimet", emri: "Services", ikona: IK.sherbimet },
  { href: "/kerkesat", emri: "Requests", ikona: IK.kerkesat },
  { href: "/rreth-nesh", emri: "About", ikona: IK.rreth },
];

// Menuja e operatorit (paneli).
const operatori: Lidhja[] = [
  { href: "/panel", emri: "Requests", ikona: IK.kerkesat },
  { href: "/panel/kalendari", emri: "Calendar", ikona: IK.kalendari },
  { href: "/", emri: "App", ikona: IK.ballina },
];

export default function Navigimi() {
  const rruga = usePathname() ?? "/";
  const lidhjet = rruga.startsWith("/panel") ? operatori : kreatori;

  // Aktive: përputhje e saktë për "/", ndryshe fillimi i rrugës.
  // "/kerkesa/[kodi]" (faqja personale) e ndez edhe "Kërkesat".
  const eshteAktive = (href: string) =>
    href === "/" ? rruga === "/"
      : href === "/panel" ? rruga === "/panel"
      : rruga === href || rruga.startsWith(href + "/") || (href === "/kerkesat" && rruga.startsWith("/kerkesa/"));
  return (
    <nav className="navigimi" aria-label="Main menu">
      {lidhjet.map((l) => {
        const aktive = eshteAktive(l.href);
        return (
          <Link key={l.href + l.emri} href={l.href} className={aktive ? "nav-lidhja aktive" : "nav-lidhja"}
            aria-current={aktive ? "page" : undefined}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d={l.ikona} />
            </svg>
            {l.emri}
          </Link>
        );
      })}
    </nav>
  );
}
