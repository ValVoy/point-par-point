import Script from "next/script";
import { connection } from "next/server";
import { configurationUmami, SCRIPT_FILTRE } from "@/lib/mesure-audience";

/**
 * Le script Umami, lu a l'execution (variables UMAMI_URL et UMAMI_SITE_ID,
 * posees dans Coolify sans reconstruire le site). Le filtre avant envoi
 * applique la meme regle que `pageComptee` (src/lib/mesure-audience.ts,
 * testee), sur la meme liste de segments.
 */

export async function MesureAudience() {
  await connection();
  const umami = configurationUmami();
  if (!umami) return null;
  return (
    <>
      {/* Ecrit en ligne, le filtre s'execute des son insertion, avant que le script
          externe d'Umami ne soit seulement telecharge. */}
      <Script id="ppp-filtre-audience" strategy="afterInteractive">
        {SCRIPT_FILTRE}
      </Script>
      <Script
        src={umami.script}
        strategy="afterInteractive"
        data-website-id={umami.site}
        data-before-send="pppAvantEnvoi"
        data-do-not-track="true"
        data-exclude-search="true"
        data-exclude-hash="true"
      />
    </>
  );
}
