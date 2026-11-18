"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ndryshoStatusin } from "@/lib/lejet";

export async function ruajStatusin(formData: FormData) {
  let mesazh: string;
  try {
    mesazh = await ndryshoStatusin(
      String(formData.get("id") ?? ""),
      String(formData.get("statusi") ?? ""),
    );
  } catch {
    mesazh = "databaza";
  }
  if (mesazh === "ruajtur") revalidatePath("/panel");
  // redirect qëndron jashtë try/catch: Next.js e përdor si kontroll rrjedhe.
  redirect("/panel?m=" + mesazh);
}