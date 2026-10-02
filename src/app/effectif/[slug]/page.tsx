import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { PastilleResultat } from "@/components/pastille-resultat";
import { PiedDePage } from "@/components/public/accueil/pied-de-page";
import { taille } from "@/components/public/effectif/cartes";
import { PortraitJoueur } from "@/components/public/effectif/portrait-joueur";
import { EnTete } from "@/components/public/entete";
import { TitreChapitre } from "@/components/public/titre-chapitre";
import { Volets } from "@/components/public/volets";
import { statutPublic } from "@/lib/calendrier";
import { age, dateLongue } from "@/lib/dates";
import { effectifDeLaSaison, joueurPublic, urlPhoto } from "@/lib/effectif-public";
import { LIBELLES_POSTE } from "@/lib/postes";
import { EQUIPE } from "@/lib/site";
import { positionPhoto } from "@/lib/position-photo";

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

const etiquette = "etiquette text-[var(--color-craie-douce)]";

export default async function PageJoueur({ params }: Parametres) {
  const { slug } = await params;
  const donnees = await joueurPublic(slug);
  // Une adresse en majuscules n'est redirigee que si la version en minuscules existe.
  if (!donnees && slug !== slug.toLowerCase() && (await joueurPublic(slug.toLowerCase()))) {
    permanentRedirect(`/effectif/${slug.toLowerCase()}`);
  }
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
      <main id="contenu" className="colonne-large pt-10 pb-[var(--air-chapitre)] sm:pt-16">
        <Volets>
        <p>
          <Link href={effectif.saison.courante ? "/effectif" : `/effectif?saison=${encodeURIComponent(effectif.saison.libelle)}`} className="inline-flex min-h-11 items-center text-sm font-semibold text-[var(--color-craie-douce)] hover:text-[var(--color-craie)]">
            ← Tout l&apos;effectif
          </Link>
        </p>

        <div className="mt-10 grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="max-w-sm lg:col-span-4 lg:max-w-none">
            <PortraitJoueur
              photo={urlPhoto(joueur.photoCle)}
              position={positionPhoto({ x: joueur.visageX, y: joueur.visageY })}
              numero={effectif.numero}
              poste={effectif.poste}
              sizes="(min-width: 1024px) 30vw, 24rem"
              prioritaire
            />
          </div>
          <div className="lg:col-span-8">
            <p className="etiquette text-[var(--color-turquoise)]">
              {LIBELLES_POSTE[effectif.poste]}
              {effectif.capitaine ? " · Capitaine" : ""}
              {effectif.saison.courante ? "" : ` · Saison ${effectif.saison.libelle}`}
            </p>
            {/* Au-dela d'environ 14 signes, le nom passe au corps des chapitres : a celui des
                pages, un nom compose tenait sur cinq lignes (critique a froid du 02-10-2026). */}
            <h1 className={`titre-affiche mt-4 text-balance ${`${joueur.prenom} ${joueur.nom}`.length > 14 ? "titre-chapitre" : "titre-page"}`}>
              {effectif.numero !== null ? (
                <span className="mr-4 text-[var(--color-turquoise)]">
                  <span className="sr-only">Numéro </span>
                  {effectif.numero}
                  <span className="sr-only">, </span>
                </span>
              ) : null}
              {joueur.prenom} {joueur.nom}
            </h1>
            {donneesPhysiques.length > 0 ? (
              <dl className="mt-8 flex gap-10">
                {donneesPhysiques.map((d) => (
                  <div key={d.nom}>
                    <dt className={etiquette}>{d.nom}</dt>
                    <dd className="titre-affiche titre-carte mt-1">{d.valeur}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
            {joueur.presentation?.trim() ? (
              <p className="chapeau mt-8 max-w-[46ch] whitespace-pre-line text-[var(--color-craie-douce)]">
                {joueur.presentation}
              </p>
            ) : null}
          </div>
        </div>

        {joueur.parcours?.trim() ? (
          <section aria-labelledby="titre-parcours" className="suite max-w-3xl">
            <h2 id="titre-parcours" className="titre-affiche titre-carte">
              Parcours
            </h2>
            <p className="corps mt-[var(--titre-contenu)] whitespace-pre-line">{joueur.parcours}</p>
          </section>
        ) : null}

        {joues.length > 0 ? (
          <section aria-labelledby="titre-matchs-joueur" className="chapitre">
            <TitreChapitre id="titre-matchs-joueur">Sur le terrain en {effectif.saison.libelle}</TitreChapitre>
            <ul className="mt-[var(--titre-contenu)] border-t-2 border-[var(--color-craie)]">
              {joues.map((m) => {
                const victoire = (m.setsNous ?? 0) > (m.setsEux ?? 0);
                return (
                  <li key={m.slug}>
                    <Link
                      href={`/matchs/${m.slug}`}
                      className="group grid min-h-16 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 border-b border-[var(--color-nuit-trait)] py-4 hover:bg-[var(--color-nuit-surface)] sm:gap-x-6 sm:px-3"
                    >
                      <span>
                        <span className="titre-affiche block text-2xl group-hover:text-[var(--color-jaune)]">
                          {m.aDomicile ? "Contre" : "Chez"} {m.adversaire}
                        </span>
                        <span className="inline-block text-base text-[var(--color-craie-douce)] first-letter:uppercase">{dateLongue(m.joueLe)}</span>
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
          <nav aria-labelledby="titre-coequipiers" className="suite">
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
                    {c.prenom} {c.nom.charAt(0)}.
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
        </Volets>
      </main>
      <PiedDePage />
    </>
  );
}
