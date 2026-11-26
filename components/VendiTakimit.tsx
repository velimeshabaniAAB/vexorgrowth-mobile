"use client";
import { useState } from "react";

type Gjendja = "idle" | "loading" | "success" | "denied" | "timeout" | "unavailable";

const mesazhet: Record<Gjendja, string> = {
  idle: "Your location is used only if you press the button.",
  loading: "Finding your location…",
  success: "Approximate location found. Confirm it or enter another place.",
  denied: "Permission denied. Enter the meeting place below.",
  timeout: "Location took too long. Enter the meeting place below.",
  unavailable: "This device can't provide a location. Enter the meeting place below.",
};

export default function VendiTakimit({ fillimi = "Online on Zoom" }: { fillimi?: string }) {
  const [teksti, setTeksti] = useState("");
  const [konfirmuar, setKonfirmuar] = useState(fillimi);
  const [gabimi, setGabimi] = useState("");
  const [gjendja, setGjendja] = useState<Gjendja>("idle");
  const [saktesia, setSaktesia] = useState<number | null>(null);

  // Ruhet vetëm teksti i konfirmuar; teksti i pakonfirmuar nuk e ndryshon zgjedhjen.
  function konfirmo() {
    const vendi = teksti.trim();
    if (!vendi) {
      setGabimi("Enter a meeting place before confirming.");
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
        setTeksti(`Near my location (±${metra} m)`);
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
      <h2 id="vendi-titulli">Meeting place</h2>
      <p>The meeting takes place on Zoom. If you prefer to meet in person, choose where.</p>

      <button type="button" className="action" data-testid="locate-me"
        onClick={gjejVendndodhjen} disabled={gjendja === "loading"}>
        Use my location
      </button>
      <p role="status" aria-live="polite" data-testid="location-status" data-state={gjendja}>
        {mesazhet[gjendja]}
      </p>
      <p data-testid="location-accuracy">
        {saktesia !== null ? `Accuracy: about ${saktesia} m` : ""}
      </p>

      <label htmlFor="vendtakimi">Enter the meeting place</label>
      <div className="vendi-rreshti">
        <input id="vendtakimi" data-testid="meeting-input" value={teksti}
          placeholder=""
          onChange={(e) => { setTeksti(e.target.value); setGabimi(""); }} />
        <button type="button" data-testid="confirm-meeting" onClick={konfirmo}>Confirm</button>
      </div>
      <p role="alert" data-testid="meeting-error">{gabimi}</p>

      <p>Confirmed meeting place: <strong data-testid="confirmed-meeting">{konfirmuar}</strong></p>
    </section>
  );
}