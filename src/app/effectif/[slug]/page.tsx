import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { PastilleResultat } from "@/components/pastille-resultat";
import { PiedDePage } from "@/components/public/accueil/pied-de-page";
import { PortraitJoueur } from "@/components/public/effectif/portrait-joueur";
import { EnTete } from "@/components/public/entete";
import { statutPublic } from "@/lib/calendrier";
import { age, dateLongue } from "@/lib/dates";
import { effectifDeLaSaison, joueurPublic, urlPhoto } from "@/lib/effectif-public";
import { LIBELLES_POSTE } from "@/lib/postes";
import { EQUIPE } from "@/lib/site";

/**
 * La page d'un joueur (fiche fiches/effectif.md) : son identite sportive,
 * son portrait, ce qu'il dit de lui, son parcours, et les matchs de la saison
 * ou il etait sur le terrain, avec le resultat de l'equipe. Aucun chiffre
 * individuel au premier lot, jamais de comparaison, jamais la date de
 * naissance : l'age seulement.
 */
export const dynamic = "force-dynamic";

type Parametres = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Parametres): Promise<Metadata> {
  const { slug } = await params;
  const donnees = await joueurPublic(slug);
  if (!donnees) return { title: "Joueur introuvable" };
  const { joueur, effectif } = donnees;
  return {
    title: `${joueur.prenom} ${joueur.nom}`,
    description: `${LIBELLES_POSTE[effectif.poste]} de l'équipe D2 masculine du ${EQUIPE}.`,
  };
}

const etiquette = "text-xs font-semibold tracking-[0.2em] text-[var(--color-craie-douce)] uppercase";
const taille = (cm: number | null) => (cm ? `${Math.floor(cm / 100)},${String(cm % 100).padStart(2, "0")} m` : null);

export default async function PageJoueur({ params }: Parametres) {
  const { slug } = await params;
  const donnees = await joueurPublic(slug);
  if (!donnees && slug !== slug.toLowerCase()) permanentRedirect(`/effectif/${slug.toLowerCase()}`);
  if (!donnees) notFound();
  const { maintenant, joueur, effectif, matchs } = donnees;
  const { membres } = await effectifDeLaSaison(effectif.saison.libelle, maintenant);

  const ans = age(joueur.neLe, maintenant);
  const donneesPhysiques = [
    ans !== null ? { nom: "Âge", valeur: `${ans} ans` } : null,
    taille(joueur.tailleCm) ? { nom: "Taille", valeur: taille(joueur.tailleCm)! } : null,
  ].filter((d): d is { nom: string; valeur: string } => d !== null);
  const joues = matchs.filter((m) => statutPublic(m, maintenant) === "jouee");
  const coequipiers = [...membres].sort((a, b) => (a.numero ?? 1000) - (b.numero ?? 1000));

  return (
    <>
      <EnTete actif="/effectif" />
      <main id="contenu" className="colonne-large space-y-16 pt-10 pb-24 sm:pt-16">
        <p>
          <Link href="/effectif" className="text-sm font-semibold text-[var(--color-craie-douce)] hover:text-[var(--color-craie)]">
            ← Tout l&apos;effectif
          </Link>
        </p>

        <div className="grid items-end gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="max-w-sm lg:col-span-4 lg:max-w-none">
            <PortraitJoueur
              photo={urlPhoto(joueur.photoCle)}
              numero={effectif.numero}
              poste={effectif.poste}
              sizes="(min-width: 1024px) 30vw, 24rem"
              prioritaire
            />
          </div>
          <div className="lg:col-span-8">
            <p className="text-xs font-semibold tracking-[0.2em] text-[var(--color-turquoise)] uppercase">
              {LIBELLES_POSTE[effectif.poste]}
              {effectif.capitaine ? " · Capitaine" : ""}
            </p>
            <h1 className="titre-affiche mt-3 text-6xl text-balance sm:text-8xl">
              {effectif.numero !== null ? (
                <span className="mr-4 text-[var(--color-turquoise)]">
                  <span className="sr-only">Numéro </span>
                  {effectif.numero}
                </span>
              ) : null}
              {joueur.prenom} {joueur.nom}
            </h1>
            {donneesPhysiques.length > 0 ? (
              <dl className="mt-8 flex gap-10">
                {donneesPhysiques.map((d) => (
                  <div key={d.nom}>
                    <dt className={etiquette}>{d.nom}</dt>
                    <dd className="titre-affiche mt-1 text-4xl">{d.valeur}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
            {joueur.presentation?.trim() ? (
              <p className="mt-8 max-w-[58ch] text-lg leading-relaxed whitespace-pre-line text-[var(--color-craie-douce)]">
                {joueur.presentation}
              </p>
            ) : null}
          </div>
        </div>

        {joueur.parcours?.trim() ? (
          <section aria-labelledby="titre-parcours" className="max-w-3xl">
            <h2 id="titre-parcours" className={etiquette}>
              Parcours
            </h2>
            <p className="mt-4 text-lg leading-relaxed whitespace-pre-line">{joueur.parcours}</p>
          </section>
        ) : null}

        {joues.length > 0 ? (
          <section aria-labelledby="titre-matchs-joueur">
            <h2 id="titre-matchs-joueur" className="border-b-2 border-[var(--color-craie)] pb-2 text-xs font-semibold tracking-[0.2em] uppercase">
              Sur le terrain en {effectif.saison.libelle} · {joues.length} match{joues.length > 1 ? "s" : ""}
            </h2>
            <ul>
              {joues.map((m) => {
                const victoire = (m.setsNous ?? 0) > (m.setsEux ?? 0);
                return (
                  <li key={m.slug}>
                    <Link
                      href={`/matchs/${m.slug}`}
                      className="group flex min-h-16 flex-wrap items-center justify-between gap-x-6 gap-y-1 border-b border-[var(--color-nuit-trait)] py-4 hover:bg-[var(--color-nuit-surface)] sm:px-3"
                    >
                      <span>
                        <span className="titre-affiche block text-2xl group-hover:text-[var(--color-jaune)]">
                          {m.aDomicile ? "Contre" : "Chez"} {m.adversaire}
                        </span>
                        <span className="text-sm text-[var(--color-craie-douce)] first-letter:uppercase">{dateLongue(m.joueLe)}</span>
                      </span>
                      <span className="flex items-center gap-3">
                        <span className={`titre-affiche text-3xl ${victoire ? "" : "font-normal text-[var(--color-craie-douce)]"}`}>
                          {m.setsNous}-{m.setsEux}
                        </span>
                        <PastilleResultat victoire={victoire} className="text-base" />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ) : null}

        {coequipiers.length > 1 ? (
          <nav aria-labelledby="titre-coequipiers">
            <h2 id="titre-coequipiers" className={etiquette}>
              L&apos;effectif {effectif.saison.libelle}
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {coequipiers.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/effectif/${c.slug}`}
                    aria-current={c.slug === joueur.slug ? "page" : undefined}
                    className="inline-flex min-h-12 items-center gap-2 border border-[var(--color-nuit-trait)] px-3 text-sm font-semibold hover:border-[var(--color-craie)] aria-[current=page]:border-[var(--color-jaune)] aria-[current=page]:text-[var(--color-jaune)]"
                  >
                    {c.numero !== null ? <span className="titre-affiche text-lg text-[var(--color-turquoise)]">{c.numero}</span> : null}
                    {c.prenom}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </main>
      <PiedDePage saison={effectif.saison.libelle} />
    </>
  );
}
