import "server-only";
import nodemailer from "nodemailer";
import { Resend } from "resend";
import { emailVexor, butoni, tabela, ruaj, adresaBaze } from "./emailHtml";
import type { Lloji } from "./kerkesat";

type Emaili = {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
  attachments?: { filename: string; content: Buffer; contentType?: string }[];
};

// Dërgon një email dhe kthen true nëse u dërgua.
// 1) Me Gmail-in tënd, nëse GMAIL_USER dhe GMAIL_APP_PASSWORD janë te .env.local.
// 2) Përndryshe me Resend (falas vetëm te emaili i llogarisë).
async function dergo(email: Emaili): Promise<boolean> {
  const gmail = process.env.GMAIL_USER;
  const fjalekalimi = process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, "");
  try {
    if (gmail && fjalekalimi) {
      const transporti = nodemailer.createTransport({
        service: "gmail",
        auth: { user: gmail, pass: fjalekalimi },
      });
      const info = await transporti.sendMail({ from: `Vexor Growth <${gmail}>`, ...email });
      console.log("✉️ Gmail dërgoi:", email.subject, "→", email.to, "| pranuar nga Google:", info.accepted);
      return true;
    }
    const celesi = process.env.RESEND_API_KEY;
    if (!celesi) return false;
    const { error } = await new Resend(celesi).emails.send({
      from: "Vexor Growth <onboarding@resend.dev>",
      ...email,
    });
    if (error) {
      console.error("Emaili nuk u dërgua:", error);
      return false;
    }
    return true;
  } catch (e) {
    console.error("Emaili nuk u dërgua:", e);
    return false;
  }
}

// Emaili i adminit: ADMIN_EMAIL, ose Gmail-i që dërgon.
const emailiIAdminit = () => process.env.ADMIN_EMAIL ?? process.env.GMAIL_USER;

// Të dërgon njoftim në Gmail kur vjen një kërkesë e re.
// Pa çelësa emaili, kërkesa ruhet vetëm në Neon.
export async function njoftoMeEmail(k: {
  sherbimi: string;
  emri: string;
  emaili: string;
  linku: string | null;
  mesazhi: string | null;
  lloji: Lloji;
}) {
  const marresi = emailiIAdminit();
  if (!marresi) return false;
  const konsulte = k.lloji === "konsulte";
  const titulli = konsulte ? "Konsultë e re" : "Kërkesë e re";
  return dergo({
    to: marresi,
    replyTo: k.emaili,
    subject: `${titulli}: ${k.sherbimi} nga ${k.emri} · ${new Date().toLocaleString("sq-AL", { timeZone: "Europe/Belgrade" })}`,
    text: [
      `Lloji: ${konsulte ? "Bisedë konsultuese (nuk është ende e sigurt çfarë i duhet)" : "Kërkesë për shërbimin"}`,
      `Shërbimi: ${k.sherbimi}`,
      `Emri: ${k.emri}`,
      `Emaili: ${k.emaili}`,
      `Profili: ${k.linku ?? "-"}`,
      `Mesazhi: ${k.mesazhi ?? "-"}`,
      "",
      "Hape te paneli për ta pranuar ose refuzuar.",
      "Kliko Reply për t'i shkruar direkt kreatorit.",
    ].join("\n"),
    html: emailVexor(`${titulli}: ${k.sherbimi}`,
      `<p style="margin:0"><b>${ruaj(k.emri)}</b> ${konsulte ? "kërkoi një bisedë konsultuese." : "dërgoi një kërkesë."}</p>` +
      tabela([["Lloji", konsulte ? "Konsultë" : "Shërbim"], ["Email", k.emaili], ["Profili", k.linku ?? "-"], ["Mesazhi", k.mesazhi ?? "-"]]) +
      butoni("Hape në panel", `${adresaBaze()}/panel`) +
      `<p style="font-size:13px;color:#71717a">Kliko Reply për t'i shkruar direkt kreatorit.</p>`),
  });
}

// ---------- Emailat te kreatori ----------

const DITET = ["e diel", "e hënë", "e martë", "e mërkurë", "e enjte", "e premte", "e shtunë"];

// "2026-11-13" -> "e premte, 13.11.2026"
export function dataShqip(data: string) {
  const [v, m, d] = data.split("-").map(Number);
  const dita = DITET[new Date(Date.UTC(v, m - 1, d)).getUTCDay()];
  return `${dita}, ${String(d).padStart(2, "0")}.${String(m).padStart(2, "0")}.${v}`;
}

// 1) Sapo kreatori dërgon kërkesën (statusi: Në pritje).
export async function njoftoKreatorinDerguar(k: { emri: string; emaili: string; sherbimi: string; linku: string; lloji: Lloji }) {
  const konsulte = k.lloji === "konsulte";
  const cka = konsulte ? `bisedën konsultuese (${k.sherbimi})` : `"${k.sherbimi}"`;
  return dergo({
    to: k.emaili,
    replyTo: emailiIAdminit(),
    subject: konsulte ? "E morëm kërkesën tënde për konsultë" : `E morëm kërkesën tënde: ${k.sherbimi}`,
    text: [
      `Përshëndetje ${k.emri},`,
      "",
      `Kërkesa jote për ${cka} u ruajt. Statusi: Në pritje.`,
      konsulte
        ? "Do të të shkruajmë brenda 24 orësh për të caktuar një bisedë të shkurtër në Zoom, ku të ndihmojmë të zgjedhësh produktin."
        : "Do të të kontaktojmë brenda 24 orësh.",
      "",
      "Ndiq kërkesën tënde këtu (linku është personal):",
      k.linku,
      "",
      "Nëse ky email doli te Spam, kliko \"Not spam\", që të mos e humbasësh ftesën për takim.",
      "",
      "Vexor Growth",
    ].join("\n"),
    html: emailVexor(konsulte ? "E morëm kërkesën për konsultë" : "E morëm kërkesën tënde",
      `<p style="margin:0">Përshëndetje ${ruaj(k.emri)},</p>` +
      `<p>Kërkesa jote për <b>${ruaj(konsulte ? "bisedë konsultuese" : k.sherbimi)}</b> u ruajt.</p>` +
      tabela([["Statusi", "Në pritje"], ["Lloji", konsulte ? "Konsultë" : "Shërbim"], ["Shërbimi", k.sherbimi]]) +
      `<p>${konsulte
        ? "Do të të shkruajmë brenda 24 orësh për të caktuar një bisedë të shkurtër në Zoom."
        : "Do të të kontaktojmë brenda 24 orësh."}</p>` +
      butoni("Ndiq kërkesën", k.linku) +
      `<p style="font-size:13px;color:#71717a">Linku është personal. Nëse ky email doli te Spam, kliko "Not spam", që të mos e humbasësh ftesën për takim.</p>`),
  });
}

// Shkruan tekstin për skedarin .ics (presje, pikëpresje dhe rreshta të rinj).
const icsTekst = (t: string) => t.replace(/[\\;,]/g, "\\$&").replace(/\r?\n/g, "\\n");

// Krijon skedarin takimi.ics që e shton takimin në kalendar me një klikim.
export function krijoIcs(t: { id: number; sherbim: string; data: string; ora: string; zoom: string }, minuta = 45) {
  const [v, m, d] = t.data.split("-").map(Number);
  const [h, min] = t.ora.split(":").map(Number);
  const fillimi = new Date(Date.UTC(v, m - 1, d, h, min));
  const fundi = new Date(fillimi.getTime() + minuta * 60_000);
  // Ora lokale (pa "Z"): kalendari e shfaq në orën e pajisjes.
  const lokale = (x: Date) => x.toISOString().replace(/[-:]/g, "").slice(0, 15);
  const tani = new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Vexor Growth//Takimet//SQ",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:vexor-kerkesa-${t.id}@vexorgrowth`,
    `DTSTAMP:${tani}`,
    `DTSTART:${lokale(fillimi)}`,
    `DTEND:${lokale(fundi)}`,
    `SUMMARY:${icsTekst(`Takim me Vexor Growth: ${t.sherbim}`)}`,
    `DESCRIPTION:${icsTekst(`Linku i Zoom: ${t.zoom}`)}`,
    `LOCATION:${icsTekst(t.zoom)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

// 2) Kur operatori e pranon: data, ora, linku i Zoom dhe takimi.ics.
export async function njoftoKreatorinPranuar(t: {
  id: number; emri: string; emaili: string; sherbim: string; data: string; ora: string; zoom: string;
  linku?: string; lloji?: Lloji;
}) {
  const konsulte = t.lloji === "konsulte";
  const cka = konsulte ? "bisedën konsultuese" : `"${t.sherbim}"`;
  return dergo({
    to: t.emaili,
    replyTo: emailiIAdminit(),
    subject: `${konsulte ? "Konsulta u caktua" : "Takimi u caktua"}: ${t.sherbim} · ${dataShqip(t.data)}, ${t.ora}`,
    text: [
      `Përshëndetje ${t.emri},`,
      "",
      `Kërkesa jote për ${cka} u pranua.`,
      "",
      `Data: ${dataShqip(t.data)}`,
      `Ora: ${t.ora} (45 min)`,
      `Linku i Zoom: ${t.zoom}`,
      "",
      "Hape skedarin takimi.ics për ta shtuar takimin në kalendarin tënd.",
      ...(t.linku ? ["", "Kërkesa jote:", t.linku] : []),
      "",
      "Vexor Growth",
    ].join("\n"),
    html: emailVexor(konsulte ? "Konsulta u caktua" : "Kërkesa u pranua",
      `<p style="margin:0">Përshëndetje ${ruaj(t.emri)},</p>` +
      `<p>Kërkesa jote për <b>${ruaj(konsulte ? "bisedë konsultuese" : t.sherbim)}</b> u pranua. Ja takimi ynë:</p>` +
      tabela([["Data", dataShqip(t.data)], ["Ora", `${t.ora} (45 min)`], ["Ku", "Zoom"]]) +
      butoni("Hyr në Zoom", t.zoom) +
      (t.linku ? butoni("Shto në kalendar", `${t.linku}/kalendari`, false) + butoni("Ndiq kërkesën", t.linku, false) : "") +
      `<p style="font-size:13px;color:#71717a">Takimin mund ta shtosh në kalendar edhe me skedarin takimi.ics bashkëngjitur.</p>`),
    attachments: [{
      filename: "takimi.ics",
      content: Buffer.from(krijoIcs(t), "utf-8"),
      contentType: "text/calendar; charset=utf-8; method=PUBLISH",
    }],
  });
}

// 3) Kur operatori e refuzon kërkesën.
export async function njoftoKreatorinRefuzuar(k: { emri: string; emaili: string; sherbim: string; lloji: Lloji; linku?: string }) {
  const konsulte = k.lloji === "konsulte";
  const cka = konsulte ? "bisedën konsultuese" : `"${k.sherbim}"`;
  const sherbimet = `${adresaBaze()}/sherbimet`;
  return dergo({
    to: k.emaili,
    replyTo: emailiIAdminit(),
    subject: `Përgjigje për kërkesën tënde: ${k.sherbim}`,
    text: [
      `Përshëndetje ${k.emri},`,
      "",
      `Faleminderit që na shkrove. Për momentin nuk mund ta pranojmë kërkesën për ${cka}.`,
      "Mund të dërgosh një kërkesë të re më vonë, ose të na shkruash direkt duke iu përgjigjur këtij emaili.",
      "",
      `Shërbimet tona: ${sherbimet}`,
      "",
      "Vexor Growth",
    ].join("\n"),
    html: emailVexor("Përgjigje për kërkesën tënde",
      `<p style="margin:0">Përshëndetje ${ruaj(k.emri)},</p>` +
      `<p>Faleminderit që na shkrove. Për momentin nuk mund ta pranojmë kërkesën për <b>${ruaj(konsulte ? "bisedë konsultuese" : k.sherbim)}</b>.</p>` +
      tabela([["Statusi", "Refuzuar"], ["Shërbimi", k.sherbim]]) +
      `<p>Mund të dërgosh një kërkesë të re më vonë, ose të na shkruash direkt duke iu përgjigjur këtij emaili.</p>` +
      butoni("Shiko shërbimet", sherbimet) +
      (k.linku ? butoni("Ndiq kërkesën", k.linku, false) : "")),
  });
}

// 4) "E humbe emailin?": i dërgon kreatorit linqet e kërkesave të tij.
export async function dergoLinqetEKerkesave(emaili: string, lista: { sherbim: string; linku: string; statusi: string }[]) {
  const statusi: Record<string, string> = { ne_pritje: "Në pritje", pranuar: "Pranuar", refuzuar: "Refuzuar" };
  return dergo({
    to: emaili,
    replyTo: emailiIAdminit(),
    subject: `Kërkesat e tua te Vexor Growth (${lista.length})`,
    text: [
      "Përshëndetje,",
      "",
      "Këto janë linqet personale të kërkesave të tua:",
      "",
      ...lista.map((k) => `• ${k.sherbim} (${statusi[k.statusi] ?? k.statusi}): ${k.linku}`),
      "",
      "Nëse nuk e kërkove ti këtë email, mund ta injorosh.",
      "",
      "Vexor Growth",
    ].join("\n"),
    html: emailVexor("Kërkesat e tua",
      `<p style="margin:0">Këto janë linqet personale të kërkesave të tua:</p>` +
      lista.map((k) => `<p style="margin:14px 0 4px"><b>${ruaj(k.sherbim)}</b> · ${ruaj(statusi[k.statusi] ?? k.statusi)}</p>` +
        butoni("Hape kërkesën", k.linku, false)).join("") +
      `<p style="font-size:13px;color:#71717a">Nëse nuk e kërkove ti këtë email, mund ta injorosh.</p>`),
  });
}