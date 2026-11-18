import VendiTakimit from "@/components/VendiTakimit";

// Të dhëna fiktive për testin automatik: pa hyrje, pa Neon, pa sekrete.
const sherbimi = {
  emri: "Ebook me kreatorin",
  kreatori: "Dritoni (fiktiv)",
  afati: "7 ditë",
  menyra: "Takim në Zoom",
};

export default function Java08Test() {
  return (
    <main>
      <header className="app-header">
        <div className="brand" aria-label="Vexor Growth"><b>VEXOR</b><span>GROWTH</span></div>
      </header>
      <p className="eyebrow">Faqe testi · të dhëna fiktive</p>
      <h1>{sherbimi.emri}</h1>
      <p>Kreatori: {sherbimi.kreatori} · Afati: {sherbimi.afati} · {sherbimi.menyra}</p>
      <VendiTakimit />
    </main>
  );
}