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
  const titulli = konsulte ? "New consultation" : "New request";
  return dergo({
    to: marresi,
    replyTo: k.emaili,
    subject: `${titulli}: ${k.sherbimi} from ${k.emri} · ${new Date().toLocaleString("en-GB", { timeZone: "Europe/Belgrade" })}`,
    text: [
      `Type: ${konsulte ? "Consultation call (not sure yet what they need)" : "Service request"}`,
      `Service: ${k.sherbimi}`,
      `Name: ${k.emri}`,
      `Email: ${k.emaili}`,
      `Profile: ${k.linku ?? "-"}`,
      `Message: ${k.mesazhi ?? "-"}`,
      "",
      "Open the panel to accept or decline it.",
      "Click Reply to write to the creator directly.",
    ].join("\n"),
    html: emailVexor(`${titulli}: ${k.sherbimi}`,
      `<p style="margin:0"><b>${ruaj(k.emri)}</b> ${konsulte ? "asked for a consultation call." : "sent a request."}</p>` +
      tabela([["Type", konsulte ? "Consultation" : "Service"], ["Email", k.emaili], ["Profile", k.linku ?? "-"], ["Message", k.mesazhi ?? "-"]]) +
      butoni("Open in panel", `${adresaBaze()}/panel`) +
      `<p style="font-size:13px;color:#71717a">Click Reply to write to the creator directly.</p>`),
  });
}

// ---------- Emailat te kreatori ----------

const DITET = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MUAJT = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// "2026-11-13" -> "Friday, 13 November 2026"
export function dataShqip(data: string) {
  const [v, m, d] = data.split("-").map(Number);
  const dita = DITET[new Date(Date.UTC(v, m - 1, d)).getUTCDay()];
  return `${dita}, ${d} ${MUAJT[m - 1]} ${v}`;
}

// 1) Sapo kreatori dërgon kërkesën (statusi: Në pritje).
export async function njoftoKreatorinDerguar(k: { emri: string; emaili: string; sherbimi: string; linku: string; lloji: Lloji }) {
  const konsulte = k.lloji === "konsulte";
  const cka = konsulte ? `a consultation call (${k.sherbimi})` : `"${k.sherbimi}"`;
  return dergo({
    to: k.emaili,
    replyTo: emailiIAdminit(),
    subject: konsulte ? "We received your consultation request" : `We received your request: ${k.sherbimi}`,
    text: [
      `Hi ${k.emri},`,
      "",
      `Your request for ${cka} has been saved. Status: Pending.`,
      konsulte
        ? "We will write to you within 24 hours to book a short Zoom call and help you choose the right product."
        : "We will contact you within 24 hours.",
      "",
      "Track your request here (this link is personal):",
      k.linku,
      "",
      "If this email landed in Spam, click \"Not spam\" so you don't miss your meeting invite.",
      "",
      "Vexor Growth",
    ].join("\n"),
    html: emailVexor(konsulte ? "We received your consultation request" : "We received your request",
      `<p style="margin:0">Hi ${ruaj(k.emri)},</p>` +
      `<p>Your request for <b>${ruaj(konsulte ? "a consultation call" : k.sherbimi)}</b> has been saved.</p>` +
      tabela([["Status", "Pending"], ["Type", konsulte ? "Consultation" : "Service"], ["Service", k.sherbimi]]) +
      `<p>${konsulte
        ? "We will write to you within 24 hours to book a short Zoom call."
        : "We will contact you within 24 hours."}</p>` +
      butoni("Track your request", k.linku) +
      `<p style="font-size:13px;color:#71717a">This link is personal. If this email landed in Spam, click "Not spam" so you don't miss your meeting invite.</p>`),
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
    "PRODID:-//Vexor Growth//Meetings//EN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:vexor-kerkesa-${t.id}@vexorgrowth`,
    `DTSTAMP:${tani}`,
    `DTSTART:${lokale(fillimi)}`,
    `DTEND:${lokale(fundi)}`,
    `SUMMARY:${icsTekst(`Meeting with Vexor Growth: ${t.sherbim}`)}`,
    `DESCRIPTION:${icsTekst(`Zoom link: ${t.zoom}`)}`,
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
  const cka = konsulte ? "a consultation call" : `"${t.sherbim}"`;
  return dergo({
    to: t.emaili,
    replyTo: emailiIAdminit(),
    subject: `${konsulte ? "Consultation booked" : "Meeting booked"}: ${t.sherbim} · ${dataShqip(t.data)}, ${t.ora}`,
    text: [
      `Hi ${t.emri},`,
      "",
      `Your request for ${cka} has been accepted.`,
      "",
      `Date: ${dataShqip(t.data)}`,
      `Time: ${t.ora} (45 min)`,
      `Zoom link: ${t.zoom}`,
      "",
      "Open the attached meeting.ics file to add the meeting to your calendar.",
      ...(t.linku ? ["", "Your request:", t.linku] : []),
      "",
      "Vexor Growth",
    ].join("\n"),
    html: emailVexor(konsulte ? "Consultation booked" : "Request accepted",
      `<p style="margin:0">Hi ${ruaj(t.emri)},</p>` +
      `<p>Your request for <b>${ruaj(konsulte ? "a consultation call" : t.sherbim)}</b> has been accepted. Here is our meeting:</p>` +
      tabela([["Date", dataShqip(t.data)], ["Time", `${t.ora} (45 min)`], ["Where", "Zoom"]]) +
      butoni("Join Zoom", t.zoom) +
      (t.linku ? butoni("Add to calendar", `${t.linku}/kalendari`, false) + butoni("Track your request", t.linku, false) : "") +
      `<p style="font-size:13px;color:#71717a">You can also add the meeting to your calendar with the attached meeting.ics file.</p>`),
    attachments: [{
      filename: "meeting.ics",
      content: Buffer.from(krijoIcs(t), "utf-8"),
      contentType: "text/calendar; charset=utf-8; method=PUBLISH",
    }],
  });
}

// 3) Kur operatori e refuzon kërkesën.
export async function njoftoKreatorinRefuzuar(k: { emri: string; emaili: string; sherbim: string; lloji: Lloji; linku?: string }) {
  const konsulte = k.lloji === "konsulte";
  const cka = konsulte ? "a consultation call" : `"${k.sherbim}"`;
  const sherbimet = `${adresaBaze()}/sherbimet`;
  return dergo({
    to: k.emaili,
    replyTo: emailiIAdminit(),
    subject: `About your request: ${k.sherbim}`,
    text: [
      `Hi ${k.emri},`,
      "",
      `Thank you for reaching out. Unfortunately, we can't accept your request for ${cka} at the moment.`,
      "You are welcome to send a new request later, or write to us directly by replying to this email.",
      "",
      `Our services: ${sherbimet}`,
      "",
      "Vexor Growth",
    ].join("\n"),
    html: emailVexor("About your request",
      `<p style="margin:0">Hi ${ruaj(k.emri)},</p>` +
      `<p>Thank you for reaching out. Unfortunately, we can't accept your request for <b>${ruaj(konsulte ? "a consultation call" : k.sherbim)}</b> at the moment.</p>` +
      tabela([["Status", "Declined"], ["Service", k.sherbim]]) +
      `<p>You are welcome to send a new request later, or write to us directly by replying to this email.</p>` +
      butoni("View services", sherbimet) +
      (k.linku ? butoni("Track your request", k.linku, false) : "")),
  });
}

// 4) "E humbe emailin?": i dërgon kreatorit linqet e kërkesave të tij.
export async function dergoLinqetEKerkesave(emaili: string, lista: { sherbim: string; linku: string; statusi: string }[]) {
  const statusi: Record<string, string> = { ne_pritje: "Pending", pranuar: "Accepted", refuzuar: "Declined" };
  return dergo({
    to: emaili,
    replyTo: emailiIAdminit(),
    subject: `Your requests at Vexor Growth (${lista.length})`,
    text: [
      "Hi,",
      "",
      "Here are the personal links to your requests:",
      "",
      ...lista.map((k) => `• ${k.sherbim} (${statusi[k.statusi] ?? k.statusi}): ${k.linku}`),
      "",
      "If you did not ask for this email, you can ignore it.",
      "",
      "Vexor Growth",
    ].join("\n"),
    html: emailVexor("Your requests",
      `<p style="margin:0">Here are the personal links to your requests:</p>` +
      lista.map((k) => `<p style="margin:14px 0 4px"><b>${ruaj(k.sherbim)}</b> · ${ruaj(statusi[k.statusi] ?? k.statusi)}</p>` +
        butoni("Open request", k.linku, false)).join("") +
      `<p style="font-size:13px;color:#71717a">If you did not ask for this email, you can ignore it.</p>`),
  });
}