/**
 * Extraction de l'identifiant d'une video YouTube depuis ce que l'ami colle :
 * le lien de partage, l'adresse de la barre du navigateur, un lien Shorts ou
 * de direct, ou l'identifiant seul. Logique pure, testee a part.
 *
 * Seuls les domaines de YouTube sont acceptes. L'identifiant finit dans un
 * lecteur integre et dans l'adresse d'une miniature : il ne doit jamais
 * pouvoir venir d'ailleurs, ni porter autre chose que ses onze caracteres.
 */

const FORME_ID = /^[A-Za-z0-9_-]{11}$/;

const DOMAINES = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "music.youtube.com",
  "youtube-nocookie.com",
  "www.youtube-nocookie.com",
  "youtu.be",
]);

const CHEMINS_AVEC_ID = ["embed", "shorts", "live", "v"];

export function extraireIdYoutube(saisie: string): string | null {
  const texte = saisie.trim();
  if (FORME_ID.test(texte)) return texte;

  let adresse: URL;
  try {
    // Un lien colle sans protocole (« youtu.be/... ») reste un lien.
    adresse = new URL(/^https?:\/\//i.test(texte) ? texte : `https://${texte}`);
  } catch {
    return null;
  }
  if (!DOMAINES.has(adresse.hostname.toLowerCase())) return null;

  const morceaux = adresse.pathname.split("/").filter(Boolean);
  let candidat: string | null | undefined = null;

  if (adresse.hostname.toLowerCase() === "youtu.be") {
    candidat = morceaux[0];
  } else if (morceaux[0] === "watch") {
    candidat = adresse.searchParams.get("v");
  } else if (morceaux[0] && CHEMINS_AVEC_ID.includes(morceaux[0])) {
    candidat = morceaux[1];
  }

  return candidat && FORME_ID.test(candidat) ? candidat : null;
}

/** Miniature servie par YouTube, en 480 x 360, presente pour toute video. */
export function miniatureYoutube(id: string): string {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

/**
 * Miniature en 1280 x 720, absente pour certaines videos anciennes ou
 * courtes : toujours prevoir le repli sur miniatureYoutube.
 */
export function miniatureYoutubeHD(id: string): string {
  return `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
}

/** Lien public de la video, pour ouvrir YouTube depuis l'administration. */
export function lienYoutube(id: string): string {
  return `https://www.youtube.com/watch?v=${id}`;
}
