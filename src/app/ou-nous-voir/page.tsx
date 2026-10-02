import type { Metadata } from "next";
import Link from "next/link";
import { ActionsMatch } from "@/components/public/actions-match";
import { PiedDePage } from "@/components/public/accueil/pied-de-page";
import { Revelations } from "@/components/public/accueil/revelations";
import { CopierAdresse } from "@/components/public/copier-adresse";
import { EnTete } from "@/components/public/entete";
import { TitreChapitre } from "@/components/public/titre-chapitre";
import { Volets } from "@/components/public/volets";
import { TableauProchainMatch } from "@/components/public/tableau-prochain-match";
import { TexteLeger } from "@/components/texte-leger";
import { quandDuMatch } from "@/lib/horaire";
import { CLES_REGLAGE, lireReglage } from "@/lib/reglages";
import { EQUIPE } from "@/lib/site";
import { ouNousVoir } from "@/lib/vitrine";

/**
 * Ou nous voir (fiche fiches/vitrine.md) : la salle et le moyen d'y aller
 * dans le premier ecran, puis le prochain match a domicile en tableau, les
 * suivants, et le texte « Venir a la salle » saisi dans l'administration.
 * Aucune carte integree : le lien d'itineraire suffit, sans pistage.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Où nous voir",
  description: `La salle de l'équipe D2 masculine du ${EQUIPE}, comment y venir, et les prochains matchs à domicile.`,
};

/** Null sans adresse ni coordonnees : jamais d'itineraire vers un nom seul (audit D25). */
function itineraire(salle: { nom: string; adresse: string | null; latitude: number | null; longitude: number | null }) {
  const destination =
    salle.latitude !== null && salle.longitude !== null
      ? `${salle.latitude},${salle.longitude}`
      : salle.adresse
        ? `${salle.nom}, ${salle.adresse}`
        : null;
  return destination ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}` : null;
}

export default async function PageOuNousVoir() {
  const [{ maintenant, salle, aVenir }, venir] = await Promise.all([ouNousVoir(), lireReglage(CLES_REGLAGE.venirALaSalle)]);
  const [prochain, ...suivants] = aVenir;

  const actions = salle && itineraire(salle) ? (
    <div className="mt-8 flex flex-wrap items-center gap-3">
      <a
        href={itineraire(salle) ?? undefined}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-12 items-center justify-center bg-[var(--color-jaune)] px-6 font-semibold text-[var(--color-nuit)] transition-colors duration-[80ms] hover:bg-[var(--color-craie)]"
      >
        Itinéraire<span className="sr-only"> (ouvre Google Maps)</span>
      </a>
      {salle.adresse ? <CopierAdresse adresse={`${salle.nom}, ${salle.adresse}`} /> : null}
    </div>
  ) : null;

  return (
    <>
      <EnTete actif="/ou-nous-voir" />
      <main id="contenu" className="min-h-[70svh] pb-[var(--air-chapitre)]">
        <Volets>
          <section aria-labelledby="titre-salle" className="colonne-large pt-16 sm:pt-24">
            <p className="etiquette text-[var(--color-turquoise)]">Où nous voir</p>
            <h1
              id="titre-salle"
              className={`titre-affiche mt-4 text-balance ${(salle?.nom.length ?? 0) > 14 ? "titre-chapitre" : "titre-page"}`}
            >
              {salle ? salle.nom : "La salle"}
            </h1>
          </section>

          {/* Deux colonnes pleines (fiche refonte, section 8) : la salle et son acces a gauche,
              le prochain match a domicile a droite. */}
          <div className={`colonne-large mt-[var(--titre-contenu)] grid items-start gap-[var(--air-suite)] ${venir ? "lg:grid-cols-2 lg:gap-16" : ""}`}>
            <div className="min-w-0">
              {salle ? (
                <>
                  <p className={`chapeau ${salle.adresse ? "text-[var(--color-craie)]" : "text-[var(--color-craie-tenue)]"}`}>
                    {salle.adresse ?? "Adresse à confirmer"}
                  </p>
                  {actions}
                </>
              ) : (
                <p className="chapeau text-[var(--color-craie-douce)]">
                  La salle sera annoncée avec le calendrier.{" "}
                  <Link href="/matchs" className="font-semibold text-[var(--color-craie)] underline underline-offset-4">
                    Voir les matchs
                  </Link>
                </p>
              )}
              {venir ? (
                <section aria-labelledby="titre-venir" className="suite">
                  <h2 id="titre-venir" className="titre-affiche titre-carte">
                    Venir à la salle
                  </h2>
                  <TexteLeger texte={venir} className="texte-article mt-[var(--titre-contenu)]" />
                </section>
              ) : null}
            </div>

            {prochain ? (
              <section aria-labelledby="titre-prochain" className={`min-w-0 ${venir ? "" : "max-w-3xl"}`}>
                <h2 id="titre-prochain" className="sr-only">
                  Prochain match à domicile
                </h2>
                <Revelations>
                  <div data-allume>
                    <TableauProchainMatch
                      match={{ adversaire: prochain.adversaire, domicile: true, joueLe: prochain.joueLe, heureConnue: prochain.heureConnue, salle: prochain.salleNom }}
                      maintenant={maintenant}
                      etiquette="Prochain match à domicile"
                    />
                  </div>
                </Revelations>
                {/* L'itineraire est deja offert pour la salle, juste au-dessus ou a cote. */}
                <ActionsMatch match={prochain} sansItineraire={Boolean(salle && prochain.salleNom === salle.nom)} />
              </section>
            ) : salle ? (
              <p className="chapeau text-[var(--color-craie-douce)]">
                Prochain match à domicile annoncé bientôt.{" "}
                <Link href="/matchs" className="font-semibold text-[var(--color-craie)] underline underline-offset-4">
                  Le calendrier
                </Link>
              </p>
            ) : null}
          </div>

          {suivants.length > 0 ? (
            <section aria-labelledby="titre-suivants" className="colonne-large chapitre">
              <TitreChapitre id="titre-suivants">Ensuite à domicile</TitreChapitre>
              <ul className="mt-[var(--titre-contenu)] border-t-2 border-[var(--color-craie)]">
                {suivants.map((m) => (
                  <li key={m.id}>
                    <Link
                      href={`/matchs/${m.slug}`}
                      className="group grid min-h-20 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-6 border-b border-[var(--color-nuit-trait)] py-5"
                    >
                      <span className="titre-affiche titre-carte group-hover:text-[var(--color-jaune)] group-focus-visible:text-[var(--color-jaune)]">
                        Contre {m.adversaire}
                      </span>
                      <span className="text-right text-[var(--color-craie-douce)] first-letter:uppercase">{quandDuMatch(m)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </Volets>
      </main>
      <PiedDePage />
    </>
  );
}
