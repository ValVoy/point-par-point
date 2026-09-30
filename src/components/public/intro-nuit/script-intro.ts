/**
 * La memoire de visite de l'intro (fiche `fiches/accueil-ouverture.md`).
 *
 * L'intro joue une fois par visite : la cle vit dans le `sessionStorage`, donc
 * un nouvel onglet ou un navigateur rouvert la rejoue, un clic sur « Accueil »
 * non. Aucune donnee ne quitte l'appareil, aucun cookie.
 *
 * La decision se prend avant le premier affichage, par un script en ligne
 * place en tete de l'ouverture : il pose la classe `intro-a-jouer` sur <html>.
 * Sans elle, la page affiche l'etat final rendu par le serveur ; un visiteur
 * qui a deja vu l'intro ne la voit donc jamais, meme un dixieme de seconde.
 */

export const CLE_INTRO = "point-par-point:intro-vue";
export const CLASSE_INTRO = "intro-a-jouer";

/**
 * Le script, en ligne et sans dependance. Il tolere un stockage bloque
 * (navigation privee stricte) : dans ce cas l'intro ne joue pas, plutot que de
 * la rejouer a chaque page. Le mouvement reduit la supprime d'office.
 */
export const SCRIPT_AVANT_AFFICHAGE = `(function(){try{
if(sessionStorage.getItem(${JSON.stringify(CLE_INTRO)})==="1")return;
if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
document.documentElement.classList.add(${JSON.stringify(CLASSE_INTRO)});
}catch(e){}})();`;

/** Marque l'intro comme vue pour cette visite. */
export function marquerIntroVue() {
  try {
    sessionStorage.setItem(CLE_INTRO, "1");
  } catch {
    // Stockage bloque : l'intro ne rejouera pas plus, le script la bloque aussi.
  }
}

export function introAJouer(): boolean {
  return document.documentElement.classList.contains(CLASSE_INTRO);
}

export function terminerIntro() {
  document.documentElement.classList.remove(CLASSE_INTRO);
}
