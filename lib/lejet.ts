import "server-only";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { getSql } from "./db";

export type Profil = { id: string; emri: string; roli: "kreator" | "operator" };

export type KerkesaPanel = {
  id: number;
  sherbim: string;
  emri: string;
  emaili: string;
  linku: string | null;
  mesazhi: string | null;
  statusi: "ne_pritje" | "pranuar" | "refuzuar";
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
    SELECT k.id, s.emri AS sherbim, k.emri, k.emaili, k.linku, k.mesazhi, k.statusi
    FROM kerkesat_vexor k JOIN sherbimet s ON s.id = k.sherbim_id
    WHERE s.operator_id = ${p.id}
    ORDER BY k.krijuar DESC`;
  return rows as KerkesaPanel[];
}

export async function ndryshoStatusin(id: string, statusi: string) {
  const p = await profiliIm();
  if (!p) return "hyr";
  if (p.roli !== "operator") return "ndaluar";
  if (!/^\d+$/.test(id) || !["pranuar", "refuzuar"].includes(statusi)) return "fushe";
  const sql = getSql();
  // Pronari vjen nga sesioni; jo nga një fushë e formularit.
  const rows = await sql`UPDATE kerkesat_vexor k SET statusi = ${statusi}
    FROM sherbimet s
    WHERE k.id = ${Number(id)} AND s.id = k.sherbim_id AND s.operator_id = ${p.id}
      AND EXISTS (SELECT 1 FROM profilet_vexor WHERE github_id = ${p.id} AND roli = 'operator')
    RETURNING k.id`;
  return rows.length === 1 ? "ruajtur" : "ndaluar";
}