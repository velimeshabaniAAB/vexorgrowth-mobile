import "server-only";
import { randomBytes } from "node:crypto";
import { getSql } from "./db";

// Ruan një kërkesë të re në tabelën kerkesat_vexor (statusi: ne_pritje)
// dhe kthen kodin personal për linkun /kerkesa/[kodi].
export async function ruajKerkesen(k: {
  sherbimId: string;
  emri: string;
  emaili: string;
  linku: string | null;
  mesazhi: string | null;
}): Promise<string> {
  const sql = getSql();
  // 12 shkronja të rastësishme: nuk mund të gjenden me hamendje.
  const kodi = randomBytes(9).toString("base64url");
  await sql`
    INSERT INTO kerkesat_vexor (sherbim_id, emri, emaili, linku, mesazhi, kodi)
    VALUES (${k.sherbimId}, ${k.emri}, ${k.emaili}, ${k.linku}, ${k.mesazhi}, ${kodi})
  `;
  return kodi;
}

export type KerkesaIme = {
  id: number;
  sherbim: string;
  emri: string;
  statusi: "ne_pritje" | "pranuar" | "refuzuar";
  derguar: string;
  pranuar: string | null;
  data_takimit: string | null;
  ora_takimit: string | null;
  zoom_link: string | null;
};

// Lexon një kërkesë vetëm me kodin personal (pa hyrje).
export async function gjejMeKod(kodi: string): Promise<KerkesaIme | undefined> {
  if (!/^[A-Za-z0-9_-]{8,40}$/.test(kodi)) return undefined;
  const sql = getSql();
  const rows = await sql`
    SELECT k.id, s.emri AS sherbim, k.emri, k.statusi,
      to_char(k.krijuar AT TIME ZONE 'Europe/Belgrade', 'DD.MM.YYYY, HH24:MI') AS derguar,
      to_char(k.pranuar_me AT TIME ZONE 'Europe/Belgrade', 'DD.MM.YYYY, HH24:MI') AS pranuar,
      to_char(k.data_takimit, 'YYYY-MM-DD') AS data_takimit, k.ora_takimit, k.zoom_link
    FROM kerkesat_vexor k JOIN sherbimet s ON s.id = k.sherbim_id
    WHERE k.kodi = ${kodi}`;
  return rows[0] as KerkesaIme | undefined;
}

// Linku i plotë për emailat (APP_URL ose NEXTAUTH_URL nga .env.local).
export function linkuIKerkeses(kodi: string) {
  const baza = (process.env.APP_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000").replace(/\/$/, "");
  return `${baza}/kerkesa/${kodi}`;
}


// Të gjitha kërkesat e një emaili (për "E humbe emailin?").
export async function kerkesatMeEmail(emaili: string) {
  const sql = getSql();
  const rows = await sql`
    SELECT s.emri AS sherbim, k.kodi, k.statusi
    FROM kerkesat_vexor k JOIN sherbimet s ON s.id = k.sherbim_id
    WHERE lower(k.emaili) = lower(${emaili}) AND k.kodi IS NOT NULL
    ORDER BY k.krijuar DESC
    LIMIT 20`;
  return rows as { sherbim: string; kodi: string; statusi: string }[];
}