import Script from "next/script";
import { connection } from "next/server";
import { configurationUmami, SEGMENTS_NON_COMPTES } from "@/lib/mesure-audience";

/**
 * Le script Umami, lu a l'execution (variables UMAMI_URL et UMAMI_SITE_ID,
 * posees dans Coolify sans reconstruire le site). Le filtre avant envoi
 * applique la meme regle que `pageComptee` (src/lib/mesure-audience.ts,
 * testee), sur la meme liste de segments.
 */
const FILTRE = `window.pppAvantEnvoi=function(t,p){try{var s=new URL(p.url,location.origin).pathname.split("/")[1]||"";if(${JSON.stringify(SEGMENTS_NON_COMPTES)}.indexOf(s)>=0)return false}catch(e){return false}return p};`;

export async function MesureAudience() {
  await connection();
  const umami = configurationUmami();
  if (!umami) return null;
  return (
    <>
      {/* Regle ecrite pour l'ancien routeur de pages : dans l'App Router, un script
          beforeInteractive rendu par la mise en page racine est le cas prevu. */}
      {/* eslint-disable-next-line @next/next/no-before-interactive-script-outside-document */}
      <Script id="ppp-filtre-audience" strategy="beforeInteractive">
        {FILTRE}
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
