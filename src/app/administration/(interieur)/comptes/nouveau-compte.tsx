"use client";

import { useActionState } from "react";
import { BoutonEnvoi, Champ, Erreur, Selection } from "@/components/formulaire";
import { creerCompte, type EtatCompte } from "./actions";
import { MotDePasseProvisoire } from "./mot-de-passe-provisoire";

const INITIAL: EtatCompte = { erreur: null };

const OPTIONS_ROLE = [
  { valeur: "redacteur", libelle: "Rédacteur : contenu, résultats, messages" },
  { valeur: "admin", libelle: "Administrateur : tout, comptes compris" },
];

export function NouveauCompte() {
  const [etat, action] = useActionState(creerCompte, INITIAL);
  const v = etat.valeurs ?? {};
  return (
    <section className="mt-10 rounded-xl border border-[var(--color-nuit-trait)] bg-[var(--color-nuit-surface)] p-5">
      <h2 className="font-semibold">Ajouter un compte</h2>
      <form key={etat.provisoire?.email ?? "saisie"} action={action} className="mt-4 grid gap-4 sm:grid-cols-2">
        <Champ nom="nom" libelle="Nom" requis valeur={v.nom} maxLength={80} autoComplete="off" />
        <Champ nom="email" libelle="Adresse e-mail" type="email" requis valeur={v.email} maxLength={160} autoComplete="off" />
        <div className="sm:col-span-2">
          <Selection nom="role" libelle="Rôle" valeur={v.role || "redacteur"} options={OPTIONS_ROLE} />
        </div>
        <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
          <BoutonEnvoi>Créer le compte</BoutonEnvoi>
          <Erreur message={etat.erreur} />
        </div>
      </form>
      {etat.provisoire ? <MotDePasseProvisoire {...etat.provisoire} /> : null}
    </section>
  );
}
