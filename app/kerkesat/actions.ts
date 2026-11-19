"use server";
import { redirect } from "next/navigation";
import { kerkesatMeEmail, linkuIKerkeses } from "@/lib/kerkesat";
import { dergoLinqetEKerkesave } from "@/lib/email";

// Dërgon linqet e kërkesave te emaili. Përgjigjja është e njëjtë
// edhe kur emaili s'ka kërkesa, që të mos zbulohet kush ka dërguar.
export async function dergoLinqet(formData: FormData) {
  const emaili = String(formData.get("emaili") ?? "").trim().slice(0, 200);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emaili)) redirect("/kerkesat?m=emaili");
  try {
    const lista = await kerkesatMeEmail(emaili);
    if (lista.length > 0) {
      await dergoLinqetEKerkesave(
        emaili,
        lista.map((k) => ({ sherbim: k.sherbim, statusi: k.statusi, linku: linkuIKerkeses(k.kodi) })),
      );
    }
  } catch (e) {
    console.error("Linqet nuk u dërguan:", e);
  }
  redirect("/kerkesat?m=derguar");
}