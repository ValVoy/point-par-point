/**
 * Mesure d'audience Umami (choix du 30-09-2026) : sans cookie, sans adresse
 * reseau gardee, installee sur le VPS. Ne compte que le site public : ni
 * l'administration, ni les pages de travail (planche, prototypes), qui
 * fausseraient les chiffres montres aux partenaires.
 */

/** Premier segment des chemins non comptes. Repris tel quel par le filtre du navigateur. */
export const SEGMENTS_NON_COMPTES = ["administration", "planche", "prototype"];

/** Dit si une adresse (chemin seul ou adresse complete) doit etre comptee. */
export function pageComptee(adresse: string): boolean {
  let chemin = adresse;
  try {
    chemin = new URL(adresse, "http://site.invalid").pathname;
  } catch {
    return false;
  }
  return !SEGMENTS_NON_COMPTES.includes(chemin.split("/")[1] ?? "");
}

/** Configuration lue a l'execution ; sans elle, aucun script n'est charge. */
export function configurationUmami(): { script: string; site: string } | null {
  const url = process.env.UMAMI_URL?.trim();
  const site = process.env.UMAMI_SITE_ID?.trim();
  if (!url || !site) return null;
  try {
    const base = new URL(url);
    if (base.protocol !== "https:" && base.hostname !== "localhost") return null;
    return { script: new URL("/script.js", base).toString(), site };
  } catch {
    return null;
  }
}

/**
 * La meme regle, ecrite pour le navigateur : le filtre qu'Umami appelle avant
 * chaque envoi. Teste en l'executant (audit D7) : c'est lui qui tourne
 * vraiment, pas `pageComptee`.
 */
export const SCRIPT_FILTRE = `window.pppAvantEnvoi=function(t,p){try{var s=new URL(p.url,location.origin).pathname.split("/")[1]||"";if(${JSON.stringify(SEGMENTS_NON_COMPTES)}.indexOf(s)>=0)return false}catch(e){return false}return p};`;

