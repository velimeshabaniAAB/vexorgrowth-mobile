import Link from "next/link";
import Hyrja from "@/components/Hyrja";

// Faqja "Hyrja e ekipit": shfaqet te /panel kur askush nuk ka hyrë,
// ose kur ka hyrë dikush që nuk është operator.
export default function HyrjaEkipit({ pa_qasje = false }: { pa_qasje?: boolean }) {
  return (
    <main className="hyrja-ekipit">
      <Link className="back" href="/rreth-nesh">← Kthehu</Link>

      <div className="hyrja-qendra">
        <div className="hyrja-logo" aria-hidden="true">V</div>
        <div className="brand" aria-label="Vexor Growth"><b>VEXOR</b><span>GROWTH</span></div>
        <h1>Hyrja e ekipit</h1>
        <p>Vetëm për operatorët e Vexor Growth. Këtu menaxhon kërkesat, takimet dhe detyrat.</p>
      </div>

      {pa_qasje ? (
        <p role="alert" className="panel-mesazh" data-m="ndaluar">
          Kjo llogari nuk është pjesë e ekipit. Paneli është vetëm për operatorët.
        </p>
      ) : null}

      {/* pa_qasje: përdoruesi ka hyrë, prandaj butoni bëhet "Dil" */}
      <Hyrja brenda={pa_qasje} />

      <p className="hyrja-shenim">
        🔒 Lejohen vetëm llogaritë e ekipit. Çdo hyrje tjetër refuzohet nga serveri.
      </p>

      <Link className="hyrja-kreator" href="/sherbimet">Je kreator? Shiko shërbimet</Link>
    </main>
  );
}