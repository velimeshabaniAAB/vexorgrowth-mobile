"use server";
import { profiliIm } from "@/lib/lejet";
import { eshteRuajtur, vendosRuajtjen } from "@/lib/preferuarat";

export type Pergjigja =
  | { ok: true; ruajtur: boolean }
  | { ok: false; arsye: "hyr" | "fushe" | "databaza" };

// Lexon gjendjen kur hapet faqja: a ka hyrë përdoruesi dhe a e ka ruajtur shërbimin.
export async function lexoRuajtjen(sherbimId: string) {
  try {
    const p = await profiliIm();
    if (!p) return { brenda: false, ruajtur: false };
    return { brenda: true, ruajtur: await eshteRuajtur(p.id, sherbimId) };
  } catch {
    return { brenda: false, ruajtur: false };
  }
}

// Ruan ose heq shërbimin. Përdoruesi vjen nga sesioni, jo nga formulari.
export async function ruajSherbimin(sherbimId: string, ruaj: boolean): Promise<Pergjigja> {
  if (!/^\d+$/.test(sherbimId)) return { ok: false, arsye: "fushe" };
  try {
    const p = await profiliIm();
    if (!p) return { ok: false, arsye: "hyr" };
    const ruajtur = await vendosRuajtjen(p.id, sherbimId, ruaj);
    return { ok: true, ruajtur };
  } catch {
    return { ok: false, arsye: "databaza" };
  }
}