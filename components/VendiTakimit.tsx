"use client";
import { useState } from "react";

type Gjendja = "idle" | "loading" | "success" | "denied" | "timeout" | "unavailable";

const mesazhet: Record<Gjendja, string> = {
  idle: "Vendndodhja përdoret vetëm nëse shtyp butonin.",
  loading: "Po kërkojmë vendndodhjen…",
  success: "Vendndodhja u gjet afërsisht. Konfirmo ose shkruaj një vend tjetër.",
  denied: "Leja u refuzua. Shkruaj vendtakimin më poshtë.",
  timeout: "Vendndodhja vonoi shumë. Shkruaj vendtakimin më poshtë.",
  unavailable: "Kjo pajisje nuk e jep vendndodhjen. Shkruaj vendtakimin më poshtë.",
};

export default function VendiTakimit({ fillimi = "Online në Zoom" }: { fillimi?: string }) {
  const [teksti, setTeksti] = useState("");
  const [konfirmuar, setKonfirmuar] = useState(fillimi);
  const [gabimi, setGabimi] = useState("");
  const [gjendja, setGjendja] = useState<Gjendja>("idle");
  const [saktesia, setSaktesia] = useState<number | null>(null);

  // Ruhet vetëm teksti i konfirmuar; teksti i pakonfirmuar nuk e ndryshon zgjedhjen.
  function konfirmo() {
    const vendi = teksti.trim();
    if (!vendi) {
      setGabimi("Shkruaj një vendtakim para se ta konfirmosh.");
      return;
    }
    setGabimi("");
    setKonfirmuar(vendi);
  }

  // Leja kërkohet vetëm pasi përdoruesi shtyp butonin.
  function gjejVendndodhjen() {
    setSaktesia(null);
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      setGjendja("unavailable");
      return;
    }
    setGjendja("loading");
    navigator.geolocation.getCurrentPosition(
      (pozita) => {
        // Koordinatat nuk shfaqen dhe nuk ruhen; tregojmë vetëm saktësinë.
        const metra = Math.round(pozita.coords.accuracy);
        setSaktesia(metra);
        setTeksti(`Pranë vendndodhjes sime (±${metra} m)`);
        setGjendja("success");
      },
      (gabim) => {
        // 1 = leja u refuzua, 3 = koha mbaroi, të tjerat = e padisponueshme
        setGjendja(gabim.code === 1 ? "denied" : gabim.code === 3 ? "timeout" : "unavailable");
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
    );
  }

  return (
    <section className="vendi-takimit" aria-labelledby="vendi-titulli">
      <h2 id="vendi-titulli">Vendi i takimit</h2>
      <p>Takimi bëhet në Zoom. Nëse preferon takim fizik, zgjidh ku të takohemi.</p>

      <button type="button" className="action" data-testid="locate-me"
        onClick={gjejVendndodhjen} disabled={gjendja === "loading"}>
        Përdor vendndodhjen time
      </button>
      <p role="status" aria-live="polite" data-testid="location-status" data-state={gjendja}>
        {mesazhet[gjendja]}
      </p>
      <p data-testid="location-accuracy">
        {saktesia !== null ? `Saktësia: rreth ${saktesia} m` : ""}
      </p>

      <label htmlFor="vendtakimi">Shkruaj vendtakimin</label>
      <div className="vendi-rreshti">
        <input id="vendtakimi" data-testid="meeting-input" value={teksti}
          placeholder=""
          onChange={(e) => { setTeksti(e.target.value); setGabimi(""); }} />
        <button type="button" data-testid="confirm-meeting" onClick={konfirmo}>Konfirmo</button>
      </div>
      <p role="alert" data-testid="meeting-error">{gabimi}</p>

      <p>Vendtakimi i konfirmuar: <strong data-testid="confirmed-meeting">{konfirmuar}</strong></p>
    </section>
  );
}