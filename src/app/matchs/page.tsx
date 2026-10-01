import type { Metadata } from "next";
import Link from "next/link";
import { ActionsMatch } from "@/components/public/actions-match";
import { PiedDePage } from "@/components/public/accueil/pied-de-page";
import { EnTete } from "@/components/public/entete";
import { LigneCalendrier } from "@/components/public/matchs/ligne-calendrier";
import { BilanSaison } from "@/components/public/matchs/bilan-saison";
import { TableauClassement } from "@/components/public/matchs/tableau-classement";
import { EquipeEnMouvement } from "@/components/public/accueil/mouvements-porte-entree";
import { TableauProchainMatch } from "@/components/public/tableau-prochain-match";
import { TitreChapitre } from "@/components/public/titre-chapitre";
import { Volets } from "@/components/public/volets";
import { bilanDeLaSaison } from "@/lib/bilan";
import { DUREE_EN_COURS, grouperParMois } from "@/lib/calendrier";
import { classementDeLaSaison, classementPublic } from "@/lib/classement-base";
import { calendrierDeLaSaison } from "@/lib/matchs-publics";
import { matchDuTableau } from "@/lib/resultats";
import { EQUIPE } from "@/lib/site";

/**
 * Le calendrier de la saison (fiches matchs.md et refonte-respiration.md) :
 * l'ouverture et le bilan en chiffres geants, le prochain match en bandeau,
 * puis un chapitre par mois, ouvert sur un grand vide, avec un filet
 * « Aujourd'hui » entre ce qui est joue et ce qui vient. A l'entree de chaque
 * mois, les jours roulent comme sur un tableau d'affichage. La saison est dans
 * l'adresse, en parametre : /matchs?saison=2026-2027.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Les matchs",
  description: `Le calendrier et les résultats de l'équipe D2 masculine du ${EQUIPE}.`,
};


/** Le filet entre ce qui est joue et ce qui vient, hors des listes : un vrai separateur. */
function Aujourdhui() {
  return (
    <div role="separator" aria-label="Aujourd'hui" className="flex items-center gap-3 py-6">
      <span aria-hidden="true" className="etiquette text-[var(--color-jaune)]">
        Aujourd&apos;hui
      </span>
      <span aria-hidden="true" className="h-0.5 flex-1 bg-[var(--color-jaune)]" />
    </div>
  );
}

export default async function PageMatchs({ searchParams }: { searchParams: Promise<{ saison?: string }> }) {
  const { saison: demandee } = await searchParams;
  const { maintenant, saison, saisons, matchs, racontes } = await calendrierDeLaSaison(demandee);

  const prochain = saison?.courante ? matchDuTableau(matchs, maintenant) : undefined;
  const bilan = bilanDeLaSaison(matchs);
  // Le filet « Aujourd'hui » se pose avant le premier match qui n'est pas encore derriere nous.
  const premierAVenir = matchs.find((m) => m.joueLe.getTime() >= maintenant.getTime() - DUREE_EN_COURS)?.id;
  // Saison courante : le classement disparait s'il n'est plus tenu (principe 4).
  // Saison passee : c'est le classement final, il ne se perime pas.
  const classement = !saison
    ? null
    : saison.courante
      ? await classementPublic(saison.id, maintenant)
      : await classementDeLaSaison(saison.id);

  return (
    <>
      <EnTete actif="/matchs" />
      <main id="contenu" className="pb-[var(--air-chapitre)]">
        <Volets>
        <section className="colonne-large pt-16 sm:pt-24">
          <p className="etiquette text-[var(--color-turquoise)]">{EQUIPE}</p>
          <h1 className="titre-affiche titre-page mt-4">Les matchs</h1>
          <BilanSaison bilan={bilan} />
          {saisons.length > 1 ? (
            <nav aria-label="Saisons" className="mt-8">
              <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold">
                {saisons.map((s) => (
                  <li key={s.id}>
                    <Link
                      href={`/matchs?saison=${encodeURIComponent(s.libelle)}`}
                      aria-current={s.id === saison?.id ? "page" : undefined}
                      className="inline-flex min-h-12 items-center border-b-2 border-transparent text-[var(--color-craie-douce)] hover:text-[var(--color-craie)] aria-[current=page]:border-[var(--color-jaune)] aria-[current=page]:text-[var(--color-craie)]"
                    >
                      {s.libelle}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : saison ? (
            <p className="mt-6 text-sm font-semibold text-[var(--color-craie-douce)]">Saison {saison.libelle}</p>
          ) : null}
        </section>

        {prochain ? (
          <section aria-label="Prochain match" className="colonne-large suite">
            <div>
              <TableauProchainMatch
                match={{
                  adversaire: prochain.adversaire,
                  domicile: prochain.aDomicile,
                  joueLe: prochain.joueLe,
                  heureConnue: prochain.heureConnue,
                  salle: [prochain.salleNom, prochain.salleAdresse].filter(Boolean).join(", ") || null,
                }}
                maintenant={maintenant}
              />
              <ActionsMatch match={prochain} />
            </div>
          </section>
        ) : null}

        <section aria-label={`Calendrier${saison ? ` de la saison ${saison.libelle}` : ""}`} className="colonne-large">
          {matchs.length === 0 ? (
            <p className="chapeau suite max-w-[46ch] text-[var(--color-craie-douce)]">
              Le calendrier de cette saison n&apos;est pas encore publié.
            </p>
          ) : (
            grouperParMois(matchs).map((groupe) => {
              const coupe = groupe.matchs.findIndex((m) => m.id === premierAVenir && m !== matchs[0]);
              const lignes = (liste: typeof groupe.matchs) => (
                <ul className="space-y-2">
                  {liste.map((m) => (
                    <LigneCalendrier key={m.id} match={m} maintenant={maintenant} raconte={racontes.has(m.id)} />
                  ))}
                </ul>
              );
              return (
                <div key={groupe.cle} className="chapitre">
                  <TitreChapitre id={`mois-${groupe.cle}`}>
                    <span className="first-letter:uppercase">{groupe.libelle}</span>
                  </TitreChapitre>
                  <div className="mt-[var(--titre-contenu)]">
                    <EquipeEnMouvement>
                      {coupe === 0 ? <Aujourdhui /> : null}
                      {coupe > 0 ? (
                        <>
                          {lignes(groupe.matchs.slice(0, coupe))}
                          <Aujourdhui />
                          {lignes(groupe.matchs.slice(coupe))}
                        </>
                      ) : (
                        lignes(groupe.matchs)
                      )}
                    </EquipeEnMouvement>
                  </div>
                </div>
              );
            })
          )}
        </section>

        {classement && classement.lignes.length > 0 ? (
          <TableauClassement
            intitule={classement.intitule}
            misAJourLe={classement.misAJourLe}
            lignes={classement.lignes}
            final={!saison?.courante}
          />
        ) : null}
        </Volets>
      </main>
      <PiedDePage />
    </>
  );
}
