import type { Metadata } from "next";
import Link from "next/link";
import { ActionsMatch } from "@/components/public/actions-match";
import { PiedDePage } from "@/components/public/accueil/pied-de-page";
import { EnTete } from "@/components/public/entete";
import { LigneCalendrier } from "@/components/public/matchs/ligne-calendrier";
import { TableauProchainMatch } from "@/components/public/tableau-prochain-match";
import { DUREE_EN_COURS, grouperParMois } from "@/lib/calendrier";
import { calendrierDeLaSaison } from "@/lib/matchs-publics";
import { matchDuTableau } from "@/lib/resultats";
import { EQUIPE } from "@/lib/site";

/**
 * Le calendrier de la saison (fiche fiches/matchs.md) : les saisons, le
 * prochain match en tableau, puis une seule liste par mois, avec un filet
 * « Aujourd'hui » entre ce qui est joue et ce qui vient. La saison est dans
 * l'adresse, en parametre : /matchs?saison=2026-2027.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Les matchs",
  description: `Le calendrier et les résultats de l'équipe D2 masculine du ${EQUIPE}.`,
};

function Bilan({ victoires, defaites }: { victoires: number; defaites: number }) {
  if (victoires + defaites === 0) return null;
  const pluriel = (n: number, mot: string) => `${n} ${mot}${n > 1 ? "s" : ""}`;
  return (
    <p className="mt-4 text-lg text-[var(--color-craie-douce)]">
      {pluriel(victoires, "victoire")} · {pluriel(defaites, "défaite")}
    </p>
  );
}

/** Le filet entre ce qui est joue et ce qui vient, hors des listes : un vrai separateur. */
function Aujourdhui() {
  return (
    <div role="separator" aria-label="Aujourd'hui" className="flex items-center gap-3 py-4">
      <span aria-hidden="true" className="text-xs font-semibold tracking-[0.2em] text-[var(--color-jaune)] uppercase">
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
  const joues = matchs.filter((m) => m.etat === "jouee" && m.setsNous !== null && m.setsEux !== null);
  const victoires = joues.filter((m) => m.setsNous! > m.setsEux!).length;
  // Le filet « Aujourd'hui » se pose avant le premier match qui n'est pas encore derriere nous.
  const premierAVenir = matchs.find((m) => m.joueLe.getTime() >= maintenant.getTime() - DUREE_EN_COURS)?.id;

  return (
    <>
      <EnTete actif="/matchs" />
      <main id="contenu" className="pb-24">
        <section className="colonne-large pt-16 pb-12 sm:pt-24">
          <p className="text-xs font-semibold tracking-[0.2em] text-[var(--color-craie-douce)] uppercase">
            {EQUIPE}
          </p>
          <h1 className="titre-affiche mt-3 text-6xl sm:text-8xl">Les matchs</h1>
          <Bilan victoires={victoires} defaites={joues.length - victoires} />
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
          <section aria-label="Prochain match" className="colonne-large pb-16">
            <div className="max-w-3xl">
              <TableauProchainMatch
                match={{
                  adversaire: prochain.adversaire,
                  domicile: prochain.aDomicile,
                  joueLe: prochain.joueLe,
                  salle: [prochain.salleNom, prochain.salleAdresse].filter(Boolean).join(", ") || null,
                }}
                maintenant={maintenant}
              />
              <ActionsMatch match={prochain} />
            </div>
          </section>
        ) : null}

        <section aria-labelledby="titre-calendrier" className="colonne-large">
          <h2 id="titre-calendrier" className="sr-only">
            Calendrier {saison ? `de la saison ${saison.libelle}` : ""}
          </h2>
          {matchs.length === 0 ? (
            <p className="max-w-[46ch] text-lg text-[var(--color-craie-douce)]">
              Le calendrier de cette saison n&apos;est pas encore publié.
            </p>
          ) : (
            grouperParMois(matchs).map((groupe) => {
              const coupe = groupe.matchs.findIndex((m) => m.id === premierAVenir && m !== matchs[0]);
              const lignes = (liste: typeof groupe.matchs) => (
                <ul>
                  {liste.map((m) => (
                    <LigneCalendrier key={m.id} match={m} maintenant={maintenant} raconte={racontes.has(m.id)} />
                  ))}
                </ul>
              );
              return (
                <div key={groupe.cle} className="mt-10 first:mt-0">
                  {coupe === 0 ? <Aujourdhui /> : null}
                  <h3 className="border-b-2 border-[var(--color-craie)] pb-2 text-xs font-semibold tracking-[0.2em] uppercase">
                    {groupe.libelle}
                  </h3>
                  {coupe > 0 ? (
                    <>
                      {lignes(groupe.matchs.slice(0, coupe))}
                      <Aujourdhui />
                      {lignes(groupe.matchs.slice(coupe))}
                    </>
                  ) : (
                    lignes(groupe.matchs)
                  )}
                </div>
              );
            })
          )}
        </section>
      </main>
      <PiedDePage saison={saison?.libelle ?? null} />
    </>
  );
}
