import "server-only";

// Pamja e emailave: banner-i i zi me logon e Vexor sipër, karta e pastër poshtë.
// Çdo tekst nga përdoruesi kalon nga ruaj(), që të mos futet HTML i huaj.
export const ruaj = (t: string) =>
  t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

export const adresaBaze = () =>
  (process.env.APP_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000").replace(/\/$/, "");

export function butoni(teksti: string, linku: string, kryesor = true) {
  const stili = kryesor
    ? "background:#0a0a0a;color:#ffffff;border:1px solid #0a0a0a;"
    : "background:#ffffff;color:#18181b;border:1px solid #c4c4c8;";
  return `<a href="${ruaj(linku)}" style="${stili}display:inline-block;padding:13px 22px;margin:6px 6px 4px 0;border-radius:999px;font-weight:600;font-size:14px;text-decoration:none">${ruaj(teksti)}</a>`;
}

export function tabela(rreshtat: [string, string][]) {
  const r = rreshtat.map(([a, b], i) =>
    `<tr><td style="padding:12px 14px;color:#52525b;${i ? "border-top:1px solid #e4e4e7;" : ""}">${ruaj(a)}</td>` +
    `<td style="padding:12px 14px;text-align:right;font-weight:600;color:#18181b;${i ? "border-top:1px solid #e4e4e7;" : ""}">${ruaj(b)}</td></tr>`).join("");
  return `<table role="presentation" style="width:100%;background:#fafafa;border:1px solid #e4e4e7;border-radius:14px;border-collapse:separate;border-spacing:0;margin:16px 0">${r}</table>`;
}

// Mbështjellësi i përbashkët. "permbajtja" është HTML i ndërtuar me ruaj(), butoni() dhe tabela().
// Koka është foto (banner-i i zi me logon), prandaj duket njësoj në çdo Gmail.
// Pjesa tjetër është e çelët: Gmail në iPhone me dark mode e kthen vetë në të errët,
// ndërsa logoja (foto) nuk ndryshon. Fotoja merret nga APP_URL, pra duket kur aplikacioni është online.
export function emailVexor(titulli: string, permbajtja: string) {
  const koka = `${adresaBaze()}/email-koka.jpg`;
  return `<!doctype html><html lang="sq"><head><meta charset="utf-8"><meta name="color-scheme" content="light dark"><meta name="supported-color-schemes" content="light dark"></head>
<body style="margin:0;background:#f4f4f5;font-family:Montserrat,Arial,sans-serif;color:#18181b">
<table role="presentation" style="width:100%;background:#f4f4f5;padding:24px 12px"><tr><td align="center">
<table role="presentation" style="width:100%;max-width:540px;background:#ffffff;border-radius:20px;overflow:hidden;border:1px solid #e4e4e7">
<tr><td style="padding:0;background:#050506;line-height:0">
<img src="${ruaj(koka)}" width="540" alt="Vexor Growth" style="display:block;width:100%;max-width:540px;height:auto;border:0">
</td></tr>
<tr><td style="padding:28px 28px 26px;font-size:15px;line-height:1.65;color:#3f3f46">
<h1 style="margin:0 0 14px;font-size:22px;line-height:1.25;color:#0a0a0a">${ruaj(titulli)}</h1>
${permbajtja}
</td></tr>
<tr><td style="padding:16px 28px;border-top:1px solid #e4e4e7;font-size:12px;color:#71717a">Vexor Growth · Shadow operating për kreatorë<br>vexorgrowth@gmail.com · @vexorgrowth</td></tr>
</table></td></tr></table></body></html>`;
}
