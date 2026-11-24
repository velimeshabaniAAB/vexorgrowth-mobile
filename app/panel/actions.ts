"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ndryshoStatusin, pranoMeTakim } from "@/lib/lejet";
import { njoftoKreatorinPranuar, njoftoKreatorinRefuzuar } from "@/lib/email";
import { linkuIKerkeses } from "@/lib/kerkesat";


export async function ruajStatusin(formData: FormData) {
  const statusi = String(formData.get("statusi") ?? "");
  let mesazh: string;
  try {
    const r = await ndryshoStatusin(String(formData.get("id") ?? ""), statusi);
    mesazh = r.rezultati;
    if (r.rezultati === "ruajtur") {
      revalidatePath("/panel");
      // Kur refuzohet, kreatori merr email (nëse dështon, statusi mbetet i ruajtur).
      if (statusi === "refuzuar" && r.kerkesa) {
        let uDergua = false;
        try {
          uDergua = await njoftoKreatorinRefuzuar({
            ...r.kerkesa,
            linku: r.kerkesa.kodi ? linkuIKerkeses(r.kerkesa.kodi) : undefined,
          });
        } catch (e) { console.error(e); }
        mesazh = uDergua ? "refuzuar" : "refuzuar-pa-email";
      }
    }
  } catch {
    mesazh = "databaza";
  }
  // redirect qëndron jashtë try/catch: Next.js e përdor si kontroll rrjedhe.
  redirect("/panel?m=" + mesazh);
}

// Pranon kërkesën me datë, orë dhe link Zoom, pastaj i dërgon kreatorit ftesën.
export async function pranoKerkesen(formData: FormData) {
  let mesazh: string;
  try {
    const r = await pranoMeTakim(
      String(formData.get("id") ?? ""),
      String(formData.get("data") ?? ""),
      String(formData.get("ora") ?? ""),
      String(formData.get("zoom") ?? "").trim(),
    );
    mesazh = r.rezultati;
    if (r.takimi) {
      // Nëse emaili dështon, takimi mbetet i ruajtur.
      let uDergua = false;
      try { uDergua = await njoftoKreatorinPranuar({
        ...r.takimi,
        linku: r.takimi.kodi ? linkuIKerkeses(r.takimi.kodi) : undefined,
      }); } catch (e) { console.error(e); }
      mesazh = uDergua ? "pranuar" : "pranuar-pa-email";
      revalidatePath("/panel");
    }
  } catch (e) {
    console.error("Gabim gjatë pranimit:", e);
    mesazh = "databaza";
  }
  redirect("/panel?m=" + mesazh);
}