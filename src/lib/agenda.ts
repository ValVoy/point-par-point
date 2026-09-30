/**
 * Un match en fichier d'agenda (.ics, RFC 5545), pour le bouton « Ajouter a
 * l'agenda » : le deuxieme but du site est qu'on vienne voir un match. Aucun
 * service tiers, un fichier que tout agenda sait ouvrir. Logique pure, testee
 * a part.
 *
 * Tout texte vient de la base, donc de l'administration : il est echappe,
 * jamais recopie tel quel. Un retour a la ligne non echappe permettrait
 * d'ajouter une propriete au fichier.
 */

const CRLF = "\r\n";

export function echapperTexte(texte: string): string {
  return texte
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r\n|\r|\n/g, "\\n");
}

/** Plie une ligne au-dela de 75 octets, sans couper un caractere en deux. */
export function plierLigne(ligne: string): string {
  const morceaux: string[] = [];
  let courant = "";
  let octets = 0;
  for (const caractere of ligne) {
    const taille = Buffer.byteLength(caractere, "utf8");
    // La premiere ligne a 75 octets ; les suivantes commencent par une espace.
    const limite = morceaux.length === 0 ? 75 : 74;
    if (octets + taille > limite) {
      morceaux.push(courant);
      courant = "";
      octets = 0;
    }
    courant += caractere;
    octets += taille;
  }
  morceaux.push(courant);
  return morceaux.join(`${CRLF} `);
}

function dateUtc(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

export type EvenementAgenda = {
  uid: string;
  debut: Date;
  /** Duree du match en minutes ; deux heures par defaut, echauffement compris. */
  duree?: number;
  titre: string;
  lieu?: string | null;
  description?: string | null;
  url?: string | null;
  horodatage: Date;
};

export function evenementAgenda(e: EvenementAgenda): string {
  const fin = new Date(e.debut.getTime() + (e.duree ?? 120) * 60_000);
  const lignes = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Projet Volley//Agenda//FR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${echapperTexte(e.uid)}`,
    `DTSTAMP:${dateUtc(e.horodatage)}`,
    `DTSTART:${dateUtc(e.debut)}`,
    `DTEND:${dateUtc(fin)}`,
    `SUMMARY:${echapperTexte(e.titre)}`,
    ...(e.lieu ? [`LOCATION:${echapperTexte(e.lieu)}`] : []),
    ...(e.description ? [`DESCRIPTION:${echapperTexte(e.description)}`] : []),
    ...(e.url ? [`URL:${e.url}`] : []),
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lignes.map(plierLigne).join(CRLF) + CRLF;
}

/**
 * Le meme evenement en lien Google Agenda, en secours du fichier .ics : un
 * navigateur integre (Instagram, par exemple) ouvre mal un telechargement.
 */
export function lienGoogleAgenda(e: EvenementAgenda): string {
  const fin = new Date(e.debut.getTime() + (e.duree ?? 120) * 60_000);
  const lien = new URL("https://calendar.google.com/calendar/render");
  lien.searchParams.set("action", "TEMPLATE");
  lien.searchParams.set("text", e.titre);
  lien.searchParams.set("dates", `${dateUtc(e.debut)}/${dateUtc(fin)}`);
  if (e.lieu) lien.searchParams.set("location", e.lieu);
  if (e.description) lien.searchParams.set("details", e.description);
  return lien.toString();
}
