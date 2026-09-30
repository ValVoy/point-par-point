import styles from "./planche.module.css";

/*
 * Le nuancier, avec les contrastes calcules ici plutot que recopies : si une
 * valeur change dans la liste, le chiffre affiche suit. La liste reprend les
 * jetons de globals.css ; les deux doivent rester d'accord.
 */

type Teinte = { jeton: string; nom: string; valeur: string; role: string };

const TEINTES: Teinte[] = [
  { jeton: "papier", nom: "Papier", valeur: "#f8f4ea", role: "Le fond, 70 % de la surface" },
  { jeton: "papier-creuse", nom: "Second papier", valeur: "#efe9dc", role: "Cartes, lignes alternées" },
  { jeton: "champ", nom: "Champ", valeur: "#fdfbf6", role: "Champs de saisie" },
  { jeton: "trait", nom: "Filet", valeur: "#ddd5c6", role: "Bordures, séparations" },
  { jeton: "encre", nom: "Encre", valeur: "#1f1622", role: "Texte, toute information" },
  { jeton: "encre-douce", nom: "Encre douce", valeur: "#4b404e", role: "Texte secondaire" },
  { jeton: "encre-tenue", nom: "Encre tenue", valeur: "#6b6070", role: "Légendes seulement" },
  { jeton: "turquoise", nom: "Turquoise", valeur: "#64979d", role: "L'équipe, en aplat" },
  { jeton: "accent", nom: "Turquoise d'encre", valeur: "#2d5f65", role: "Liens, boutons" },
  { jeton: "violet", nom: "Violet", valeur: "#66486b", role: "Les matchs, aplat ou texte" },
  { jeton: "jaune", nom: "Jaune ballon", valeur: "#f2bf2e", role: "Direct, nouveau : moins de 5 %" },
  { jeton: "ocre", nom: "Ocre", valeur: "#7a5c00", role: "Le jaune en petit, sur papier" },
  { jeton: "erreur", nom: "Erreur", valeur: "#a1303f", role: "Erreurs de saisie, rien d'autre" },
];

function luminance(hex: string) {
  const canal = (i: number) => {
    const v = parseInt(hex.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * canal(1) + 0.7152 * canal(3) + 0.0722 * canal(5);
}

export function contraste(a: string, b: string) {
  const [x, y] = [luminance(a), luminance(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

const PAPIER = "#f8f4ea";

export function Palette() {
  return (
    <section className="colonne-large py-20">
      <p className={styles.etiquette}>01 · Palette</p>
      <h2 className="titre-affiche mt-3 text-5xl sm:text-7xl">Un papier, trois encres, un ballon</h2>
      <p className="mt-4 max-w-[62ch] leading-relaxed text-[var(--color-encre-douce)]">
        Les couleurs du maillot telles qu&apos;elles sont, sourdes. Le chiffre donne le contraste
        sur le papier ; sous 4,5, la teinte ne porte jamais de texte courant.
      </p>

      <ul className="mt-12 grid grid-cols-2 gap-px border border-[var(--color-trait)] bg-[var(--color-trait)] sm:grid-cols-3 lg:grid-cols-5">
        {TEINTES.map((t) => {
          const c = contraste(t.valeur, PAPIER);
          return (
            <li key={t.jeton} className="bg-[var(--color-papier)]">
              <div className="h-24" style={{ background: t.valeur }} />
              <div className="p-4">
                <p className="font-semibold">{t.nom}</p>
                <p className="mt-1 font-mono text-xs text-[var(--color-encre-tenue)]">
                  --color-{t.jeton} · {t.valeur}
                </p>
                <p className="mt-2 text-sm text-[var(--color-encre-douce)]">{t.role}</p>
                {c > 1.3 ? (
                  <p className="mt-2 text-xs font-semibold tabular-nums">
                    {c.toFixed(1).replace(".", ",")} pour 1{" "}
                    <span className="font-normal text-[var(--color-encre-tenue)]">
                      {c >= 4.5 ? "texte" : c >= 3 ? "gros titres, aplat" : "aplat seulement"}
                    </span>
                  </p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
