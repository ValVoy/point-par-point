import Image from "next/image";
import type { CSSProperties } from "react";
import styles from "./planche.module.css";

/*
 * Photo de remplacement : une equipe senior du club, telechargee dans
 * public/_local/ (ignore par git). A remplacer par une photo de la D2 des
 * qu'il y en a une. Elle ne quitte jamais le poste de developpement.
 */
const PHOTO = "/_local/wa-17.20.40-1024x768.jpeg";

type Filtre = { id: string; nom: string; teintes: string[] };

const FILTRES: Filtre[] = [
  { id: "bichromie", nom: "Bichromie nuit et turquoise", teintes: ["#0a0d1a", "#3ec5cc"] },
  {
    id: "trichromie",
    nom: "Trichromie nuit, violet, turquoise clair",
    teintes: ["#0a0d1a", "#5e3f98", "#bff1f3"],
  },
];

/* Convertit une suite de teintes en tables de transfert, canal par canal. */
function tables(teintes: string[]) {
  const canaux = [1, 3, 5].map((debut) =>
    teintes.map((t) => (parseInt(t.slice(debut, debut + 2), 16) / 255).toFixed(3)).join(" "),
  );
  return { r: canaux[0], g: canaux[1], b: canaux[2] };
}

export function FiltresSvg() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true">
      {FILTRES.map((f) => {
        const t = tables(f.teintes);
        return (
          <filter key={f.id} id={f.id} colorInterpolationFilters="sRGB">
            <feColorMatrix type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncR type="linear" slope="1.25" intercept="-0.08" />
              <feFuncG type="linear" slope="1.25" intercept="-0.08" />
              <feFuncB type="linear" slope="1.25" intercept="-0.08" />
            </feComponentTransfer>
            <feComponentTransfer>
              <feFuncR type="table" tableValues={t.r} />
              <feFuncG type="table" tableValues={t.g} />
              <feFuncB type="table" tableValues={t.b} />
            </feComponentTransfer>
          </filter>
        );
      })}
    </svg>
  );
}

type Joueur = {
  numero: number;
  poste: string;
  fx: number;
  fy: number;
  phrase?: string;
};

// Points de visage releves a la main sur la photo, en fraction de sa taille :
// exactement ce que l'ami fera d'un clic dans l'administration.
const JOUEURS: Joueur[] = [
  { numero: 11, poste: "Passeur", fx: 0.311, fy: 0.471, phrase: "Arrivé pour un match, resté pour la saison." },
  { numero: 4, poste: "Libéro", fx: 0.444, fy: 0.514 },
  { numero: 2, poste: "Central", fx: 0.553, fy: 0.508 },
  { numero: 9, poste: "Réceptionneur-attaquant", fx: 0.677, fy: 0.527 },
];

// Le zoom entre dans la taille demandee a l'optimiseur : sans lui, la carte
// recoit une image a sa taille affichee, puis l'agrandit cinq fois.
const ZOOM = 5;

function Carte({ joueur, filtre }: { joueur: Joueur; filtre: string }) {
  const position = {
    "--fx": joueur.fx,
    "--fy": joueur.fy,
    width: `${ZOOM * 100}%`,
  } as CSSProperties;

  return (
    <li className={`${styles.carte} group`}>
      <div className={styles.cadre}>
        <Image
          src={PHOTO}
          alt=""
          width={1024}
          height={768}
          sizes={`(min-width: 1024px) ${ZOOM * 25}vw, ${ZOOM * 50}vw`}
          className={styles.recadree}
          style={{ ...position, filter: `url(#${filtre})` }}
        />
        <Image
          src={PHOTO}
          alt=""
          width={1024}
          height={768}
          sizes={`(min-width: 1024px) ${ZOOM * 25}vw, ${ZOOM * 50}vw`}
          className={`${styles.recadree} ${styles.couleurReelle}`}
          style={position}
        />
        <span aria-hidden="true" className={styles.numeroGeant} style={{ fontFamily: "var(--titre)", fontWeight: 800, fontStretch: "var(--titre-largeur)" }}>
          {joueur.numero}
        </span>
      </div>
      <div className="pt-4">
        <p className={styles.etiquette}>{joueur.poste}</p>
        <h3
          className="mt-1 text-4xl uppercase"
          style={{ fontFamily: "var(--titre)", fontWeight: 800, fontStretch: "var(--titre-largeur)", lineHeight: 0.9 }}
        >
          Prénom Nom
        </h3>
        <p className="mt-2 text-sm text-[var(--craie-douce)]">
          N° {joueur.numero} · 24 ans · 1,88 m
        </p>
        {joueur.phrase ? <p className="mt-3 text-sm leading-relaxed">{joueur.phrase}</p> : null}
      </div>
    </li>
  );
}

export function Portraits() {
  return (
    <section className="border-t border-[var(--trait)] px-4 py-20 sm:px-10 lg:px-16">
      <p className={styles.etiquette}>03 · Portraits</p>
      <h2 className="mt-3 max-w-[24ch] text-3xl font-semibold text-balance sm:text-4xl">
        Des photos inégales, un traitement unique
      </h2>
      <p className="mt-4 max-w-[62ch] leading-relaxed text-[var(--craie-douce)]">
        Photo de remplacement, prise sur le site du club, en attendant une
        photo de la D2. Les cartes sont toutes découpées dans cette seule
        photo de groupe, par un point de visage : c&apos;est le pire cas, et
        il tient. Survole une carte pour voir la couleur réelle.
      </p>

      <ul className="mt-12 grid gap-6 md:grid-cols-3">
        {[{ id: "", nom: "Photo d'origine" }, ...FILTRES].map((f) => (
          <li key={f.nom}>
            <Image
              src={PHOTO}
              alt=""
              width={1024}
              height={768}
              sizes="(min-width: 768px) 33vw, 100vw"
              className="h-auto w-full rounded-sm"
              style={f.id ? { filter: `url(#${f.id})` } : undefined}
            />
            <p className="mt-3 text-sm text-[var(--craie-douce)]">{f.nom}</p>
          </li>
        ))}
      </ul>

      {FILTRES.map((f) => (
        <div key={f.id} className="mt-16">
          <p className="text-sm font-semibold">Cartes · {f.nom}</p>
          <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
            {JOUEURS.map((j) => (
              <Carte key={j.numero} joueur={j} filtre={f.id} />
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
