import { useId } from "react";
import { Motif } from "@/components/motif";
import { segments, type Geometrie } from "./ballon-geometrie";

/*
 * Le dessin de la scene du ballon, sans mouvement : trait fin facon schema de
 * coach. L'animation vit dans ballon-filet.tsx et retrouve chaque element par
 * son attribut data-*.
 *
 * Le rendu serveur est l'etat de depart du geste : ballon a la passe, traces
 * masques (pathLength a 1, donc masquables sans mesurer leur longueur),
 * « Point » invisible. Ainsi rien ne clignote avant que l'animation prenne
 * la main.
 */

export type Variante = "grand" | "portrait";

function Ballon({ rayon: r, x, y }: { rayon: number; x: number; y: number }) {
  return (
    <g data-ballon transform={`translate(${x} ${y})`}>
      {/* Deux ecrasements, chacun son origine fixe : au sol, depuis le bas du
          ballon ; a la frappe, depuis son centre. Changer l'origine d'un meme
          groupe en cours d'animation laissait un decalage residuel. La rotation
          vient en dernier : le ballon s'ecrase dans le sens du sol, quelle que
          soit sa rotation. */}
      <g data-ecrasement-sol>
      <g data-ecrasement>
        <g data-rotation>
          <circle r={r} fill="var(--color-nuit)" stroke="var(--color-turquoise)" strokeWidth={2.5} />
          <path
            d={`M${-r * 0.96},${-r * 0.28} Q0,${-r * 0.02} ${r * 0.96},${-r * 0.28} M${-r * 0.7},${r * 0.7} Q${-r * 0.1},${r * 0.1} ${-r * 0.28},${-r * 0.96} M${r * 0.7},${r * 0.7} Q${r * 0.1},${r * 0.1} ${r * 0.28},${-r * 0.96}`}
            fill="none"
            stroke="var(--color-turquoise)"
            strokeWidth={1.8}
            strokeLinecap="round"
          />
        </g>
      </g>
      </g>
    </g>
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

/** Une etoile de traits autour d'un point : l'eclat de la frappe. */
function Eclat({ cx, cy, rayon, nom }: { cx: number; cy: number; rayon: number; nom: string }) {
  const angles = Array.from({ length: 8 }, (_, i) => (i * Math.PI) / 4 + Math.PI / 8);
  return (
    <g data-eclat={nom} stroke="var(--color-turquoise-clair)" strokeWidth={2.5} strokeLinecap="round" opacity={0}>
      {angles.map((a) => (
        <line
          key={a}
          x1={cx + Math.cos(a) * rayon * 1.3}
          y1={cy + Math.sin(a) * rayon * 1.3}
          x2={cx + Math.cos(a) * rayon * 2}
          y2={cy + Math.sin(a) * rayon * 2}
        />
      ))}
    </g>
  );
}

export function Scene({ g, variante }: { g: Geometrie; variante: Variante }) {
  const id = useId();
  const { montee, descente, smash, rebond } = segments(g);
  const traces = [montee, descente, smash];
  const { sol, largeur, hauteur, frappe, impact, rayon } = g;

  return (
    <div
      data-scene={variante}
      className={variante === "grand" ? "relative hidden aspect-[16/9] w-full md:block" : "relative aspect-[3/4] w-full md:hidden"}
    >
      <div
        data-halo
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          maskImage: "radial-gradient(circle var(--hr, 0px) at var(--hx, 50%) var(--hy, 50%), #000 0%, rgb(0 0 0 / 0.35) 45%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(circle var(--hr, 0px) at var(--hx, 50%) var(--hy, 50%), #000 0%, rgb(0 0 0 / 0.35) 45%, transparent 100%)",
        }}
      >
        <Motif contour fond="transparent" gauche="var(--color-turquoise)" taille={variante === "grand" ? 56 : 44} />
      </div>

      {/* Le debordement est coupe : c'est ce qui fait sortir le ballon du champ. */}
      <svg data-toile viewBox={`0 0 ${largeur} ${hauteur}`} className="absolute inset-0 h-full w-full overflow-hidden" aria-hidden="true">
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

        <g mask={`url(#${id}-trace)`} fill="none" stroke="var(--color-turquoise-clair)" strokeOpacity={0.8} strokeWidth={2} strokeDasharray="2 10" strokeLinecap="round">
          {traces.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>

        <text data-point opacity={0} x={impact.x} y={sol + 70} className="titre-affiche" fill="var(--color-turquoise)" fontSize={variante === "grand" ? 34 : 46} textAnchor="middle">
          Point
        </text>

        <Eclat nom="frappe" cx={frappe.x} cy={frappe.y} rayon={rayon} />
        <g data-ondes fill="none" stroke="var(--color-turquoise)" strokeWidth={2}>
          <ellipse cx={impact.x} cy={sol} rx={0} ry={0} />
          <ellipse cx={impact.x} cy={sol} rx={0} ry={0} />
          <ellipse cx={impact.x} cy={sol} rx={0} ry={0} />
        </g>

        <Ballon rayon={rayon} x={g.depart.x} y={g.depart.y} />
      </svg>
    </div>
  );
}
