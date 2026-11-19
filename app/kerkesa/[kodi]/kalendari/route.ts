import { gjejMeKod } from "@/lib/kerkesat";
import { krijoIcs } from "@/lib/email";

export const dynamic = "force-dynamic";

// Shkarkon takimi.ics për kërkesën e pranuar (Shto në kalendar).
export async function GET(_req: Request, { params }: { params: Promise<{ kodi: string }> }) {
  const { kodi } = await params;
  const k = await gjejMeKod(kodi).catch(() => undefined);
  if (!k || k.statusi !== "pranuar" || !k.data_takimit || !k.ora_takimit) {
    return new Response("Takimi nuk u gjet.", { status: 404 });
  }
  const ics = krijoIcs({ id: k.id, sherbim: k.sherbim, data: k.data_takimit, ora: k.ora_takimit, zoom: k.zoom_link ?? "" });
  return new Response(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="takimi.ics"',
      "Cache-Control": "no-store",
    },
  });
}