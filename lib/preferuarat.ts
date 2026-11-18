import "server-only";
import { getSql } from "./db";

// A e ka ruajtur ky përdorues këtë shërbim?
export async function eshteRuajtur(githubId: string, sherbimId: string) {
  const sql = getSql();
  const rows = await sql`SELECT 1 FROM te_preferuarat_vexor
    WHERE github_id = ${githubId} AND sherbim_id = ${sherbimId}`;
  return rows.length > 0;
}

// Vendos gjendjen e dëshiruar (ruaj ose hiq). Nuk është "toggle":
// po ta dërgosh "ruaj" dy herë, rezultati mbetet një rresht, pa kopje.
export async function vendosRuajtjen(githubId: string, sherbimId: string, ruaj: boolean) {
  const sql = getSql();
  if (ruaj) {
    await sql`INSERT INTO te_preferuarat_vexor (github_id, sherbim_id)
      VALUES (${githubId}, ${sherbimId})
      ON CONFLICT (github_id, sherbim_id) DO NOTHING`;
  } else {
    await sql`DELETE FROM te_preferuarat_vexor
      WHERE github_id = ${githubId} AND sherbim_id = ${sherbimId}`;
  }
  return eshteRuajtur(githubId, sherbimId);
}