import Image from "next/image";
import Link from "next/link";
import { age } from "@/lib/dates";
import type { Poste } from "@/lib/db/schema";
import { urlPhoto } from "@/lib/effectif-public";
import { LIBELLES_POSTE } from "@/lib/postes";
import { PortraitJoueur } from "./portrait-joueur";
import { positionPhoto } from "@/lib/position-photo";

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
  visageX: number | null;
  visageY: number | null;
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
          position={positionPhoto({ x: m.visageX, y: m.visageY })}
          numero={m.numero}
          poste={m.poste}
          sizes="(min-width: 1024px) 20rem, (min-width: 640px) 30vw, 45vw"
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
        <span className="mt-2 flex flex-wrap items-center gap-x-3 text-base text-[var(--color-craie-douce)]">
          {details ? <span>{details}</span> : null}
          {m.capitaine ? (
            <span className="etiquette border border-[var(--color-craie-tenue)] px-1.5">
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
        <span className="etiquette block text-[var(--color-turquoise)]">{s.role}</span>
        <span className="titre-affiche titre-carte mt-2 block">{s.nom}</span>
        {s.texte?.trim() ? <span className="corps mt-3 block text-[var(--color-craie-douce)]">{s.texte}</span> : null}
      </span>
    </li>
  );
}
