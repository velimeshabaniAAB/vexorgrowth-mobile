import "server-only";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { getSql } from "./db";
import type { Lloji } from "./kerkesat";

export type Profil = { id: string; emri: string; roli: "kreator" | "operator" };

export type KerkesaPanel = {
  id: number;
  sherbim: string;
  emri: string;
  emaili: string;
  linku: string | null;
  mesazhi: string | null;
  statusi: "ne_pritje" | "pranuar" | "refuzuar";
  lloji: Lloji;
  data_takimit: string | null;
  ora_takimit: string | null;
  zoom_link: string | null;
};

export type TakimiIPranuar = {
  id: number;
  emri: string;
  emaili: string;
  sherbim: string;
  kodi: string | null;
  lloji: Lloji;
  data: string;
  ora: string;
  zoom: string;
};

export async function profiliIm(): Promise<Profil | null> {
  const session = await getServerSession(authOptions);
  const id = session?.user?.id;
  if (!id || !/^\d+$/.test(id)) return null;
  const sql = getSql();
  // Çdo hyrje e re fillon si kreator. Formulari nuk mund të zgjedhë rol.
  await sql`INSERT INTO profilet_vexor (github_id, emri) VALUES (${id}, ${session.user.name ?? "Kreator"})
    ON CONFLICT (github_id) DO NOTHING`;
  const rows = await sql`SELECT github_id AS id, emri, roli FROM profilet_vexor WHERE github_id = ${id}`;
  return rows[0] as Profil;
}

// Vetëm kërkesat për shërbimet që i menaxhon ky operator.
export async function kerkesatEMia(p: Profil): Promise<KerkesaPanel[]> {
  if (p.roli !== "operator") return [];
  const sql = getSql();
  const rows = await sql`
    SELECT k.id, s.emri AS sherbim, k.emri, k.emaili, k.linku, k.mesazhi, k.statusi, k.lloji,
      to_char(k.data_takimit, 'YYYY-MM-DD') AS data_takimit, k.ora_takimit, k.zoom_link
    FROM kerkesat_vexor k JOIN sherbimet s ON s.id = k.sherbim_id
    WHERE s.operator_id = ${p.id}
    ORDER BY k.krijuar DESC`;
  return rows as KerkesaPanel[];
}

// Kreatori që duhet njoftuar kur kërkesa refuzohet.
export type KerkesaERefuzuar = {
  id: number; emri: string; emaili: string; kodi: string | null; lloji: Lloji; sherbim: string;
};

export async function ndryshoStatusin(id: string, statusi: string)
  : Promise<{ rezultati: "hyr" | "ndaluar" | "fushe" | "ruajtur"; kerkesa?: KerkesaERefuzuar }> {
  const p = await profiliIm();
  if (!p) return { rezultati: "hyr" };
  if (p.roli !== "operator") return { rezultati: "ndaluar" };
  if (!/^\d+$/.test(id) || !["pranuar", "refuzuar"].includes(statusi)) return { rezultati: "fushe" };
  const sql = getSql();
  // Pronari vjen nga sesioni; jo nga një fushë e formularit.
  const rows = await sql`UPDATE kerkesat_vexor k SET statusi = ${statusi}
    FROM sherbimet s
    WHERE k.id = ${Number(id)} AND s.id = k.sherbim_id AND s.operator_id = ${p.id}
      AND EXISTS (SELECT 1 FROM profilet_vexor WHERE github_id = ${p.id} AND roli = 'operator')
    RETURNING k.id, k.emri, k.emaili, k.kodi, k.lloji, s.emri AS sherbim`;
  if (rows.length !== 1) return { rezultati: "ndaluar" };
  return { rezultati: "ruajtur", kerkesa: rows[0] as KerkesaERefuzuar };
}

// Pranon kërkesën dhe cakton takimin. Vetëm operatori që zotëron shërbimin.
export async function pranoMeTakim(id: string, data: string, ora: string, zoom: string)
  : Promise<{ rezultati: "hyr" | "ndaluar" | "takimi" | "pranuar"; takimi?: TakimiIPranuar }> {
  const p = await profiliIm();
  if (!p) return { rezultati: "hyr" };
  if (p.roli !== "operator") return { rezultati: "ndaluar" };
  const dataOk = /^\d{4}-\d{2}-\d{2}$/.test(data);
  const oraOk = /^([01]\d|2[0-3]):[0-5]\d$/.test(ora);
  const zoomOk = /^https:\/\/([a-z0-9-]+\.)*zoom\.us\/\S+$/i.test(zoom);
  if (!/^\d+$/.test(id) || !dataOk || !oraOk || !zoomOk) return { rezultati: "takimi" };
  const sql = getSql();
  const rows = await sql`UPDATE kerkesat_vexor k
    SET statusi = 'pranuar', data_takimit = ${data}, ora_takimit = ${ora}, zoom_link = ${zoom}, pranuar_me = now()
    FROM sherbimet s
    WHERE k.id = ${Number(id)} AND s.id = k.sherbim_id AND s.operator_id = ${p.id}
      AND EXISTS (SELECT 1 FROM profilet_vexor WHERE github_id = ${p.id} AND roli = 'operator')
        RETURNING k.id, k.emri, k.emaili, k.kodi, k.lloji, s.emri AS sherbim`;
  if (rows.length !== 1) return { rezultati: "ndaluar" };
  const r = rows[0] as { id: number; emri: string; emaili: string; kodi: string | null; lloji: Lloji; sherbim: string };
  return { rezultati: "pranuar", takimi: { ...r, data, ora, zoom } };
}