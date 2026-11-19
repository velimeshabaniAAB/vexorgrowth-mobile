import "server-only";

// Pamja e emailave (si te demoja): karta e bardhë, koka e zezë "VEXOR GROWTH".
// Çdo tekst nga përdoruesi kalon nga ruaj(), që të mos futet HTML i huaj.
export const ruaj = (t: string) =>
  t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

export const adresaBaze = () =>
  (process.env.APP_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000").replace(/\/$/, "");

export function butoni(teksti: string, linku: string, kryesor = true) {
  const stili = kryesor
    ? "background:#0a0a0a;color:#fafafa;border:1px solid #0a0a0a;"
    : "background:#ffffff;color:#18181b;border:1px solid #d4d4d8;";
  return `<a href="${ruaj(linku)}" style="${stili}display:inline-block;padding:12px 18px;margin:4px 6px 4px 0;border-radius:12px;font-weight:600;font-size:14px;text-decoration:none">${ruaj(teksti)}</a>`;
}

export function tabela(rreshtat: [string, string][]) {
  const r = rreshtat.map(([a, b], i) =>
    `<tr><td style="padding:10px 12px;color:#52525b;${i ? "border-top:1px solid #e4e4e7;" : ""}">${ruaj(a)}</td>` +
    `<td style="padding:10px 12px;text-align:right;font-weight:600;${i ? "border-top:1px solid #e4e4e7;" : ""}">${ruaj(b)}</td></tr>`).join("");
  return `<table role="presentation" style="width:100%;border:1px solid #e4e4e7;border-radius:12px;border-collapse:separate;border-spacing:0;margin:14px 0">${r}</table>`;
}

// Mbështjellësi i përbashkët. "permbajtja" është HTML i ndërtuar me ruaj(), butoni() dhe tabela().
export function emailVexor(titulli: string, permbajtja: string) {
  return `<!doctype html><html lang="sq"><body style="margin:0;background:#f4f4f5;font-family:Montserrat,Arial,sans-serif;color:#18181b">
<table role="presentation" style="width:100%;background:#f4f4f5;padding:24px 12px"><tr><td align="center">
<table role="presentation" style="width:100%;max-width:520px;background:#fafafa;border-radius:16px;overflow:hidden;border:1px solid #e4e4e7">
<tr><td style="background:#0a0a0a;padding:20px 24px;text-align:left">
<div style="color:#f2f2f2;font-size:18px;font-weight:600;letter-spacing:7px">VEXOR</div>
<div style="color:#a3a3a8;font-size:9px;letter-spacing:4px">— GROWTH —</div>
</td></tr>
<tr><td style="padding:24px;font-size:15px;line-height:1.6">
<h1 style="margin:0 0 12px;font-size:20px">${ruaj(titulli)}</h1>
${permbajtja}
</td></tr>
<tr><td style="padding:14px 24px;border-top:1px solid #e4e4e7;font-size:12px;color:#71717a">Vexor Growth · Shadow operating për kreatorë</td></tr>
</table></td></tr></table></body></html>`;
}