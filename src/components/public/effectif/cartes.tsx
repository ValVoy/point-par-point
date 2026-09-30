import Image from "next/image";
import Link from "next/link";
import { age } from "@/lib/dates";
import type { Poste } from "@/lib/db/schema";
import { urlPhoto } from "@/lib/effectif-public";
import { LIBELLES_POSTE } from "@/lib/postes";
import { PortraitJoueur } from "./portrait-joueur";

/**
 * Les cartes de la page de l'effectif (fiche fiches/effectif.md). Celle d'un
 * joueur : le grand portrait, puis le nom ; le poste est dit par l'intertitre
 * de sa section, et redit aux lecteurs d'ecran. Celle du staff est plus
 * sobre, sans portrait si personne n'a donne de photo.
 */

export const taille = (cm: number | null) =>
  cm ? `${Math.floor(cm / 100)},${String(cm % 100).padStart(2, "0")} m` : null;

type Membre = {
  id: number;
  slug: string;
  prenom: string;
  nom: string;
  neLe: Date | null;
  tailleCm: number | null;
  photoCle: string | null;
  numero: number | null;
  poste: Poste;
  capitaine: boolean;
};

export function CarteJoueur({ membre: m, maintenant }: { membre: Membre; maintenant: Date }) {
  const ans = age(m.neLe, maintenant);
  const photo = urlPhoto(m.photoCle);
  const details = [ans !== null ? `${ans} ans` : null, taille(m.tailleCm)].filter(Boolean).join(" · ");
  return (
    <li>
      <Link href={`/effectif/${m.slug}`} className="group block">
        <PortraitJoueur
          photo={photo}
          numero={m.numero}
          poste={m.poste}
          sizes="(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 45vw"
        />
        <span className="sr-only">{LIBELLES_POSTE[m.poste]}, </span>
        <span className="mt-4 flex items-baseline gap-3">
          {m.numero !== null ? (
            <span className={photo ? "titre-affiche text-2xl text-[var(--color-turquoise)]" : "sr-only"}>
              <span className="sr-only">Numéro </span>
              {m.numero}
              <span className="sr-only">, </span>
            </span>
          ) : null}
          <span className="titre-affiche text-2xl leading-none text-balance group-hover:text-[var(--color-jaune)] group-focus-visible:text-[var(--color-jaune)] sm:text-3xl">
            {m.prenom} {m.nom}
          </span>
        </span>
        <span className="mt-2 flex flex-wrap items-center gap-x-3 text-sm text-[var(--color-craie-douce)]">
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
}

type MembreStaff = { id: number; nom: string; role: string; photoCle: string | null; texte: string | null };

export function CarteStaff({ membre: s }: { membre: MembreStaff }) {
  const photo = urlPhoto(s.photoCle);
  return (
    <li className="flex gap-5">
      {photo ? (
        <span className="relative block size-24 shrink-0 overflow-hidden bg-[var(--color-nuit-surface)]">
          <Image src={photo} alt="" fill sizes="6rem" className="object-cover grayscale" />
        </span>
      ) : null}
      <span className="min-w-0">
        <span className="block text-xs font-semibold tracking-[0.15em] text-[var(--color-turquoise)] uppercase">{s.role}</span>
        <span className="titre-affiche mt-1 block text-3xl">{s.nom}</span>
        {s.texte?.trim() ? <span className="mt-2 block leading-relaxed text-[var(--color-craie-douce)]">{s.texte}</span> : null}
      </span>
    </li>
  );
}
