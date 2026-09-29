import { useId } from "react";
import { Motif } from "@/components/motif";
import { segments, type Geometrie } from "./ballon-geometrie";

/*
 * Le dessin de la scene du ballon, sans mouvement : trait fin facon schema de
 * coach. L'animation vit dans ballon-filet.tsx et retrouve chaque element par
 * son attribut data-*.
 *
 * Deux etages, pour la fluidite. Le SVG porte le decor fixe (sol, filet,
 * traces, eclat, ondes). Le ballon et le halo sont des calques HTML poses
 * par-dessus et deplaces par transform : la carte graphique les fait glisser
 * sans rien redessiner, la ou un element deplace dans un SVG oblige a
 * repeindre tout le SVG a chaque image.
 *
 * Le rendu serveur est l'etat de depart du geste : ballon a la passe, traces
 * masques (pathLength a 1, donc masquables sans mesurer leur longueur). Rien
 * ne clignote avant que l'animation prenne la main.
 */

export type Variante = "grand" | "portrait";

/** Rayon du halo, en pixels d'ecran. */
export const RAYON_HALO: Record<Variante, number> = { grand: 220, portrait: 160 };

const pourcent = (valeur: number, total: number) => `${(valeur / total) * 100}%`;

/**
 * Le ballon, en calques imbriques, chacun une seule transformation : position,
 * etirement dans le sens de la course (orienter, etirer, reorienter), les deux
 * ecrasements (depuis le bas au sol, depuis le centre a la frappe), puis la
 * rotation. Une origine par calque : en changer en pleine animation laissait
 * un decalage residuel.
 */
export function Ballon({ g }: { g: Geometrie }) {
  const r = g.rayon;
  const calque = "size-full will-change-transform";
  return (
    <div
      data-ballon
      className="absolute will-change-transform"
      style={{
        left: pourcent(g.depart.x, g.largeur),
        top: pourcent(g.depart.y, g.hauteur),
        width: pourcent(2 * r, g.largeur),
        aspectRatio: "1",
        transform: "translate(-50%, -50%)",
      }}
    >
      <div data-oriente className={calque}>
        <div data-etire className={calque}>
          <div data-reoriente className={calque}>
            <div data-ecrasement-sol className={calque}>
              <div data-ecrasement className={calque}>
                <svg data-rotation viewBox={`${-r} ${-r} ${2 * r} ${2 * r}`} className={`${calque} overflow-visible`}>
                  <circle r={r - 1.5} fill="var(--color-nuit)" stroke="var(--color-turquoise)" strokeWidth={2.5} />
                  <path
                    d={`M${-r * 0.96},${-r * 0.28} Q0,${-r * 0.02} ${r * 0.96},${-r * 0.28} M${-r * 0.7},${r * 0.7} Q${-r * 0.1},${r * 0.1} ${-r * 0.28},${-r * 0.96} M${r * 0.7},${r * 0.7} Q${r * 0.1},${r * 0.1} ${r * 0.28},${-r * 0.96}`}
                    fill="none"
                    stroke="var(--color-turquoise)"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Le halo : une fenetre ronde qui se deplace, et dans laquelle le motif est
 * contre-deplace, pour rester immobile par rapport au terrain. On voit donc le
 * motif se reveler sous la lumiere, sans qu'il bouge lui-meme.
 */
function Halo({ variante }: { variante: Variante }) {
  const rayon = RAYON_HALO[variante];
  const masque = "radial-gradient(circle closest-side, #000 0%, rgb(0 0 0 / 0.35) 45%, transparent 100%)";
  return (
    <div
      data-halo
      aria-hidden="true"
      className="pointer-events-none absolute top-0 left-0 overflow-hidden opacity-0 will-change-transform"
      style={{ width: 2 * rayon, height: 2 * rayon, maskImage: masque, WebkitMaskImage: masque }}
    >
      <div data-halo-motif className="absolute top-0 left-0 opacity-30 will-change-transform">
        <Motif contour fond="transparent" taille={variante === "grand" ? 28 : 22} />
      </div>
    </div>
  );
}

/**
 * Le filet, vu de trois quarts : un panneau de mailles entre deux poteaux,
 * incline pour qu'on lise un filet et non une echelle. Le bord haut, la
 * bande, reste sous la trajectoire du smash (verifie par les tests).
 */
function Filet({ g }: { g: Geometrie }) {
  const { filet, sol } = g;
  const { demi, recul } = filet;
  const gauche = filet.x - demi;
  const droite = filet.x + demi;
  const hauteur = filet.bas - filet.haut;
  // Un point du panneau : u de 0 (poteau proche) a 1 (lointain), v de 0 (bande) a 1 (bas).
  const x = (u: number) => gauche + u * (droite - gauche);
  const y = (u: number, v: number) => filet.haut - u * recul + v * hauteur;
  const fractions = (n: number) => Array.from({ length: n - 1 }, (_, i) => (i + 1) / n);

  return (
    <g data-filet stroke="var(--color-craie)" fill="none">
      <line x1={droite} x2={droite} y1={filet.haut - recul - 14} y2={sol - recul * 0.5} strokeWidth={2} strokeOpacity={0.4} />
      <g strokeWidth={1} strokeOpacity={0.28}>
        {fractions(8).map((u) => (
          <line key={`c${u}`} x1={x(u)} y1={y(u, 0)} x2={x(u)} y2={y(u, 1)} />
        ))}
        {fractions(9).map((v) => (
          <line key={`l${v}`} x1={x(0)} y1={y(0, v)} x2={x(1)} y2={y(1, v)} />
        ))}
      </g>
      <line x1={x(0)} y1={y(0, 1)} x2={x(1)} y2={y(1, 1)} strokeWidth={1.5} strokeOpacity={0.5} />
      <line x1={x(0)} y1={y(0, 0)} x2={x(1)} y2={y(1, 0)} strokeWidth={4} strokeOpacity={0.85} />
      <line x1={gauche} x2={gauche} y1={filet.haut - 14} y2={sol} strokeWidth={3} strokeOpacity={0.8} />
    </g>
  );
}

/** Une etoile de traits autour du point de frappe, invisible au depart. */
export function Eclat({ g }: { g: Geometrie }) {
  const { frappe, rayon } = g;
  const angles = Array.from({ length: 8 }, (_, i) => (i * Math.PI) / 4 + Math.PI / 8);
  return (
    <g data-eclat stroke="var(--color-turquoise-clair)" strokeWidth={2.5} strokeLinecap="round" opacity={0}>
      {angles.map((a) => (
        <line
          key={a}
          x1={frappe.x + Math.cos(a) * rayon * 1.3}
          y1={frappe.y + Math.sin(a) * rayon * 1.3}
          x2={frappe.x + Math.cos(a) * rayon * 2}
          y2={frappe.y + Math.sin(a) * rayon * 2}
        />
      ))}
    </g>
  );
}

/**
 * Le terrain dessine, a placer dans un <svg> dont la viewBox est celle de la
 * geometrie : traces masques du geste, sol, filet, eclat, ondes. Partage par
 * la scene du prototype et l'intro de l'accueil.
 */
export function Terrain({ g }: { g: Geometrie }) {
  const id = useId();
  const { montee, descente, smash, rebond } = segments(g);
  const traces = [montee, descente, smash];
  const { sol, largeur, hauteur, impact } = g;

  return (
    <>
      <defs>
        <mask id={`${id}-trace`} maskUnits="userSpaceOnUse" x="0" y="0" width={largeur} height={hauteur}>
          {traces.map((d) => (
            <path
              key={d}
              data-revele
              d={d}
              pathLength={1}
              strokeDasharray="1"
              strokeDashoffset="1"
              fill="none"
              stroke="#fff"
              strokeWidth={14}
              strokeLinecap="butt"
            />
          ))}
        </mask>
      </defs>
      <path data-rebond d={rebond} fill="none" stroke="none" />

      <line data-sol x1={0} x2={largeur} y1={sol} y2={sol} stroke="var(--color-craie-douce)" strokeOpacity={0.35} strokeWidth={1.5} />
      {[0.25, 0.75].map((f) => (
        <line key={f} x1={largeur * f} x2={largeur * f} y1={sol} y2={sol + 14} stroke="var(--color-craie-douce)" strokeOpacity={0.35} />
      ))}

      <Filet g={g} />

      <g data-traces mask={`url(#${id}-trace)`} fill="none" stroke="var(--color-turquoise-clair)" strokeOpacity={0.8} strokeWidth={2} strokeDasharray="2 10" strokeLinecap="round">
        {traces.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>

      <Eclat g={g} />
      <g data-ondes fill="none" stroke="var(--color-turquoise)" strokeWidth={2}>
        {[0, 1, 2].map((i) => (
          <ellipse key={i} cx={impact.x} cy={sol} rx={0} ry={0} />
        ))}
      </g>
    </>
  );
}

export function Scene({ g, variante }: { g: Geometrie; variante: Variante }) {
  const { largeur, hauteur } = g;

  return (
    <div
      data-scene={variante}
      // Le debordement est coupe : c'est ce qui fait sortir le ballon du champ.
      className={`relative w-full overflow-hidden ${variante === "grand" ? "hidden aspect-[16/9] md:block" : "aspect-[9/10] md:hidden"}`}
    >
      <div data-plateau className="absolute inset-0 will-change-transform">
        <Halo variante={variante} />

        <svg viewBox={`0 0 ${largeur} ${hauteur}`} className="absolute inset-0 h-full w-full" aria-hidden="true">
          <Terrain g={g} />
        </svg>

        <Ballon g={g} />
      </div>
    </div>
  );
}
