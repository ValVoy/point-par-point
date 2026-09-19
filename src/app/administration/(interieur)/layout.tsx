import { exigerConnexion } from "@/lib/auth/session-courante";
import { BandeauDemo } from "./bandeau-demo";
import { Coquille } from "./coquille";

/**
 * Garde d'acces de l'administration. Elle est posee ici, au niveau du layout,
 * et repetee dans chaque page par `exigerConnexion` ou `exigerDroit` : un
 * layout ne doit jamais etre la seule barriere, puisqu'une action serveur
 * appelee directement ne le traverse pas.
 */
export default async function InterieurLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const utilisateur = await exigerConnexion();

  return (
    <>
      <BandeauDemo />
      <Coquille utilisateur={utilisateur}>{children}</Coquille>
    </>
  );
}
