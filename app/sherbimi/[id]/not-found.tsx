import Link from "next/link";

export default function SherbimiNukUGjet() {
  return (
    <main>
      <section className="center">
        <p className="big-404">404</p>
        <h1>Service not found</h1>
        <p>This address doesn’t match any service in the list.</p>
        <Link className="action" href="/">Back to services</Link>
      </section>
    </main>
  );
}