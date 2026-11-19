"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { profiliIm } from "@/lib/lejet";
import { shtoDetyre, ndryshoDetyren } from "@/lib/kalendari";

// Kthehu te e njëjta ditë e kalendarit pas veprimit.
const kthehu = (dita: string, m?: string) => {
  const d = /^\d{4}-\d{2}-\d{2}$/.test(dita) ? dita : "";
  redirect(`/panel/kalendari?${d ? `dita=${d}&` : ""}${m ? `m=${m}` : ""}`);
};

export async function shtoDetyren(formData: FormData) {
  const dita = String(formData.get("dita") ?? "");
  const titulli = String(formData.get("titulli") ?? "").trim().slice(0, 200);
  const afati = String(formData.get("afati") ?? "");
  const p = await profiliIm().catch(() => null);
  if (!p || p.roli !== "operator") redirect("/panel");
  if (!titulli) kthehu(dita, "titulli");
  try {
    await shtoDetyre(p!, titulli, /^\d{4}-\d{2}-\d{2}$/.test(afati) ? afati : null);
    revalidatePath("/panel/kalendari");
  } catch (e) {
    console.error("Detyra nuk u ruajt:", e);
    kthehu(dita, "databaza");
  }
  kthehu(dita);
}

export async function kryejDetyren(formData: FormData) {
  const dita = String(formData.get("dita") ?? "");
  const id = Number(formData.get("id"));
  const kryer = formData.get("kryer") === "1";
  const p = await profiliIm().catch(() => null);
  if (!p || p.roli !== "operator") redirect("/panel");
  if (Number.isInteger(id) && id > 0) {
    try {
      await ndryshoDetyren(p!, id, kryer);
      revalidatePath("/panel/kalendari");
    } catch (e) {
      console.error("Detyra nuk u ndryshua:", e);
      kthehu(dita, "databaza");
    }
  }
  kthehu(dita);
}