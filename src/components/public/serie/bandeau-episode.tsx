import Link from "next/link";
import { LecteurEpisode } from "../lecteur-episode";
import { MiniatureEpisode } from "../miniature-episode";

/**
 * Le dernier episode en bandeau (fiche fiches/refonte-respiration.md), partage
 * par la page Serie, l'accueil et la page d'un match : la vignette en grand,
 * 16:9 sur toute la colonne large, au lieu du moitie-moitie d'avant. En grand
 * ecran, le numero et le titre se posent sur la vignette, sur un degrade nuit
 * assez dense pour tenir sur une vignette claire ; au telephone, ou la
 * vignette fait 220 px de haut, ils passent dessous. Les deux versions ne sont
 * jamais affichees ensemble : une seule est lue.
 *
 * Deux usages : un lien vers la page de l'episode (`href`), ou le titre est un
 * vrai titre (h2), ou la facade du lecteur (`lecteur`), qui ne charge YouTube
 * qu'au clic ; la, le titre vit dans un bouton, qui ne peut pas contenir de
 * titre, et c'est la section qui porte le sien.
 */

type Props = {
  youtubeId: string;
  titre: string;
  etiquette: string;
  nouveau?: boolean;
  prioritaire?: boolean;
} & ({ href: string; lecteur?: never } | { lecteur: true; href?: never });

function Lecture() {
  return (
    <span
      aria-hidden="true"
      className="grid size-16 shrink-0 place-items-center bg-[var(--color-jaune)] text-[var(--color-nuit)] transition-transform duration-[var(--duree-breve)] group-hover:scale-110 sm:size-20"
    >
      <svg viewBox="0 0 24 24" className="ml-1 size-7 sm:size-8" fill="currentColor">
        <path d="M6 4l14 8-14 8z" />
      </svg>
    </span>
  );
}

function Texte({
  titre,
  etiquette,
  nouveau,
  enTitre,
  surImage = false,
}: {
  titre: string;
  etiquette: string;
  nouveau?: boolean;
  /** Vrai : le titre est un h2 ; faux dans un bouton, qui ne peut pas en contenir. */
  enTitre: boolean;
  surImage?: boolean;
}) {
  const Balise = enTitre ? "h2" : "span";
  return (
    <>
      <span className="flex flex-wrap items-center gap-3">
        {nouveau ? (
          <span className="etiquette bg-[var(--color-jaune)] px-2 py-1 text-[var(--color-nuit)]">Nouveau</span>
        ) : null}
        <span className={`etiquette ${surImage ? "text-[var(--color-craie)]" : "text-[var(--color-craie-douce)]"}`}>
          {etiquette}
        </span>
      </span>
      <Balise
        className={`titre-affiche titre-chapitre mt-3 block max-w-[18ch] text-balance group-hover:text-[var(--color-jaune)] group-focus-visible:text-[var(--color-jaune)] ${surImage ? "line-clamp-3" : ""}`}
      >
        {titre}
      </Balise>
    </>
  );
}

export function BandeauEpisode(props: Props) {
  const { youtubeId, titre, etiquette, nouveau, prioritaire } = props;
  const lien = Boolean(props.href);
  // Dans un lien, le calque peut porter un titre (div) ; dans le bouton de la facade, seulement des span.
  const Calque = lien ? "div" : "span";

  const image = (
    <>
      <MiniatureEpisode youtubeId={youtubeId} sizes="(min-width: 1344px) 84rem, 100vw" prioritaire={prioritaire} />
      {/* Plus dense dans le tiers bas (arbitrage du 02-10-2026, audit G15) : le texte que
          YouTube incruste parfois dans la miniature (« 4K ») ne heurte plus le titre ni le bouton. */}
      <span
        aria-hidden="true"
        className="absolute inset-0 hidden bg-gradient-to-t from-[var(--color-nuit)] from-25% via-[var(--color-nuit)]/85 via-50% to-transparent lg:block"
      />
      {/* En mode lien, le bouton est au centre de l'image (arbitrage du 02-10-2026, audit
          G27) : en bas a gauche, il repoussait le titre et creait un second bord gauche. En
          mode lecteur, la place du bouton de la facade (bottom-8 left-8) reste reservee. */}
      <Calque className="absolute inset-x-0 bottom-0 hidden items-end gap-8 p-8 pr-40 text-left lg:flex">
        {lien ? null : <span aria-hidden="true" className="size-20 shrink-0" />}
        <Calque className="block min-w-0">
          <Texte titre={titre} etiquette={etiquette} nouveau={nouveau} enTitre={lien} surImage />
        </Calque>
      </Calque>
      {lien ? (
        <span className="absolute inset-0 grid place-items-center">
          <Lecture />
        </span>
      ) : null}
    </>
  );

  const cadre = "relative block aspect-video overflow-hidden bg-[var(--color-nuit-surface)]";

  if (props.href) {
    return (
      <Link href={props.href} className="group block">
        <div data-volet className={cadre}>
          {image}
        </div>
        <div className="mt-5 lg:hidden">
          <Texte titre={titre} etiquette={etiquette} nouveau={nouveau} enTitre />
        </div>
      </Link>
    );
  }

  return (
    <div>
      <div data-volet className={cadre}>
        <LecteurEpisode youtubeId={youtubeId} titre={titre}>
          {image}
        </LecteurEpisode>
      </div>
      {/* Copie visible au telephone ; le bouton dit deja le titre, et la section le porte en titre. */}
      <div aria-hidden="true" className="mt-5 lg:hidden">
        <Texte titre={titre} etiquette={etiquette} nouveau={nouveau} enTitre={false} />
      </div>
    </div>
  );
}
