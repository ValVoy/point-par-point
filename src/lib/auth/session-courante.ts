import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { lireSession, NOM_COOKIE, type UtilisateurConnecte } from "./sessions";
import { peut, type Action } from "./roles";

/**
 * Point d'entree unique pour savoir qui est connecte dans un composant serveur
 * ou une action serveur. Tout passe par ici : aucun autre fichier ne lit le
 * cookie de session directement.
 */
export async function utilisateurCourant(): Promise<UtilisateurConnecte | null> {
  const magasin = await cookies();
  return lireSession(magasin.get(NOM_COOKIE)?.value);
}

/**
 * Garde pour toute page ou action de l'administration. Renvoie vers la
 * connexion si personne n'est identifie.
 *
 * A n'utiliser que dans un contexte ou la redirection a un sens : une action
 * serveur qui repond a un formulaire doit plutot appeler `utilisateurCourant`
 * et rendre une erreur.
 */
export async function exigerConnexion(): Promise<UtilisateurConnecte> {
  const utilisateur = await utilisateurCourant();
  if (!utilisateur) redirect("/administration/connexion");
  return utilisateur;
}

/**
 * Garde par action. L'appelant n'a pas a connaitre les roles, seulement ce
 * qu'il veut faire : c'est ce qui evite les tests de role dissemines dans les
 * pages, qui finissent toujours par diverger.
 */
export async function exigerDroit(action: Action): Promise<UtilisateurConnecte> {
  const utilisateur = await exigerConnexion();
  if (!peut(utilisateur, action)) redirect("/administration?refuse=1");
  return utilisateur;
}
