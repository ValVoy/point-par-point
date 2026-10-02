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
    template: `%s · ${NOM_DU_SITE}`,
  },
  description: DESCRIPTION_DU_SITE,
  // Un lien partage arrive avec le nom du site et la langue (audit du 02-10-2026, D27).
  // Une page qui pose son propre openGraph (un episode) le remplace en entier.
  openGraph: {
    type: "website",
    siteName: NOM_DU_SITE,
    locale: "fr_FR",
    title: NOM_DU_SITE,
    description: DESCRIPTION_DU_SITE,
  },
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : undefined,
};

export default function RacineLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // L'intro de l'accueil pose une classe sur <html> avant l'hydratation (voir
    // components/public/intro-nuit/script-intro.ts) : l'ecart est voulu.
    <html lang="fr" className={archivo.variable} suppressHydrationWarning>
      <body className="min-h-dvh antialiased">
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:bg-[var(--color-jaune)] focus:px-4 focus:py-3 focus:font-semibold focus:text-[var(--color-nuit)]"
        >
          Aller au contenu
        </a>
        {children}
      </body>
    </html>
  );
}
