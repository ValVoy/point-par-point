/**
 * Des chiffres de tableau de gymnase (fiche fiches/palette.md). Chaque
 * segment est une rangee de LED rondes, comme sur les tableaux Bodet : un
 * trait en pointilles a bouts ronds, pas un pave. Sous chaque caractere, les
 * sept segments eteints restent visibles, en ambre fume : c'est ce detail qui
 * fait « vrai materiel ». La lueur, courte et serree, ne touche que les
 * segments allumes.
 *
 * Le caractere mesure 1em de haut : l'afficheur prend la taille du texte qui
 * l'entoure. Purement decoratif : le parent donne toujours la meme
 * information en texte, pour les lecteurs d'ecran.
 */

type Segment = "a" | "b" | "c" | "d" | "e" | "f" | "g";

// Boite de 60 sur 100 : a en haut, puis dans le sens horaire, g au milieu.
const SEGMENTS: Record<Segment, [number, number, number, number]> = {
  a: [15, 8, 45, 8],
  b: [50, 13, 50, 45],
  c: [50, 55, 50, 87],
  d: [15, 92, 45, 92],
  e: [10, 55, 10, 87],
  f: [10, 13, 10, 45],
  g: [15, 50, 45, 50],
};

const TOUS = Object.keys(SEGMENTS) as Segment[];

const CHIFFRES: Record<string, Segment[]> = {
  "0": ["a", "b", "c", "d", "e", "f"],
  "1": ["b", "c"],
  "2": ["a", "b", "g", "e", "d"],
  "3": ["a", "b", "g", "c", "d"],
  "4": ["f", "g", "b", "c"],
  "5": ["a", "f", "g", "c", "d"],
  "6": ["a", "f", "g", "e", "d", "c"],
  "7": ["a", "b", "c"],
  "8": TOUS,
  "9": ["a", "b", "c", "d", "f", "g"],
  "-": ["g"],
  " ": [],
};

const POINTS = { strokeWidth: 8.5, strokeLinecap: "round", strokeDasharray: "0 8" } as const;

// Trois couches, du coeur vers la salle : le point lui-meme qui sature, un
// halo serre, puis une diffusion large et faible, celle qui eclaire le
// boitier autour des chiffres sur un vrai tableau.
const LUEUR =
  "drop-shadow(0 0 1.5px rgb(255 190 60 / 0.9)) drop-shadow(0 0 6px rgb(255 138 0 / 0.55)) drop-shadow(0 0 16px rgb(255 120 0 / 0.25))";

function Traits({ segments, couleur }: { segments: Segment[]; couleur: string }) {
  return (
    <g stroke={couleur} {...POINTS}>
      {segments.map((s) => {
        const [x1, y1, x2, y2] = SEGMENTS[s];
        return <line key={s} x1={x1} y1={y1} x2={x2} y2={y2} />;
      })}
    </g>
  );
}

function Caractere({ c, eteint }: { c: string; eteint: boolean }) {
  if (c === ":") {
    return (
      <svg viewBox="0 0 24 100" className="inline-block h-[1em] w-[0.24em] overflow-visible">
        <g fill="var(--color-led)" style={{ filter: LUEUR }}>
          <circle cx={12} cy={32} r={4.5} />
          <circle cx={12} cy={68} r={4.5} />
        </g>
      </svg>
    );
  }
  const allumes = CHIFFRES[c] ?? [];
  return (
    <svg viewBox="0 0 60 100" className="inline-block h-[1em] w-[0.6em] overflow-visible">
      {eteint ? <Traits segments={TOUS} couleur="var(--color-led-eteinte)" /> : null}
      <g style={{ filter: LUEUR }}>
        <Traits segments={allumes} couleur="var(--color-led)" />
      </g>
    </svg>
  );
}

export function AfficheurLed({
  valeur,
  eteint = true,
  className = "",
}: {
  valeur: string;
  /** Montrer les segments eteints sous chaque caractere. */
  eteint?: boolean;
  className?: string;
}) {
  return (
    <span aria-hidden="true" className={`inline-flex items-center gap-[0.12em] leading-none ${className}`}>
      {[...valeur].map((c, i) => (
        <Caractere key={i} c={c} eteint={eteint} />
      ))}
    </span>
  );
}
