import type { Metadata } from "next";
import Link from "next/link";
import { PiedDePage } from "@/components/public/accueil/pied-de-page";
import { PortraitJoueur } from "@/components/public/effectif/portrait-joueur";
import { EnTete } from "@/components/public/entete";
import { age } from "@/lib/dates";
import { effectifDeLaSaison, urlPhoto } from "@/lib/effectif-public";
import { grouperParPoste, LIBELLES_POSTE, LIBELLES_POSTE_PLURIEL } from "@/lib/postes";
import { EQUIPE } from "@/lib/site";

/**
 * L'effectif de la saison (fiche fiches/effectif.md) : un groupe par poste,
 * dans l'ordre ou l'on presente une equipe, et des cartes toutes egales. Ni
 * vedette, ni classement, ni compteur : le volley est un sport d'equipe.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "L'effectif",
  description: `Les joueurs de l'équipe D2 masculine du ${EQUIPE}, poste par poste.`,
};

const taille = (cm: number | null) => (cm ? `${Math.floor(cm / 100)},${String(cm % 100).padStart(2, "0")} m` : null);

export default async function PageEffectif({ searchParams }: { searchParams: Promise<{ saison?: string }> }) {
  const { saison: demandee } = await searchParams;
  const { maintenant, saison, saisons, membres } = await effectifDeLaSaison(demandee);
  const groupes = grouperParPoste(membres);

  return (
    <>
      <EnTete actif="/effectif" />
      <main id="contenu" className="pb-24">
        <section className="colonne-large pt-16 pb-12 sm:pt-24">
          <p className="text-xs font-semibold tracking-[0.2em] text-[var(--color-turquoise)] uppercase">{EQUIPE}</p>
          <h1 className="titre-affiche mt-3 text-6xl sm:text-8xl">L&apos;effectif</h1>
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
          ) : saison ? (
            <p className="mt-6 text-sm font-semibold text-[var(--color-craie-douce)]">Saison {saison.libelle}</p>
          ) : null}
        </section>

        {groupes.length === 0 ? (
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
                {groupe.membres.map((m) => {
                  const ans = age(m.neLe, maintenant);
                  const photo = urlPhoto(m.photoCle);
                  const details = [ans !== null ? `${ans} ans` : null, taille(m.tailleCm)].filter(Boolean).join(" · ");
                  return (
                    <li key={m.id}>
                      <Link href={`/effectif/${m.slug}`} className="group block">
                        <PortraitJoueur
                          photo={photo}
                          numero={m.numero}
                          poste={m.poste}
                          sizes="(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 45vw"
                        />
                        <span className="mt-4 flex items-baseline gap-3">
                          {/* Sans photo, le numero est deja le portrait : on ne le repete pas. */}
                          {m.numero !== null && photo ? (
                            <span className="titre-affiche text-2xl text-[var(--color-turquoise)]">{m.numero}</span>
                          ) : null}
                          <span className="titre-affiche text-2xl leading-none text-balance group-hover:text-[var(--color-jaune)] sm:text-3xl">
                            {m.prenom} {m.nom}
                          </span>
                        </span>
                        <span className="mt-2 flex flex-wrap items-center gap-x-3 text-sm text-[var(--color-craie-douce)]">
                          <span className="sr-only">{LIBELLES_POSTE[m.poste]}, </span>
                          {details ? <span>{details}</span> : null}
                          {m.capitaine ? (
                            <span className="border border-[var(--color-craie-tenue)] px-1.5 text-xs font-semibold tracking-[0.15em] uppercase">
                              <span aria-hidden="true">C</span>
                              <span className="sr-only">capitaine</span>
                            </span>
                          ) : null}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))
        )}
      </main>
      <PiedDePage saison={saison?.libelle ?? null} />
    </>
  );
}
