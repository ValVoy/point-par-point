import type { Metadata } from "next";
import Link from "next/link";
import { ActionsMatch } from "@/components/public/actions-match";
import { PiedDePage } from "@/components/public/accueil/pied-de-page";
import { Revelations } from "@/components/public/accueil/revelations";
import { CopierAdresse } from "@/components/public/copier-adresse";
import { EnTete } from "@/components/public/entete";
import { TableauProchainMatch } from "@/components/public/tableau-prochain-match";
import { TexteLeger } from "@/components/texte-leger";
import { dateEtHeure } from "@/lib/dates";
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

function itineraire(salle: { nom: string; adresse: string | null; latitude: number | null; longitude: number | null }) {
  const destination =
    salle.latitude !== null && salle.longitude !== null
      ? `${salle.latitude},${salle.longitude}`
      : [salle.nom, salle.adresse].filter(Boolean).join(", ");
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
}

export default async function PageOuNousVoir() {
  const [{ maintenant, salle, aVenir }, venir] = await Promise.all([ouNousVoir(), lireReglage(CLES_REGLAGE.venirALaSalle)]);
  const [prochain, ...suivants] = aVenir;

  return (
    <>
      <EnTete actif="/ou-nous-voir" />
      <main id="contenu" className="colonne-large space-y-20 pt-16 pb-24 sm:pt-24">
        <section aria-labelledby="titre-salle">
          <p className="text-xs font-semibold tracking-[0.2em] text-[var(--color-turquoise)] uppercase">Où nous voir</p>
          {salle ? (
            <>
              <h1 id="titre-salle" className="titre-affiche mt-3 hyphens-auto text-5xl text-balance break-words sm:text-8xl">
                {salle.nom}
              </h1>
              {salle.adresse ? <p className="mt-4 text-xl text-[var(--color-craie)]">{salle.adresse}</p> : null}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href={itineraire(salle)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center justify-center bg-[var(--color-jaune)] px-6 font-semibold text-[var(--color-nuit)] transition-colors duration-[80ms] hover:bg-[var(--color-craie)]"
                >
                  Itinéraire<span className="sr-only"> (ouvre Google Maps)</span>
                </a>
                <CopierAdresse adresse={[salle.nom, salle.adresse].filter(Boolean).join(", ")} />
              </div>
            </>
          ) : (
            <>
              <h1 id="titre-salle" className="titre-affiche mt-3 text-6xl sm:text-8xl">
                La salle
              </h1>
              <p className="mt-5 text-lg text-[var(--color-craie-douce)]">
                La salle sera annoncée avec le calendrier.{" "}
                <Link href="/matchs" className="font-semibold text-[var(--color-craie)] underline underline-offset-4">
                  Voir les matchs
                </Link>
              </p>
            </>
          )}
        </section>

        {prochain ? (
          <section aria-labelledby="titre-prochain" className="max-w-3xl">
            <h2 id="titre-prochain" className="text-xs font-semibold tracking-[0.2em] text-[var(--color-craie-douce)] uppercase">
              Prochain match à domicile
            </h2>
            <Revelations>
              <div className="mt-4" data-allume>
                <TableauProchainMatch
                  match={{ adversaire: prochain.adversaire, domicile: true, joueLe: prochain.joueLe, salle: prochain.salleNom }}
                  maintenant={maintenant}
                />
              </div>
            </Revelations>
            <ActionsMatch match={prochain} />
          </section>
        ) : salle ? (
          <p className="text-lg text-[var(--color-craie-douce)]">
            Prochain match à domicile annoncé bientôt.{" "}
            <Link href="/matchs" className="font-semibold text-[var(--color-craie)] underline underline-offset-4">
              Le calendrier
            </Link>
          </p>
        ) : null}

        {suivants.length > 0 ? (
          <section aria-labelledby="titre-suivants">
            <h2 id="titre-suivants" className="border-b-2 border-[var(--color-craie)] pb-2 text-xs font-semibold tracking-[0.2em] uppercase">
              Ensuite à domicile
            </h2>
            <ul>
              {suivants.map((m) => (
                <li key={m.id}>
                  <Link
                    href={`/matchs/${m.slug}`}
                    className="group flex min-h-16 flex-wrap items-center justify-between gap-x-6 gap-y-1 border-b border-[var(--color-nuit-trait)] py-4"
                  >
                    <span className="titre-affiche text-2xl group-hover:text-[var(--color-jaune)] group-focus-visible:text-[var(--color-jaune)]">
                      Contre {m.adversaire}
                    </span>
                    <span className="inline-block text-[var(--color-craie-douce)] first-letter:uppercase">{dateEtHeure(m.joueLe)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {venir ? (
          <section aria-labelledby="titre-venir">
            <h2 id="titre-venir" className="titre-affiche text-4xl sm:text-5xl">
              Venir à la salle
            </h2>
            <TexteLeger texte={venir} className="texte-article mt-6" />
          </section>
        ) : null}
      </main>
      <PiedDePage />
    </>
  );
}
