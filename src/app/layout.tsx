import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import { DESCRIPTION_DU_SITE, NOM_DU_SITE } from "@/lib/site";
import "./globals.css";

/*
 * Une seule famille pour tout le site, decide sur la planche de style le
 * 29-09-2026 : Archivo, dont l'axe de largeur sert a la fois le texte courant
 * (largeur normale) et les titres d'affiche (resserres a 62 %). Un seul
 * fichier de police a charger, et une largeur qui s'anime.
 */
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--police-archivo",
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
    <html lang="fr" className={archivo.variable}>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
