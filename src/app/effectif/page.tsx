import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { PiedDePage } from "@/components/public/accueil/pied-de-page";
import { CarteJoueur, CarteStaff } from "@/components/public/effectif/cartes";
import { EnTete } from "@/components/public/entete";
import { TitreChapitre } from "@/components/public/titre-chapitre";
import { Volets } from "@/components/public/volets";
import { effectifDeLaSaison } from "@/lib/effectif-public";
import type { Poste } from "@/lib/db/schema";
import { grouperParPoste, LIBELLES_POSTE_PLURIEL } from "@/lib/postes";
import { membres as lireStaff } from "@/lib/projet";
import { EQUIPE } from "@/lib/site";

/**
 * L'effectif de la saison (fiche fiches/effectif.md, refonte en section 7 de
 * fiches/refonte-respiration.md) : l'ouverture, puis une rangee par poste dans
 * l'ordre ou l'on presente une equipe, avec de grandes cartes au numero geant.
 * Des cartes toutes egales, ni vedette, ni classement. Le staff ferme la
 * page : il accompagne l'equipe, il ne la precede pas.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "L'effectif",
  description: `Les joueurs et le staff de l'équipe D2 masculine du ${EQUIPE}, poste par poste.`,
};

/**
 * Une rangee par poste (fiche refonte, section 7) : en grand ecran, le poste a
 * gauche reste en place pendant qu'on defile ses joueurs, comme la marge d'un
 * programme de match ; au telephone, il repasse au-dessus de ses cartes.
 */
function RangeePoste({ poste, nombre, children }: { poste: Poste; nombre: number; children: React.ReactNode }) {
  return (
    <section
      aria-labelledby={`poste-${poste}`}
      className="grid gap-[var(--titre-contenu)] border-t-2 border-[var(--color-craie)] pt-6 lg:grid-cols-[minmax(14rem,1fr)_3fr] lg:gap-12 [&+&]:mt-[var(--air-suite)]"
    >
      <div className="self-start lg:sticky lg:top-8">
        <h2 id={`poste-${poste}`} className="titre-affiche titre-carte">
          {LIBELLES_POSTE_PLURIEL[poste]}
        </h2>
        <p className="mt-3 flex items-baseline gap-2 text-[var(--color-turquoise)]">
          <span className="titre-affiche titre-carte">{String(nombre).padStart(2, "0")}</span>
          <span className="etiquette">joueur{nombre > 1 ? "s" : ""}</span>
        </p>
      </div>
      <ul className="grid grid-cols-2 gap-x-[var(--gouttiere)] gap-y-10 sm:grid-cols-3">{children}</ul>
    </section>
  );
}

export default async function PageEffectif({ searchParams }: { searchParams: Promise<{ saison?: string }> }) {
  const { saison: demandee } = await searchParams;
  const [{ maintenant, saison, saisons, membres }, staff] = await Promise.all([
    effectifDeLaSaison(demandee),
    lireStaff(),
  ]);
  // Une saison inconnue dans l'adresse n'affiche pas la courante en silence (audit D28).
  if (demandee && saison?.libelle !== demandee) notFound();
  const groupes = grouperParPoste(membres);
  const equipe = groupes.flatMap((g) => g.membres);

  return (
    <>
      <EnTete actif="/effectif" />
      <main id="contenu" className="pb-[var(--air-chapitre)]">
        <Volets>
          {/* L'ouverture de la Serie (fiche refonte, section 7) : titre de page et taille du
              vestiaire en chiffre geant. Pas un compteur : ni classement ni statistique. */}
          <section className="colonne-large pt-16 sm:pt-24">
            <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-8">
              <div className="min-w-0">
                <p className="etiquette text-[var(--color-turquoise)]">{EQUIPE}</p>
                <h1 className="titre-affiche titre-page mt-4">L&apos;effectif</h1>
              </div>
              {equipe.length > 0 ? (
                <p className="pb-2 sm:text-right">
                  <span className="titre-affiche chiffre-geant block">{String(equipe.length).padStart(2, "0")}</span>
                  <span className="etiquette mt-2 block text-[var(--color-craie-douce)]">
                    joueur{equipe.length > 1 ? "s" : ""} {saison?.courante ? "cette saison" : `en ${saison?.libelle ?? ""}`}
                  </span>
                </p>
              ) : null}
            </div>
            {equipe.length > 0 ? (
              <p className="chapeau mt-[var(--titre-contenu)] max-w-[34ch] text-[var(--color-craie-douce)]">
                Un seul maillot
                {saison ? (
                  <>
                    {" "}: la D2 masculine en <span className="whitespace-nowrap">{saison.libelle}</span>
                  </>
                ) : null}
                .
              </p>
            ) : null}
            {saisons.length > 1 ? (
              <nav aria-label="Saisons" className="mt-8">
                <ul className="flex flex-wrap gap-x-6 gap-y-2 font-semibold">
                  {saisons.map((s) => (
                    <li key={s.id}>
                      <Link
                        href={`/effectif?saison=${encodeURIComponent(s.libelle)}`}
                        aria-current={s.id === saison?.id ? "page" : undefined}
                        className="inline-flex min-h-12 items-center border-b-2 border-transparent text-[var(--color-craie-douce)] hover:text-[var(--color-craie)] aria-[current=page]:border-[var(--color-jaune)] aria-[current=page]:text-[var(--color-craie)]"
                      >
                        {s.libelle}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : null}
          </section>

          {equipe.length === 0 ? (
            <p className="colonne-large suite chapeau text-[var(--color-craie-douce)]">
              L&apos;effectif de cette saison n&apos;est pas encore publié.
            </p>
          ) : (
            <div className="colonne-large chapitre">
              {groupes.map((groupe) => (
                <RangeePoste key={groupe.poste} poste={groupe.poste} nombre={groupe.membres.length}>
                  {groupe.membres.map((m) => (
                    <CarteJoueur key={m.id} membre={m} maintenant={maintenant} />
                  ))}
                </RangeePoste>
              ))}
            </div>
          )}

          {staff.length > 0 ? (
            <section aria-labelledby="titre-staff" className="colonne-large chapitre">
              <TitreChapitre id="titre-staff">Le staff</TitreChapitre>
              <ul className="mt-[var(--titre-contenu)] grid gap-x-[var(--gouttiere)] gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                {staff.map((s) => (
                  <CarteStaff key={s.id} membre={s} />
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
