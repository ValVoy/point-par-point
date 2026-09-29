import type { ReactNode } from "react";
import { Motif } from "@/components/motif";
import { Ballon, Terrain } from "../ballon-scene";
import { TITRE_TRACES } from "../titre-traces";
import { placementTitre, pointsDuPublic, type GeometrieIntro } from "./geometrie-intro";

/*
 * La salle de l'intro, dessinee, sans mouvement (fiche
 * `fiches/accueil-ouverture.md`) : le tableau, les tribunes en points, le
 * bandeau LED ou defile le motif du maillot, le terrain, et le titre.
 *
 * Rendue par le serveur, elle montre l'etat final : le titre forme, les
 * tribunes, le bandeau. Le terrain, le ballon et le tableau portent
 * `data-intro-seulement` : ils n'apparaissent que si l'intro joue. Le titre
 * porte `data-final-seulement` : cache pendant l'intro jusqu'a ce que
 * l'animation prenne la main, avec un filet de securite en CSS.
 */

export type VarianteSalle = "grand" | "portrait";

const pourcent = (valeur: number, total: number) => `${(valeur / total) * 100}%`;

/** Le tableau de l'intro : une balle de set, 24-23, qui passera a 25-23. */
function TableauIntro({ gi }: { gi: GeometrieIntro }) {
  const { largeur, hauteur } = gi.terrain;
  const t = gi.tableau;
  const lueur = { textShadow: "0 0 12px rgb(62 197 204 / 0.55), 0 0 2px rgb(191 241 243 / 0.9)" };
  return (
    <div
      data-intro-seulement
      data-tableau-intro
      className="absolute flex flex-col justify-center rounded-md border border-[var(--color-nuit-trait)] px-[4%]"
      style={{
        left: pourcent(t.x, largeur),
        top: pourcent(t.y, hauteur),
        width: pourcent(t.largeur, largeur),
        height: pourcent(t.hauteur, hauteur),
        background: "#05060c",
        containerType: "inline-size",
      }}
    >
      <p data-balle-de-set className="text-center text-[4.5cqw] font-semibold tracking-[0.2em] text-[var(--color-turquoise)] uppercase">
        Balle de set
      </p>
      {/* Les noms sur leur ligne, le score en grand dessous : rien n'est tronque. */}
      <div className="titre-affiche mt-[2.5cqw] flex justify-between text-[6cqw] text-[var(--color-craie-douce)]">
        <span>VF Francheville</span>
        <span>Adversaire</span>
      </div>
      <div className="titre-affiche mt-[1.5cqw] flex items-center justify-center gap-[4cqw] text-[20cqw] text-[var(--color-turquoise)]" style={lueur}>
        {/* Les deux chiffres empiles : le point fait glisser 24 vers 25. */}
        <span className="relative block h-[1em] overflow-hidden leading-none">
          <span data-score-nous className="block leading-none">
            <span className="block">24</span>
            <span className="block">25</span>
          </span>
        </span>
        <span className="text-[0.5em] opacity-40">-</span>
        <span className="leading-none">23</span>
      </div>
    </div>
  );
}

/** Le bandeau LED : un cadre, et le motif du maillot qui defile dedans. */
function Bandeau({ gi, variante }: { gi: GeometrieIntro; variante: VarianteSalle }) {
  const { largeur, hauteur } = gi.terrain;
  const b = gi.bandeau;
  return (
    <div
      aria-hidden="true"
      className="absolute overflow-hidden"
      style={{
        left: pourcent(b.x, largeur),
        top: pourcent(b.y, hauteur),
        width: pourcent(b.largeur, largeur),
        height: pourcent(b.hauteur, hauteur),
      }}
    >
      {/* Deux tuiles de plus que la largeur : le defilement boucle sans couture. */}
      <div data-bandeau-motif className="absolute inset-y-0 left-0 w-[calc(100%+112px)] opacity-40 will-change-transform">
        <Motif contour fond="transparent" gauche="var(--color-turquoise)" taille={variante === "grand" ? 28 : 24} />
      </div>
    </div>
  );
}

function Titre({ gi }: { gi: GeometrieIntro }) {
  const miseEnPage = TITRE_TRACES[gi.miseEnPage];
  const p = placementTitre(gi, miseEnPage);
  return (
    <g data-titre data-final-seulement transform={`translate(${p.x} ${p.y}) scale(${p.echelle})`}>
      {miseEnPage.lettres.map((lettre, rang) => (
        <path
          key={rang}
          data-lettre
          d={lettre.d}
          fill="var(--color-craie)"
          stroke="var(--color-turquoise-clair)"
          strokeWidth={2}
          strokeOpacity={0}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </g>
  );
}

/**
 * `children` se place sous le titre, sur sa largeur : le sous-titre et
 * l'invitation a defiler, qui n'apparaissent qu'a la fin de l'intro.
 */
export function Salle({ gi, variante, children }: { gi: GeometrieIntro; variante: VarianteSalle; children?: ReactNode }) {
  const t = gi.terrain;
  const public_ = pointsDuPublic(gi);
  const { bandeau } = gi;

  return (
    <div
      data-salle={variante}
      className={`relative mx-auto w-full overflow-hidden ${variante === "grand" ? "hidden md:block" : "md:hidden"}`}
      // La salle garde ses proportions et tient dans l'ecran, dans les deux sens.
      style={{ aspectRatio: `${t.largeur} / ${t.hauteur}`, maxWidth: `calc(100svh * ${t.largeur / t.hauteur})` }}
    >
      <div data-plateau className="absolute inset-0 will-change-transform">
        {/* Decoratif : le titre existe en <h1> dans l'ouverture, pour tous. */}
        <svg viewBox={`0 0 ${t.largeur} ${t.hauteur}`} className="absolute inset-0 h-full w-full" aria-hidden="true">
          <g data-public fill="var(--color-craie-douce)">
            {public_.map((point) => (
              <circle
                key={`${point.x}-${point.y}`}
                cx={point.x}
                cy={point.y}
                r={gi.tribunes.rayon}
                // Un public vivant n'est pas une grille : chaque point a sa nuance.
                opacity={0.25 + ((point.x * 7 + point.rang * 13) % 10) / 22}
              />
            ))}
          </g>
          <g data-bandeau-cadre stroke="var(--color-craie)" strokeOpacity={0.5} strokeWidth={1.5}>
            <line x1={0} x2={t.largeur} y1={bandeau.y} y2={bandeau.y} />
            <line x1={0} x2={t.largeur} y1={bandeau.y + bandeau.hauteur} y2={bandeau.y + bandeau.hauteur} />
          </g>

          <g data-intro-seulement data-terrain>
            <Terrain g={t} />
          </g>

          <Titre gi={gi} />
        </svg>

        <Bandeau gi={gi} variante={variante} />
        <TableauIntro gi={gi} />
        <div data-intro-seulement>
          <Ballon g={t} />
        </div>

        {children ? (
          <div
            data-final-seulement
            data-apparition
            className="absolute"
            style={{
              left: pourcent(gi.titre.x, t.largeur),
              top: pourcent(gi.titre.y + gi.titre.hauteur + t.hauteur * 0.04, t.hauteur),
              width: pourcent(gi.titre.largeur, t.largeur),
            }}
          >
            {children}
          </div>
        ) : null}
      </div>
    </div>
  );
}
