import { lexoSherbimet } from "@/lib/sherbimet";

export const dynamic = "force-dynamic";

// Vetëm të dhënat publike të shërbimit. Asnjë pronar, kërkesë, email ose sesion.
export async function GET() {
  try {
    const rows = await lexoSherbimet();
    const sherbimet = rows.map(({ id, emri, kategoria, afati, menyra, pershkrimi }) =>
      ({ id, emri, kategoria, afati, menyra, pershkrimi }));
    return Response.json({ sherbimet }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Lista nuk mund të lexohet tani." }, { status: 503 });
  }
}