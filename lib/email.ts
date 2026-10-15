import "server-only";
import { Resend } from "resend";

// Të dërgon njoftim në Gmail kur vjen një kërkesë e re.
// Pa RESEND_API_KEY dhe ADMIN_EMAIL, kërkesa ruhet vetëm në Neon.
export async function njoftoMeEmail(k: {
  sherbimi: string;
  emri: string;
  emaili: string;
  linku: string | null;
  mesazhi: string | null;
}) {
  const celesi = process.env.RESEND_API_KEY;
  const marresi = process.env.ADMIN_EMAIL;
  if (!celesi || !marresi) return;

  const resend = new Resend(celesi);
  const { error } = await resend.emails.send({
    from: "Vexor Growth <onboarding@resend.dev>",
    to: marresi,
    replyTo: k.emaili,
    subject: `Kërkesë e re: ${k.sherbimi} nga ${k.emri}`,
    text: [
      `Shërbimi: ${k.sherbimi}`,
      `Emri: ${k.emri}`,
      `Emaili: ${k.emaili}`,
      `Profili: ${k.linku ?? "-"}`,
      `Mesazhi: ${k.mesazhi ?? "-"}`,
      "",
      "Kliko Reply për t'i shkruar direkt kreatorit.",
    ].join("\n"),
  });
  if (error) console.error("Emaili nuk u dërgua:", error);
}