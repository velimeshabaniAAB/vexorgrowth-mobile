import "server-only";
import { getSql } from "./db";
import type { Profil } from "./lejet";

export type Takim = {
  id: number;
  emri: string;
  sherbim: string;
  data: string;
  ora: string;
  zoom_link: string | null;
};

export type Detyre = { id: number; titulli: string; afati: string | null; kryer: boolean };

// Data e sotme në Kosovë, si "YYYY-MM-DD".
export const sotKosove = () => new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Belgrade" });

// "YYYY-MM-DD" + n ditë (pa probleme me orën verore).
export function shtoDite(data: string, n: number) {
  const [v, m, d] = data.split("-").map(Number);
  return new Date(Date.UTC(v, m - 1, d + n)).toISOString().slice(0, 10);
}

// E hëna e javës së datës së dhënë.
export function eHenaEJaves(data: string) {
  const [v, m, d] = data.split("-").map(Number);
  const dita = new Date(Date.UTC(v, m - 1, d)).getUTCDay(); // 0 = e diel
  return shtoDite(data, dita === 0 ? -6 : 1 - dita);
}

// Takimet e pranuara të operatorit midis dy datave.
export async function takimet(p: Profil, nga: string, deri: string): Promise<Takim[]> {
  const sql = getSql();
  const rows = await sql`
    SELECT k.id, k.emri, s.emri AS sherbim,
      to_char(k.data_takimit, 'YYYY-MM-DD') AS data, k.ora_takimit AS ora, k.zoom_link
    FROM kerkesat_vexor k JOIN sherbimet s ON s.id = k.sherbim_id
    WHERE s.operator_id = ${p.id} AND k.statusi = 'pranuar'
      AND k.data_takimit BETWEEN ${nga} AND ${deri}
    ORDER BY k.data_takimit, k.ora_takimit`;
  return rows as Takim[];
}

// Detyrat e operatorit: të pakryerat sipas afatit, pastaj të kryerat.
export async function detyrat(p: Profil): Promise<Detyre[]> {
  const sql = getSql();
  const rows = await sql`
    SELECT id, titulli, to_char(afati, 'YYYY-MM-DD') AS afati, kryer
    FROM detyrat_vexor WHERE github_id = ${p.id}
    ORDER BY kryer, afati NULLS LAST, id
    LIMIT 50`;
  return rows as Detyre[];
}

export async function shtoDetyre(p: Profil, titulli: string, afati: string | null) {
  const sql = getSql();
  await sql`INSERT INTO detyrat_vexor (github_id, titulli, afati) VALUES (${p.id}, ${titulli}, ${afati})`;
}

// Ndryshon "kryer" vetëm për detyrat e këtij operatori.
export async function ndryshoDetyren(p: Profil, id: number, kryer: boolean) {
  const sql = getSql();
  await sql`UPDATE detyrat_vexor SET kryer = ${kryer} WHERE id = ${id} AND github_id = ${p.id}`;
}