import { peut } from "@/lib/auth/roles";
import { exigerConnexion } from "@/lib/auth/session-courante";
import { nombreNonLus } from "@/lib/messages";
import { purgerDonneesEchues } from "@/lib/purges";
import { BandeauDemo } from "./bandeau-demo";
import { Coquille } from "./coquille";

/**
 * Garde d'acces de l'administration. Elle est posee ici, au niveau du layout,
 * et repetee dans chaque page par `exigerConnexion` ou `exigerDroit` : un
 * layout ne doit jamais etre la seule barriere, puisqu'une action serveur
 * appelee directement ne le traverse pas.
 *
 * Aucun e-mail ne previent d'un message de contact (decide au cadrage) : le
 * compteur de non lus dans la navigation en tient lieu. La purge des messages
 * de plus d'un an passe aussi ici, pour que la promesse faite au visiteur ne
 * depende pas d'un nouvel envoi.
 */
export default async function InterieurLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const utilisateur = await exigerConnexion();
  // Purge des donnees echues, qui ne peut pas faire tomber l'administration (audit F6).
  await purgerDonneesEchues();
  let nonLus = 0;
  if (peut(utilisateur, "lireMessages")) {
    nonLus = await nombreNonLus().catch(() => 0);
  }

  return (
    <>
      <BandeauDemo />
      <Coquille utilisateur={utilisateur} nonLus={nonLus}>{children}</Coquille>
    </>
  );
}
