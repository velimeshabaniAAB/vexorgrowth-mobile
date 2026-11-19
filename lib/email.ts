import "server-only";
import nodemailer from "nodemailer";
import { Resend } from "resend";

type Emaili = {
  to: string;
  subject: string;
  text: string;
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
}) {
  const marresi = emailiIAdminit();
  if (!marresi) return false;
  return dergo({
    to: marresi,
    replyTo: k.emaili,
    subject: `Kërkesë e re: ${k.sherbimi} nga ${k.emri} · ${new Date().toLocaleString("sq-AL", { timeZone: "Europe/Belgrade" })}`,
    text: [
      `Shërbimi: ${k.sherbimi}`,
      `Emri: ${k.emri}`,
      `Emaili: ${k.emaili}`,
      `Profili: ${k.linku ?? "-"}`,
      `Mesazhi: ${k.mesazhi ?? "-"}`,
      "",
      "Hape te paneli për ta pranuar ose refuzuar.",
      "Kliko Reply për t'i shkruar direkt kreatorit.",
    ].join("\n"),
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

// 1) Sapo kreatori dërgon kërkesën.
export async function njoftoKreatorinDerguar(k: { emri: string; emaili: string; sherbimi: string }) {
  return dergo({
    to: k.emaili,
    replyTo: emailiIAdminit(),
    subject: `E morëm kërkesën tënde: ${k.sherbimi}`,
    text: [
      `Përshëndetje ${k.emri},`,
      "",
      `Kërkesa jote për "${k.sherbimi}" u ruajt. Statusi: Në pritje.`,
      "Do të të kontaktojmë brenda 24 orësh.",
      "",
      "Vexor Growth",
    ].join("\n"),
  });
}

// Shkruan tekstin për skedarin .ics (presje, pikëpresje dhe rreshta të rinj).
const icsTekst = (t: string) => t.replace(/[\\;,]/g, "\\$&").replace(/\r?\n/g, "\\n");

// Krijon skedarin takimi.ics që e shton takimin në kalendar me një klikim.
function krijoIcs(t: { id: number; sherbim: string; data: string; ora: string; zoom: string }, minuta = 45) {
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
}) {
  return dergo({
    to: t.emaili,
    replyTo: emailiIAdminit(),
    subject: `Takimi u caktua: ${t.sherbim} · ${dataShqip(t.data)}, ${t.ora}`,
    text: [
      `Përshëndetje ${t.emri},`,
      "",
      `Kërkesa jote për "${t.sherbim}" u pranua.`,
      "",
      `Data: ${dataShqip(t.data)}`,
      `Ora: ${t.ora} (45 min)`,
      `Linku i Zoom: ${t.zoom}`,
      "",
      "Hape skedarin takimi.ics për ta shtuar takimin në kalendarin tënd.",
      "",
      "Vexor Growth",
    ].join("\n"),
    attachments: [{
      filename: "takimi.ics",
      content: Buffer.from(krijoIcs(t), "utf-8"),
      contentType: "text/calendar; charset=utf-8; method=PUBLISH",
    }],
  });
}