import { exigerDroit } from "@/lib/auth/session-courante";
import { SUJETS, type Sujet } from "@/lib/contact";
import { dateCourte, heure } from "@/lib/dates";
import { messagesActifs, messagesALaCorbeille } from "@/lib/messages";
import { basculerLu, mettreMessageALaCorbeille, restaurerMessage } from "./actions";

export const metadata = { title: "Messages" };

/**
 * Les messages du formulaire de contact : non lus d'abord, reponse par un
 * lien e-mail pre-rempli. Le texte s'affiche tel quel, en texte brut : c'est
 * un inconnu qui l'a ecrit, il ne passe jamais par un rendu HTML.
 */

const libelleSujet = (sujet: string | null) => SUJETS[(sujet ?? "autre") as Sujet] ?? SUJETS.autre;

function lienReponse(email: string, sujet: string | null) {
  return `mailto:${email}?subject=${encodeURIComponent(`Re : ${libelleSujet(sujet)}`)}`;
}

export default async function PageMessages() {
  await exigerDroit("lireMessages");
  const [liste, corbeille] = await Promise.all([messagesActifs(), messagesALaCorbeille()]);
  const nonLus = liste.filter((m) => !m.lu).length;

  return (
    <>
      <h1 className="titre-admin text-3xl">Messages</h1>
      <p className="mt-2 max-w-prose text-sm text-[var(--color-craie-douce)]">
        Ce que les visiteurs écrivent depuis la page Contact. On répond depuis sa propre messagerie ; les
        messages s&apos;effacent d&apos;eux-mêmes un an après leur arrivée, comme annoncé sur le formulaire.
        {nonLus > 0 ? ` ${nonLus} non lu${nonLus > 1 ? "s" : ""}.` : null}
      </p>

      {liste.length === 0 ? (
        <p className="mt-8 rounded-xl border border-dashed border-[var(--color-nuit-trait)] p-6 text-sm text-[var(--color-craie-tenue)]">
          Aucun message pour l&apos;instant.
        </p>
      ) : (
        <ul className="mt-8 space-y-3">
          {liste.map((m) => (
            <li
              key={m.id}
              className={`rounded-xl border bg-[var(--color-nuit-surface)] p-4 ${m.lu ? "border-[var(--color-nuit-trait)]" : "border-[var(--color-turquoise)]"}`}
            >
              <p className="flex flex-wrap items-center gap-2 text-xs text-[var(--color-craie-tenue)]">
                {m.lu ? null : (
                  <span className="rounded bg-[var(--color-turquoise-sourd)] px-1.5 py-0.5 text-[var(--color-turquoise-clair)]">
                    non lu
                  </span>
                )}
                <span className="rounded bg-[var(--color-nuit)] px-1.5 py-0.5 text-[var(--color-craie-douce)]">
                  {libelleSujet(m.sujet)}
                </span>
                {dateCourte(m.creeLe)} à {heure(m.creeLe)}
              </p>
              <p className="mt-2 font-medium break-words">
                {m.nom} <span className="font-normal text-[var(--color-craie-douce)]">({m.email})</span>
              </p>
              <p className="mt-2 max-w-prose text-sm leading-relaxed break-words whitespace-pre-line text-[var(--color-craie-lecture)]">
                {m.message}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                <a
                  href={lienReponse(m.email, m.sujet)}
                  className="rounded-lg bg-[var(--color-craie)] inline-flex min-h-11 items-center px-3 font-medium text-[var(--color-nuit-surface)]"
                >
                  Répondre par e-mail
                </a>
                <form action={basculerLu}>
                  <input type="hidden" name="id" value={m.id} />
                  <input type="hidden" name="lu" value={m.lu ? "0" : "1"} />
                  <button type="submit" className="text-[var(--color-turquoise)] action-admin">
                    {m.lu ? "Marquer non lu" : "Marquer lu"}
                  </button>
                </form>
                <form action={mettreMessageALaCorbeille}>
                  <input type="hidden" name="id" value={m.id} />
                  <button type="submit" className="text-[var(--color-craie-douce)] action-admin">
                    Mettre à la corbeille
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}

      {corbeille.length > 0 ? (
        <section className="mt-8">
          <h2 className="text-sm font-semibold text-[var(--color-craie-douce)]">Corbeille</h2>
          <p className="mt-1 text-xs text-[var(--color-craie-tenue)]">
            Ces messages peuvent revenir, jusqu&apos;à leur effacement un an après leur arrivée.
          </p>
          <ul className="mt-3 space-y-2">
            {corbeille.map((m) => (
              <li
                key={m.id}
                className="flex items-center gap-4 rounded-lg border border-dashed border-[var(--color-nuit-trait)] px-4 py-2.5 text-sm"
              >
                <span className="min-w-0 truncate text-[var(--color-craie-tenue)]">
                  {m.nom}, {dateCourte(m.creeLe)}
                </span>
                <form action={restaurerMessage} className="ml-auto">
                  <input type="hidden" name="id" value={m.id} />
                  <button type="submit" className="text-[var(--color-turquoise)] action-admin">
                    Restaurer
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </>
  );
}
