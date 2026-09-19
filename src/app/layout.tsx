import type { Metadata } from "next";
import { Instrument_Serif, Inter } from "next/font/google";
import { DESCRIPTION_DU_SITE, NOM_DU_SITE } from "@/lib/site";
import "./globals.css";

const titre = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--police-titre",
  display: "swap",
});

const texte = Inter({
  subsets: ["latin"],
  variable: "--police-texte",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: NOM_DU_SITE,
    template: `%s , ${NOM_DU_SITE}`,
  },
  description: DESCRIPTION_DU_SITE,
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : undefined,
};

export default function RacineLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${titre.variable} ${texte.variable}`}>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
