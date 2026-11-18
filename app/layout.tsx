import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Pwa from "../components/Pwa";
import Navigimi from "../components/Navigimi";

// Shkronja e hollë dhe e hapur, si te logoja.
const vexorFont = Montserrat({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-vexor",
});

export const metadata: Metadata = {
  title: "Vexor Growth",
  description: "Shadow operating për kreatorë.",
};

export const viewport: Viewport = {
  themeColor: "#050506",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sq" className={vexorFont.variable}>
      <body>
        <Pwa />
        {children}
        <Navigimi />
      </body>
    </html>
  );
}