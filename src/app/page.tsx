import { BlocActualites } from "@/components/public/accueil/bloc-actualites";
import { BlocEquipe } from "@/components/public/accueil/bloc-equipe";
import { BlocManifeste } from "@/components/public/accueil/bloc-manifeste";
import { BlocProjet } from "@/components/public/accueil/bloc-projet";
import { BlocSerie, BlocSerieInvitation } from "@/components/public/accueil/bloc-serie";
import { BlocTableaux } from "@/components/public/accueil/bloc-tableaux";
import { PiedDePage } from "@/components/public/accueil/pied-de-page";
import { Revelations } from "@/components/public/accueil/revelations";
import { Ouverture } from "@/components/public/intro-nuit/ouverture";
import { donneesAccueil } from "@/lib/accueil";
import { EQUIPE } from "@/lib/site";

/**
 * L'accueil, porte d'entree du site (fiches accueil-ouverture.md, accueil.md
 * et accueil-porte-entree.md) : l'ouverture, puis des chapitres permanents
 * (qui on est, l'equipe, le projet) entre lesquels s'intercalent les blocs de
 * fraicheur (la serie, les matchs, les actualites). Le manifeste et la serie
 * ne disparaissent jamais ; les autres chapitres attendent d'avoir quelque
 * chose de publie a montrer.
 *
 * Rendue a chaque visite : un score saisi doit se voir tout de suite, et le
 * prochain match depend de l'heure. A cette echelle, une lecture en base par
 * visite ne coute rien.
 */
export const dynamic = "force-dynamic";

export default async function Accueil() {
  const donnees = await donneesAccueil();

  return (
    <>
      <Ouverture sousTitre={`L'équipe D2 masculine du ${EQUIPE}, sur le terrain et dans la série.`} />
      <main id="contenu">
        <BlocManifeste
          titre={donnees.manifeste.titre}
          texte={donnees.manifeste.texte}
          lienHistoire={donnees.etapesTotal > 0}
        />
        <Revelations>
          {donnees.episode ? <BlocSerie episode={donnees.episode} /> : <BlocSerieInvitation />}
          <BlocTableaux
            prochain={donnees.prochain}
            dernier={donnees.dernier}
            precedents={donnees.precedents}
            maintenant={donnees.maintenant}
            rang={donnees.rang}
          />
          <BlocEquipe membres={donnees.equipe.membres} saison={donnees.equipe.saison} />
          <BlocProjet etapes={donnees.etapes} total={donnees.etapesTotal} />
          <BlocActualites actualites={donnees.actualites} maintenant={donnees.maintenant} />
        </Revelations>
      </main>
      <PiedDePage />
    </>
  );
}
