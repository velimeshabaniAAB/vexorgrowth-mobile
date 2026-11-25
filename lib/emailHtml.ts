import "server-only";

// Pamja e emailave: e zezë me silver, me logon e rrumbullakët të Vexor sipër.
// Çdo tekst nga përdoruesi kalon nga ruaj(), që të mos futet HTML i huaj.
export const ruaj = (t: string) =>
  t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

export const adresaBaze = () =>
  (process.env.APP_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000").replace(/\/$/, "");

export function butoni(teksti: string, linku: string, kryesor = true) {
  const stili = kryesor
    ? "background:#e4e4e7;background-image:linear-gradient(135deg,#ffffff 0%,#d4d6da 45%,#a9abb2 100%);color:#0a0a0b;border:1px solid #d4d6da;"
    : "background:transparent;color:#f2f2f2;border:1px solid #4a4a50;";
  return `<a href="${ruaj(linku)}" style="${stili}display:inline-block;padding:13px 22px;margin:6px 6px 4px 0;border-radius:999px;font-weight:600;font-size:14px;text-decoration:none">${ruaj(teksti)}</a>`;
}

export function tabela(rreshtat: [string, string][]) {
  const r = rreshtat.map(([a, b], i) =>
    `<tr><td style="padding:12px 14px;color:#a1a1aa;${i ? "border-top:1px solid #2a2a2f;" : ""}">${ruaj(a)}</td>` +
    `<td style="padding:12px 14px;text-align:right;font-weight:600;color:#f5f5f7;${i ? "border-top:1px solid #2a2a2f;" : ""}">${ruaj(b)}</td></tr>`).join("");
  return `<table role="presentation" style="width:100%;background:#0b0b0d;border:1px solid #2a2a2f;border-radius:14px;border-collapse:separate;border-spacing:0;margin:16px 0">${r}</table>`;
}

// Mbështjellësi i përbashkët. "permbajtja" është HTML i ndërtuar me ruaj(), butoni() dhe tabela().
// Logoja merret nga faqja (APP_URL/logo-rreth.png), prandaj në email duket kur aplikacioni është online.
export function emailVexor(titulli: string, permbajtja: string) {
  const logoja = `${adresaBaze()}/logo-rreth.png`;
  return `<!doctype html><html lang="sq"><head><meta name="color-scheme" content="dark"></head>
<body style="margin:0;background:#050506;font-family:Montserrat,Arial,sans-serif;color:#f5f5f7">
<table role="presentation" style="width:100%;background:#050506;padding:28px 12px"><tr><td align="center">
<table role="presentation" style="width:100%;max-width:540px;background:#111113;border-radius:22px;overflow:hidden;border:1px solid #2a2a2f">
<tr><td style="padding:30px 24px 6px;text-align:center">
<img src="${ruaj(logoja)}" width="120" height="120" alt="Vexor Growth" style="display:inline-block;width:120px;height:120px;border:0">
</td></tr>
<tr><td style="padding:10px 28px 28px;font-size:15px;line-height:1.65;color:#d4d4d8">
<h1 style="margin:0 0 14px;font-size:24px;line-height:1.2;color:#f5f5f7;text-align:center">${ruaj(titulli)}</h1>
${permbajtja}
</td></tr>
<tr><td style="padding:16px 28px;border-top:1px solid #2a2a2f;font-size:12px;color:#a1a1aa;text-align:center">Vexor Growth · Shadow operating për kreatorë<br>vexorgrowth@gmail.com · @vexorgrowth</td></tr>
</table></td></tr></table></body></html>`;
}
