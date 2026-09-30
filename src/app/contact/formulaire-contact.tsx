"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { CHAMP_PIEGE, SUJETS, type Sujet } from "@/lib/contact";
import { envoyerMessage, type EtatContact } from "./actions";

/**
 * Le formulaire de contact public (fiche fiches/contact.md). Libelles au-dessus
 * des champs, jamais remplaces par un texte d'exemple ; la saisie est rendue
 * apres un refus ; au succes, la confirmation remplace le formulaire et prend
 * le focus, pour qu'un lecteur d'ecran l'annonce.
 */

const LIBELLE = "block text-sm font-semibold tracking-[0.12em] text-[var(--color-craie-douce)] uppercase";
const CHAMP =
  "mt-2 block w-full border border-[var(--color-nuit-bord)] bg-[var(--color-nuit-surface)] px-4 text-lg text-[var(--color-craie)] transition-colors duration-[80ms] hover:border-[var(--color-craie-tenue)] aria-[invalid=true]:border-[var(--color-erreur)] focus:border-[var(--color-jaune)]";

const INITIAL: EtatContact = { envoye: false, erreur: null };

function Envoyer() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-12 items-center bg-[var(--color-jaune)] px-8 font-semibold text-[var(--color-nuit)] transition-colors duration-[80ms] hover:bg-[var(--color-craie)] disabled:opacity-60"
    >
      {pending ? "Envoi..." : "Envoyer"}
    </button>
  );
}

export function FormulaireContact({ sujet }: { sujet: Sujet }) {
  const [etat, action] = useActionState(envoyerMessage, INITIAL);
  const confirmation = useRef<HTMLDivElement>(null);
  const erreur = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (etat.envoye) confirmation.current?.focus();
    else if (etat.erreur) erreur.current?.focus();
  }, [etat]);

  if (etat.envoye) {
    return (
      <div ref={confirmation} tabIndex={-1} className="border-l-4 border-[var(--color-jaune)] bg-[var(--color-nuit-surface)] px-6 py-8">
        <h2 className="titre-affiche text-4xl">Message reçu</h2>
        <p className="mt-3 text-lg leading-relaxed text-[var(--color-craie-douce)]">
          Merci. On vous répond par e-mail, dès que possible : l&apos;équipe est bénévole, la réponse peut prendre
          quelques jours.
        </p>
        <Link href="/" className="mt-6 inline-flex min-h-12 items-center font-semibold underline underline-offset-4">
          Retour à l&apos;accueil
        </Link>
      </div>
    );
  }

  const v = etat.valeurs ?? {};
  const fautif = (champ: string) =>
    etat.champ === champ ? { "aria-invalid": true as const, "aria-describedby": "erreur-contact" } : {};
  return (
    <form key={etat.essai ?? 0} action={action} className="space-y-7">
      {etat.erreur ? (
        <p
          ref={erreur}
          id="erreur-contact"
          tabIndex={-1}
          className="border-l-4 border-[var(--color-erreur)] bg-[var(--color-nuit-surface)] px-4 py-3 text-[var(--color-craie)]"
        >
          {etat.erreur}
        </p>
      ) : null}

      <div>
        <label htmlFor="sujet" className={LIBELLE}>
          Sujet
        </label>
        <select id="sujet" name="sujet" defaultValue={v.sujet || sujet} className={`${CHAMP} min-h-12`}>
          {Object.entries(SUJETS).map(([cle, libelle]) => (
            <option key={cle} value={cle}>
              {libelle}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-7 sm:grid-cols-2">
        <div>
          <label htmlFor="nom" className={LIBELLE}>
            Nom
          </label>
          <input id="nom" name="nom" required maxLength={80} autoComplete="name" defaultValue={v.nom} {...fautif("nom")} className={`${CHAMP} min-h-12`} />
        </div>
        <div>
          <label htmlFor="email" className={LIBELLE}>
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={160}
            autoComplete="email"
            inputMode="email"
            defaultValue={v.email}
            {...fautif("email")}
            className={`${CHAMP} min-h-12`}
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className={LIBELLE}>
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          minLength={10}
          maxLength={3000}
          rows={7}
          defaultValue={v.message}
          {...fautif("message")}
          className={`${CHAMP} py-3 leading-relaxed`}
        />
      </div>

      {/* Le piege : hors ecran, hors tabulation, ignore des lecteurs d'ecran. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={CHAMP_PIEGE}>Ne pas remplir</label>
        <input id={CHAMP_PIEGE} name={CHAMP_PIEGE} type="text" tabIndex={-1} autoComplete="off" data-1p-ignore data-lpignore="true" defaultValue="" />
      </div>

      <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
        <Envoyer />
        <p className="max-w-[52ch] text-sm leading-relaxed text-[var(--color-craie-tenue)]">
          Votre nom, votre e-mail et votre message servent uniquement à vous répondre : seule l&apos;équipe du site
          les lit, ils sont effacés un an après. Votre adresse réseau est gardée 24 heures, contre les robots.{" "}
          <Link href="/confidentialite" className="underline underline-offset-2 hover:text-[var(--color-craie)]">
            Confidentialité
          </Link>
        </p>
      </div>
    </form>
  );
}
