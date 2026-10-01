import Link from "next/link";
import type { Poste } from "@/lib/db/schema";
import { urlPhoto } from "@/lib/effectif-public";
import { cartesEquipe } from "@/lib/porte-entree";
import { positionPhoto } from "@/lib/position-photo";
import { LIBELLES_POSTE } from "@/lib/postes";
import { PortraitJoueur } from "../effectif/portrait-joueur";
import { ChiffresRoulants } from "./chiffres-roulants";
import { EquipeEnMouvement } from "./mouvements-porte-entree";

/**
 * L'equipe (fiche fiches/accueil-porte-entree.md) : toute l'equipe d'un
 * regard, pas un carrousel. Jusqu'a 12 cartes en grand ecran, 6 au
 * telephone ; au-dela, la derniere place mene au reste de l'effectif. Sans
 * photo, le portrait garde son gabarit, le numero geant sur le motif. Le
 * chapitre disparait tant qu'aucun joueur n'est publie.
 */

const LIMITE_GRAND = 12;
const LIMITE_TELEPHONE = 6;

type Membre = {
  id: number;
  slug: string;
  prenom: string;
  nom: string;
  photoCle: string | null;
  visageX: number | null;
  visageY: number | null;
  numero: number | null;
  poste: Poste;
  capitaine: boolean;
};

function CarteAutres({ reste, className }: { reste: number; className: string }) {
  return (
    <li className={className}>
      <Link href="/effectif" className="group block">
        <span className="grid aspect-[4/5] place-items-center border-2 border-[var(--color-nuit-trait)] transition-colors duration-[80ms] group-hover:border-[var(--color-turquoise)]">
          <span aria-hidden="true" className="titre-affiche text-5xl text-[var(--color-turquoise)]">
            +&nbsp;{reste}
          </span>
        </span>
        <span className="mt-3 block font-semibold group-hover:text-[var(--color-jaune)]">
          {reste > 1 ? `${reste} autres joueurs` : "1 autre joueur"}
        </span>
      </Link>
    </li>
  );
}

function CarteJoueur({ m, masqueeAuTelephone }: { m: Membre; masqueeAuTelephone: boolean }) {
  const photo = urlPhoto(m.photoCle);
  return (
    <li className={masqueeAuTelephone ? "max-sm:hidden" : undefined}>
      <Link href={`/effectif/${m.slug}`} className="group block">
        <span className="relative block transition-transform duration-[80ms] motion-safe:group-hover:-translate-y-1 motion-safe:group-focus-visible:-translate-y-1">
          <PortraitJoueur
            photo={photo}
            position={positionPhoto({ x: m.visageX, y: m.visageY })}
            numero={m.numero}
            poste={m.poste}
            sizes="(min-width: 1024px) 15vw, (min-width: 640px) 30vw, 45vw"
            numeroAffiche={m.numero !== null ? <ChiffresRoulants valeur={m.numero} /> : undefined}
          />
          {/* Le bord qui s'allume au survol, termine en pointe comme les triangles du maillot. */}
          <span
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-1.5 origin-left scale-x-0 bg-[var(--color-turquoise)] transition-transform duration-[var(--duree)] [clip-path:polygon(0_0,100%_0,calc(100%-8px)_100%,0_100%)] group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
          />
        </span>
        <span className="mt-3 flex items-baseline gap-2">
          {photo && m.numero !== null ? (
            <span className="titre-affiche text-xl text-[var(--color-turquoise)]">
              <ChiffresRoulants valeur={m.numero} />
            </span>
          ) : null}
          <span className="titre-affiche text-xl leading-none text-balance group-hover:text-[var(--color-jaune)] group-focus-visible:text-[var(--color-jaune)] sm:text-2xl">
            {m.prenom} {m.nom}
          </span>
        </span>
        <span className="mt-1 flex items-center gap-2 text-sm text-[var(--color-craie-douce)]">
          <span className="sr-only">{m.numero !== null ? `Numéro ${m.numero}, ` : ""}</span>
          {LIBELLES_POSTE[m.poste]}
          {m.capitaine ? (
            <span className="border border-[var(--color-craie-tenue)] px-1 text-xs font-semibold tracking-[0.15em] uppercase">
              <span aria-hidden="true">C</span>
              <span className="sr-only">, capitaine</span>
            </span>
          ) : null}
        </span>
      </Link>
    </li>
  );
}

export function BlocEquipe({ membres, saison }: { membres: Membre[]; saison: string | null }) {
  if (membres.length === 0) return null;
  const grand = cartesEquipe(membres, LIMITE_GRAND);
  const telephone = cartesEquipe(membres, LIMITE_TELEPHONE);
  const compte = `${membres.length} joueur${membres.length > 1 ? "s" : ""}${saison ? ` · saison ${saison}` : ""}`;

  return (
    <section aria-labelledby="titre-equipe" className="colonne-large py-24 sm:py-32" data-apparait>
      <div className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-[var(--color-craie)] pb-3">
        <div>
          <h2 id="titre-equipe" className="titre-affiche text-5xl sm:text-6xl">
            L&apos;équipe
          </h2>
          <p className="mt-2 text-sm text-[var(--color-craie-douce)]">{compte}</p>
        </div>
        <Link
          href="/effectif"
          className="inline-flex min-h-12 items-center font-semibold underline decoration-2 underline-offset-4 hover:text-[var(--color-jaune)]"
        >
          Tout l&apos;effectif
        </Link>
      </div>
      <EquipeEnMouvement>
        <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-6">
          {grand.cartes.map((m, i) => (
            <CarteJoueur key={m.id} m={m} masqueeAuTelephone={i >= telephone.cartes.length} />
          ))}
          {telephone.reste > 0 ? <CarteAutres reste={telephone.reste} className="sm:hidden" /> : null}
          {grand.reste > 0 ? <CarteAutres reste={grand.reste} className="max-sm:hidden" /> : null}
        </ul>
      </EquipeEnMouvement>
    </section>
  );
}
