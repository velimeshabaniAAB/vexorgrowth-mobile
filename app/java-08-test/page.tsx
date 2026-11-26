import VendiTakimit from "@/components/VendiTakimit";

// Të dhëna fiktive për testin automatik: pa hyrje, pa Neon, pa sekrete.
const sherbimi = {
  emri: "eBook with the creator",
  kreatori: "Dritoni (fictional)",
  afati: "7 days",
  menyra: "Zoom meeting",
};

export default function Java08Test() {
  return (
    <main>
      <header className="app-header">
        <div className="brand" aria-label="Vexor Growth"><b>VEXOR</b><span>GROWTH</span></div>
      </header>
      <p className="eyebrow">Test page · fictional data</p>
      <h1>{sherbimi.emri}</h1>
      <p>Creator: {sherbimi.kreatori} · Timeline: {sherbimi.afati} · {sherbimi.menyra}</p>
      <VendiTakimit />
    </main>
  );
}