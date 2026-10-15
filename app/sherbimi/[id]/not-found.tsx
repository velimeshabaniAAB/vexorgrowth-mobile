import Link from "next/link";

export default function SherbimiNukUGjet() {
  return (
    <main>
      <section className="center">
        <p className="big-404">404</p>
        <h1>Shërbimi nuk u gjet</h1>
        <p>Kjo adresë nuk përputhet me një shërbim në listë.</p>
        <Link className="action" href="/">Kthehu te shërbimet</Link>
      </section>
    </main>
  );
}