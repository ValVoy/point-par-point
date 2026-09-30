import type { Metadata } from "next";
import Link from "next/link";
import { PiedDePage } from "@/components/public/accueil/pied-de-page";
import { CarteJoueur, CarteStaff } from "@/components/public/effectif/cartes";
import { EnTete } from "@/components/public/entete";
import { effectifDeLaSaison } from "@/lib/effectif-public";
import { grouperParPoste, LIBELLES_POSTE_PLURIEL } from "@/lib/postes";
import { membres as lireStaff } from "@/lib/projet";
import { EQUIPE } from "@/lib/site";

/**
 * L'effectif de la saison (fiche fiches/effectif.md) : une accroche
 * collective, puis une section par poste, dans l'ordre ou l'on presente une
 * equipe, avec de grandes cartes au numero geant. Choix identitaire de
 * l'utilisateur (30-09-2026), prefere a une grille continue plus compacte.
 * Des cartes toutes egales, ni vedette, ni classement. Le staff ferme la
 * page : il accompagne l'equipe, il ne la precede pas.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "L'effectif",
  description: `Les joueurs et le staff de l'équipe D2 masculine du ${EQUIPE}, poste par poste.`,
};

export default async function PageEffectif({ searchParams }: { searchParams: Promise<{ saison?: string }> }) {
  const { saison: demandee } = await searchParams;
  const [{ maintenant, saison, saisons, membres }, staff] = await Promise.all([
    effectifDeLaSaison(demandee),
    lireStaff(),
  ]);
  const groupes = grouperParPoste(membres);
  const equipe = groupes.flatMap((g) => g.membres);

  return (
    <>
      <EnTete actif="/effectif" />
      <main id="contenu" className="pb-24">
        <section className="colonne-large pt-16 pb-12 sm:pt-24">
          <p className="text-xs font-semibold tracking-[0.2em] text-[var(--color-turquoise)] uppercase">{EQUIPE}</p>
          <h1 className="titre-affiche mt-3 text-6xl sm:text-8xl">L&apos;effectif</h1>
          {equipe.length > 0 ? (
            <p className="mt-5 max-w-[46ch] text-lg leading-relaxed text-[var(--color-craie-douce)]">
              {equipe.length} joueurs, un seul maillot{saison ? ` : la D2 masculine en ${saison.libelle}` : ""}.
            </p>
          ) : null}
          {saisons.length > 1 ? (
            <nav aria-label="Saisons" className="mt-8">
              <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold">
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
          <p className="colonne-large text-lg text-[var(--color-craie-douce)]">
            L&apos;effectif de cette saison n&apos;est pas encore publié.
          </p>
        ) : (
          groupes.map((groupe) => (
            <section key={groupe.poste} aria-labelledby={`poste-${groupe.poste}`} className="colonne-large mt-14 first-of-type:mt-0">
              <h2
                id={`poste-${groupe.poste}`}
                className="border-b-2 border-[var(--color-craie)] pb-2 text-xs font-semibold tracking-[0.2em] uppercase"
              >
                {LIBELLES_POSTE_PLURIEL[groupe.poste]}
              </h2>
              <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
                {groupe.membres.map((m) => (
                  <CarteJoueur key={m.id} membre={m} maintenant={maintenant} />
                ))}
              </ul>
            </section>
          ))
        )}

        {staff.length > 0 ? (
          <section aria-labelledby="titre-staff" className="colonne-large mt-24">
            <h2 id="titre-staff" className="border-b-2 border-[var(--color-craie)] pb-2 text-xs font-semibold tracking-[0.2em] uppercase">
              Le staff
            </h2>
            <ul className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {staff.map((s) => (
                <CarteStaff key={s.id} membre={s} />
              ))}
            </ul>
          </section>
        ) : null}
      </main>
      <PiedDePage />
    </>
  );
}
