import { preparerImage, ImageRefusee, type GenreImage } from "./images";
import { deposer, effacer, nouvelleCle, StockageIndisponible, type Dossier } from "./stockage";

/**
 * Ce que devient la photo d'un formulaire (champ fichier `<nom>` et case
 * `<nom>_retirer`, posees par le composant ChampImage) :
 *  - « inchangee » : aucun fichier, pas de retrait demande ;
 *  - « nouvelle » : deposee sous une cle neuve, l'ancienne a effacer APRES
 *    l'enregistrement en base (`apresEnregistrement`) ;
 *  - « retiree » : la colonne passe a null, l'ancienne cle est effacee.
 * En cas d'echec d'enregistrement, `annuler` efface la cle neuve deposee.
 */
export type IssueImage =
  | { ok: true; cle: string | null | undefined; apresEnregistrement: () => Promise<void>; annuler: () => Promise<void> }
  | { ok: false; erreur: string };

const rien = async () => undefined;

export async function lireImageDuFormulaire(
  donnees: FormData,
  nom: string,
  { dossier, genre, ancienne }: { dossier: Dossier; genre: GenreImage; ancienne: string | null },
): Promise<IssueImage> {
  const fichier = donnees.get(nom);
  const aUnFichier = fichier instanceof File && fichier.size > 0;

  if (!aUnFichier) {
    if (donnees.get(`${nom}_retirer`) === "1" && ancienne) {
      return { ok: true, cle: null, apresEnregistrement: () => effacerSansBruit(ancienne), annuler: rien };
    }
    return { ok: true, cle: undefined, apresEnregistrement: rien, annuler: rien };
  }

  try {
    const { octets } = await preparerImage(Buffer.from(await fichier.arrayBuffer()), genre);
    const cle = nouvelleCle(dossier);
    await deposer(cle, octets);
    return {
      ok: true,
      cle,
      apresEnregistrement: () => effacerSansBruit(ancienne),
      annuler: () => effacerSansBruit(cle),
    };
  } catch (erreur) {
    if (erreur instanceof ImageRefusee || erreur instanceof StockageIndisponible) return { ok: false, erreur: erreur.message };
    console.error("[photos] envoi impossible", erreur instanceof Error ? erreur.message : erreur);
    return { ok: false, erreur: "La photo n'a pas pu être enregistrée. Réessayez dans un instant." };
  }
}

/** Un objet orphelin coute moins cher qu'un enregistrement bloque : l'effacement ne fait jamais echouer l'action. */
async function effacerSansBruit(cle: string | null) {
  try {
    await effacer(cle);
  } catch (erreur) {
    console.error("[photos] effacement impossible", cle, erreur instanceof Error ? erreur.message : erreur);
  }
}
