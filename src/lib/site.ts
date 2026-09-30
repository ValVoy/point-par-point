/**
 * Le nom du site est celui de la serie, « Point Par Point », donne par
 * l'utilisateur le 30-09-2026 ; il remplace « Projet Volley », nom de travail
 * du 19-09-2026. Il est centralise ici, et les traces du titre de l'intro se
 * regenerent avec scripts/titre-en-traces.py.
 *
 * Regle de redaction : les commentaires du code se passent d'accents, jamais
 * les chaines affichees. Tout ce qui est lu par un visiteur est du francais
 * correct, accents compris.
 */
export const NOM_DU_SITE = "Point Par Point";

/** L'equipe dont parle le site, telle qu'elle s'affiche sur les tableaux. */
export const EQUIPE = "VF Francheville";

/**
 * La chaine YouTube de la serie, pour le bouton « S'abonner ». Si elle
 * redevient null, le bouton disparait et « Voir sur YouTube » prend le relais.
 */
export const CHAINE_YOUTUBE: string | null = "https://www.youtube.com/@oger_tom";

export const DESCRIPTION_DU_SITE =
  "L'effectif, les matchs et la série. Les informations qui se consultent " +
  "et qui durent, à côté de ce que racontent les réseaux.";
