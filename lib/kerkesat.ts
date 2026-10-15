import "server-only";
import { getSql } from "./db";

// Ruan një kërkesë të re në tabelën kerkesat_vexor (statusi: ne_pritje).
export async function ruajKerkesen(k: {
  sherbimId: string;
  emri: string;
  emaili: string;
  linku: string | null;
  mesazhi: string | null;
}) {
  const sql = getSql();
  await sql`
    INSERT INTO kerkesat_vexor (sherbim_id, emri, emaili, linku, mesazhi)
    VALUES (${k.sherbimId}, ${k.emri}, ${k.emaili}, ${k.linku}, ${k.mesazhi})
  `;
}