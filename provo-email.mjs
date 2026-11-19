import nodemailer from "nodemailer";

const user = process.env.GMAIL_USER;
const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, "");
const marresi = "velimeshabani@gmail.com"; // emaili i kreatorit për provë

const ics = [
  "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Vexor Growth//Takimet//SQ", "METHOD:PUBLISH",
  "BEGIN:VEVENT", "UID:vexor-prove@vexorgrowth", "DTSTAMP:20261119T000000Z",
  "DTSTART:20261120T140000", "DTEND:20261120T144500",
  "SUMMARY:Takim provë me Vexor Growth", "END:VEVENT", "END:VCALENDAR",
].join("\r\n");

try {
  const t = nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
  const info = await t.sendMail({
    from: `Vexor Growth <${user}>`,
    to: marresi,
    subject: "Provë: Kërkesa u pranua",
    text: "Kjo është provë me skedar kalendari.",
    attachments: [{ filename: "takimi.ics", content: Buffer.from(ics, "utf-8"),
      contentType: "text/calendar; charset=utf-8; method=PUBLISH" }],
  });
  console.log("✅ U dërgua te:", info.accepted, "| refuzuar:", info.rejected);
} catch (e) {
  console.log("❌ Gabim:", e.message);
}