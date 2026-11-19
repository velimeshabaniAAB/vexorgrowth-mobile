"use client";
import { useEffect, useRef, useState } from "react";
import { lexoRuajtjen, ruajSherbimin } from "@/app/preferuarat/actions";

type Gjendja = "duke-lexuar" | "gati" | "duke-ruajtur" | "sukses" | "gabim";

// Të preferuarat për vizitorët pa llogari ruhen në këtë pajisje.
const CELESI = "vexor-preferuarat";
function lexoLokale(): string[] {
  try { return JSON.parse(localStorage.getItem(CELESI) ?? "[]"); } catch { return []; }
}
function ruajLokale(id: string, ruaj: boolean) {
  try {
    const lista = new Set(lexoLokale());
    if (ruaj) lista.add(id); else lista.delete(id);
    localStorage.setItem(CELESI, JSON.stringify([...lista]));
    return true;
  } catch { return false; }
}

// kompakt: vetëm ylli (për kartat e listës). Përndryshe butoni i plotë (detajet).
export default function RuajSherbimin({ sherbimId, kompakt = false }: { sherbimId: string; kompakt?: boolean }) {
  const [ruajtur, setRuajtur] = useState(false);
  const [gjendja, setGjendja] = useState<Gjendja>("duke-lexuar");
  const [mesazhi, setMesazhi] = useState("");
  const [deshira, setDeshira] = useState<boolean | null>(null);
  // brenda = i kyçur (ruhet në databazë, Java 9); jashtë = ruhet në pajisje.
  const [brenda, setBrenda] = useState(false);
  const nePune = useRef(false);

  useEffect(() => {
    let anulo = false;
    lexoRuajtjen(sherbimId)
      .then((r) => {
        if (anulo) return;
        setBrenda(r.brenda);
        setRuajtur(r.brenda ? r.ruajtur : lexoLokale().includes(sherbimId));
        setGjendja("gati");
      })
      .catch(() => {
        if (anulo) return;
        setRuajtur(lexoLokale().includes(sherbimId));
        setGjendja("gati");
      });
    return () => { anulo = true; };
  }, [sherbimId]);

  async function ndrysho(vleraERe: boolean) {
    // Bllokon klikimet e përsëritura derisa të vijë përgjigjja.
    if (nePune.current) return;
    nePune.current = true;
    const eMeparshmja = ruajtur;

    // Pa llogari: ruaj në pajisje, menjëherë.
    if (!brenda) {
      const ok = ruajLokale(sherbimId, vleraERe);
      setRuajtur(ok ? vleraERe : eMeparshmja);
      setGjendja(ok ? "sukses" : "gabim");
      setMesazhi(ok
        ? (vleraERe ? "U ruajt në këtë pajisje." : "U hoq nga të preferuarat.")
        : "Pajisja nuk lejon ruajtjen.");
      nePune.current = false;
      return;
    }

    // Me llogari (Java 9): pamja ndryshon menjëherë, pastaj konfirmon serveri.
    setRuajtur(vleraERe);
    setGjendja("duke-ruajtur");
    setMesazhi(vleraERe ? "Po ruhet…" : "Po hiqet…");
    try {
      const r = await ruajSherbimin(sherbimId, vleraERe);
      if (r.ok) {
        setRuajtur(r.ruajtur);
        setGjendja("sukses");
        setMesazhi(r.ruajtur ? "U ruajt te të preferuarat." : "U hoq nga të preferuarat.");
      } else {
        setRuajtur(eMeparshmja);
        setDeshira(vleraERe);
        setGjendja("gabim");
        setMesazhi("Ruajtja dështoi. Asgjë nuk u ndryshua.");
      }
    } catch {
      // Serveri nuk u arrit: rikthe gjendjen e mëparshme.
      setRuajtur(eMeparshmja);
      setDeshira(vleraERe);
      setGjendja("gabim");
      setMesazhi("Ruajtja dështoi. Asgjë nuk u ndryshua.");
    } finally {
      nePune.current = false;
    }
  }

  const zene = gjendja === "duke-lexuar" || gjendja === "duke-ruajtur";
  const etiketa = ruajtur ? "E ruajtur te të preferuarat" : "Ruaj shërbimin te të preferuarat";

  if (kompakt) {
    return (
      <span className="ruaj-kompakt">
        <button type="button" className={ruajtur ? "yll-btn ruajtur" : "yll-btn"}
          aria-pressed={ruajtur} aria-label={etiketa} title={etiketa}
          disabled={zene} onClick={() => ndrysho(!ruajtur)}>
          {ruajtur ? "★" : "☆"}
        </button>
        <span className="sr-only" role="status" aria-live="polite">{mesazhi}</span>
      </span>
    );
  }

  return (
    <section className="ruaj-sherbimin">
      <button type="button" className={ruajtur ? "ruaj-btn ruajtur" : "ruaj-btn"}
        data-testid="favorite-toggle" aria-pressed={ruajtur}
        disabled={zene}
        onClick={() => ndrysho(!ruajtur)}>
        {ruajtur ? "★ E ruajtur te të preferuarat" : "☆ Ruaj shërbimin te të preferuarat"}
      </button>

      <p role="status" aria-live="polite" data-testid="favorite-status" data-state={gjendja}>
        {mesazhi}
      </p>

      {gjendja === "gabim" && deshira !== null && (
        <button type="button" data-testid="favorite-retry" onClick={() => ndrysho(deshira)}>
          Provo përsëri
        </button>
      )}
    </section>
  );
}