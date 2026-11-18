"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { lexoRuajtjen, ruajSherbimin } from "@/app/preferuarat/actions";

type Gjendja = "duke-lexuar" | "gati" | "duke-ruajtur" | "sukses" | "gabim" | "hyr";

export default function RuajSherbimin({ sherbimId }: { sherbimId: string }) {
  const [ruajtur, setRuajtur] = useState(false);
  const [gjendja, setGjendja] = useState<Gjendja>("duke-lexuar");
  const [mesazhi, setMesazhi] = useState("Po lexojmë të preferuarat…");
  const [deshira, setDeshira] = useState<boolean | null>(null);
  const nePune = useRef(false);

  // Kur hapet faqja, lexojmë nga serveri a është ruajtur.
  useEffect(() => {
    let anulo = false;
    lexoRuajtjen(sherbimId)
      .then((r) => {
        if (anulo) return;
        setRuajtur(r.ruajtur);
        setGjendja(r.brenda ? "gati" : "hyr");
        setMesazhi(r.brenda ? "" : "Hyr për të ruajtur shërbimet e preferuara.");
      })
      .catch(() => { if (!anulo) { setGjendja("gati"); setMesazhi(""); } });
    return () => { anulo = true; };
  }, [sherbimId]);

  async function ndrysho(vleraERe: boolean) {
    // Bllokon klikimet e përsëritura derisa të vijë përgjigjja.
    if (nePune.current) return;
    nePune.current = true;
    const eMeparshmja = ruajtur;

    // 1) Përditëso pamjen menjëherë dhe trego që po ruhet.
    setRuajtur(vleraERe);
    setGjendja("duke-ruajtur");
    setMesazhi(vleraERe ? "Po ruhet…" : "Po hiqet…");

    try {
      const r = await ruajSherbimin(sherbimId, vleraERe);
      if (r.ok) {
        // 2) Serveri konfirmoi: shfaq gjendjen e vërtetë nga databaza.
        setRuajtur(r.ruajtur);
        setGjendja("sukses");
        setMesazhi(r.ruajtur ? "U ruajt te të preferuarat." : "U hoq nga të preferuarat.");
      } else {
        // 3) Dështoi: rikthe gjendjen e mëparshme.
        setRuajtur(eMeparshmja);
        setDeshira(vleraERe);
        setGjendja(r.arsye === "hyr" ? "hyr" : "gabim");
        setMesazhi(r.arsye === "hyr"
          ? "Hyr për të ruajtur shërbimet e preferuara."
          : "Ruajtja dështoi. Asgjë nuk u ndryshua.");
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

  return (
    <section className="ruaj-sherbimin">
      <button type="button" className={ruajtur ? "ruaj-btn ruajtur" : "ruaj-btn"}
        data-testid="favorite-toggle" aria-pressed={ruajtur}
        disabled={zene || gjendja === "hyr"}
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
      {gjendja === "hyr" && <Link href="/panel">Hyr me GitHub</Link>}
    </section>
  );
}