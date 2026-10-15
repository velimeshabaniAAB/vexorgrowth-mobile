"use server";

import { redirect } from "next/navigation";
import { gjejSherbimin } from "@/lib/sherbimet";
import { ruajKerkesen } from "@/lib/kerkesat";
import { njoftoMeEmail } from "@/lib/email";

function lexo(formData: FormData, emri: string, max: number) {
  const v = formData.get(emri);
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

// Thirret kur kreatori klikon "Dërgo kërkesën".
export async function dergoKerkesen(formData: FormData) {
  const sherbimId = lexo(formData, "sherbimId", 20);
  const faqja = `/sherbimi/${encodeURIComponent(sherbimId)}/kerkesa`;
  const gabim = (kodi: string): never => redirect(`${faqja}?gabim=${kodi}`);

  const emri = lexo(formData, "emri", 120);
  const emaili = lexo(formData, "emaili", 200);
  const linku = lexo(formData, "linku", 300);
  const mesazhi = lexo(formData, "mesazhi", 1500);

  if (!emri) gabim("emri");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emaili)) gabim("emaili");
  if (linku && !/^https?:\/\//.test(linku)) gabim("linku");

  // 1) Gjej shërbimin
  let sherbim;
  try {
    sherbim = await gjejSherbimin(sherbimId);
  } catch (e) {
    console.error("Gabim gjatë leximit të shërbimit:", e);
    gabim("databaza");
  }
  if (!sherbim) gabim("sherbimi");

  // 2) Ruaj kërkesën
  let uRuajt = false;
  try {
    await ruajKerkesen({ sherbimId, emri, emaili, linku: linku || null, mesazhi: mesazhi || null });
    uRuajt = true;
  } catch (e) {
    console.error("Gabim gjatë ruajtjes së kërkesës:", e);
  }
  if (!uRuajt) gabim("databaza");

  // 3) Email (opsional): nëse dështon, kërkesa mbetet e ruajtur
  try {
    await njoftoMeEmail({ sherbimi: sherbim!.emri, emri, emaili, linku: linku || null, mesazhi: mesazhi || null });
  } catch (e) {
    console.error("Emaili nuk u dërgua:", e);
  }

  redirect(`${faqja}?derguar=1`);
}