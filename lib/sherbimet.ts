import "server-only";
import { getSql } from "./db";

export type Sherbim = {
  id: string;
  emri: string;
  kategoria: string;
  afati: string;
  menyra: string;
  pershkrimi: string;
  perfshin: string[];
  per_ke: string;
};

export async function lexoSherbimet(): Promise<Sherbim[]> {
  const sql = getSql();
  const rows = await sql`
    SELECT id, emri, kategoria, afati, menyra, pershkrimi, perfshin, per_ke
    FROM sherbimet ORDER BY id
  `;
  return rows as Sherbim[];
}

export async function gjejSherbimin(id: string): Promise<Sherbim | undefined> {
  const sql = getSql();
  const rows = await sql`
    SELECT id, emri, kategoria, afati, menyra, pershkrimi, perfshin, per_ke
    FROM sherbimet WHERE id = ${id}
  `;
  return rows[0] as Sherbim | undefined;
}