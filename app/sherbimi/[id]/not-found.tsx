import Link from "next/link";

export default function SherbimiNukUGjet() {
  return (
    <main>
      <h1>Shërbimi nuk u gjet</h1>
      <p>Kjo adresë nuk përputhet me një shërbim në listë.</p>
      <Link className="action" href="/">Kthehu te lista</Link>
    </main>
  );
}