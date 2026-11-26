import Link from "next/link";
import Hyrja from "@/components/Hyrja";

// Faqja "Hyrja e ekipit": shfaqet te /panel kur askush nuk ka hyrë,
// ose kur ka hyrë dikush që nuk është operator.
export default function HyrjaEkipit({ pa_qasje = false }: { pa_qasje?: boolean }) {
  return (
    <main className="hyrja-ekipit">
      <Link className="back" href="/rreth-nesh">← Back</Link>

      <div className="hyrja-qendra">
        <div className="hyrja-logo" aria-hidden="true">V</div>
        <div className="brand" aria-label="Vexor Growth"><b>VEXOR</b><span>GROWTH</span></div>
        <h1>Team login</h1>
        <p>For Vexor Growth operators only. Manage requests, meetings and tasks here.</p>
      </div>

      {pa_qasje ? (
        <p role="alert" className="panel-mesazh" data-m="ndaluar">
          This account is not part of the team. The panel is for operators only.
        </p>
      ) : null}

      {/* pa_qasje: përdoruesi ka hyrë, prandaj butoni bëhet "Dil" */}
      <Hyrja brenda={pa_qasje} />

      <p className="hyrja-shenim">
        🔒 Only team accounts are allowed. Any other login is rejected by the server.
      </p>

      <Link className="hyrja-kreator" href="/sherbimet">Are you a creator? View services</Link>
    </main>
  );
}