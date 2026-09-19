import bcrypt from "bcryptjs";

/**
 * Le plan de cadrage annoncait argon2id. Ecart assume : les implementations
 * argon2 pour Node demandent une compilation native (node-gyp) ou des binaires
 * precompiles par plateforme, ce qui alourdit l'image Docker et casse au
 * moindre changement d'architecture. bcrypt en JavaScript pur n'a aucune de ces
 * contraintes, tourne deja en production sur ope_cdm, et reste parfaitement
 * adapte ici : le pire degat possible derriere ce mot de passe est un faux
 * resultat de match publie.
 */
const TOURS = 12;

/** Longueur minimale imposee a la creation d'un compte. */
export const LONGUEUR_MINIMALE = 12;

export async function hacher(motDePasse: string): Promise<string> {
  return bcrypt.hash(motDePasse, TOURS);
}

/**
 * bcrypt compare en temps constant, il n'y a donc pas de fuite par le temps de
 * reponse ici. La fuite possible est ailleurs : ne jamais laisser l'appelant
 * distinguer « compte inconnu » de « mot de passe faux ».
 */
export async function verifier(
  motDePasse: string,
  hachage: string,
): Promise<boolean> {
  return bcrypt.compare(motDePasse, hachage);
}

/**
 * Hachage factice, de la meme forme et du meme cout qu'un vrai. Sert a faire
 * travailler bcrypt meme quand l'adresse est inconnue, pour que les deux cas
 * repondent dans le meme temps et qu'on ne puisse pas enumerer les comptes.
 */
export const HACHAGE_FACTICE =
  "$2b$12$14fM18KnC3OXRK15U8NDJ.Buyq5h8dAvj53ZWX92wwoGF685jHujK";

export function motDePasseAcceptable(motDePasse: string): boolean {
  return motDePasse.length >= LONGUEUR_MINIMALE;
}
