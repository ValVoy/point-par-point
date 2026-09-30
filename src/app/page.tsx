import { BlocActualites } from "@/components/public/accueil/bloc-actualites";
import { BlocSerie } from "@/components/public/accueil/bloc-serie";
import { BlocTableaux } from "@/components/public/accueil/bloc-tableaux";
import { PiedDePage } from "@/components/public/accueil/pied-de-page";
import { Revelations } from "@/components/public/accueil/revelations";
import { Ouverture } from "@/components/public/intro-nuit/ouverture";
import { donneesAccueil } from "@/lib/accueil";
import { EQUIPE } from "@/lib/site";

/**
 * L'accueil (fiches accueil-ouverture.md et accueil.md) : l'ouverture, puis
 * deux rendez-vous et une memoire. La serie, qu'on regarde ; les matchs, ou
 * l'on vient ; les scores, qui disent ou en est l'equipe. Chaque bloc
 * disparait s'il n'a rien de publie ou de a jour a montrer.
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
        <Revelations>
          {donnees.episode ? <BlocSerie episode={donnees.episode} /> : null}
          <BlocTableaux
            prochain={donnees.prochain}
            dernier={donnees.dernier}
            precedents={donnees.precedents}
            maintenant={donnees.maintenant}
            rang={donnees.rang}
          />
          <BlocActualites actualites={donnees.actualites} maintenant={donnees.maintenant} />
        </Revelations>
      </main>
      <PiedDePage />
    </>
  );
}
