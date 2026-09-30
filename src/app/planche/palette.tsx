import styles from "./planche.module.css";

/*
 * Le nuancier, avec les contrastes calcules ici plutot que recopies : si une
 * valeur change dans la liste, le chiffre affiche suit. La liste reprend les
 * jetons de globals.css ; les deux doivent rester d'accord.
 */

type Teinte = { jeton: string; nom: string; valeur: string; role: string };

const TEINTES: Teinte[] = [
  { jeton: "nuit", nom: "Nuit", valeur: "#16101a", role: "Le fond, noir violacé du maillot" },
  { jeton: "nuit-surface", nom: "Surface", valeur: "#1f1724", role: "Cartes, blocs" },
  { jeton: "nuit-releve", nom: "Relevée", valeur: "#2a2030", role: "Survols, badges" },
  { jeton: "nuit-violet", nom: "Chapitre violet", valeur: "#2b1b30", role: "Le fond des matchs" },
  { jeton: "nuit-trait", nom: "Filet", valeur: "#3a2e40", role: "Bordures, séparations" },
  { jeton: "craie", nom: "Craie", valeur: "#f1ece6", role: "Texte, toute information" },
  { jeton: "craie-douce", nom: "Craie douce", valeur: "#b9adb8", role: "Texte secondaire" },
  { jeton: "craie-tenue", nom: "Craie tenue", valeur: "#958a95", role: "Légendes seulement" },
  { jeton: "turquoise", nom: "Turquoise", valeur: "#64979d", role: "L'équipe, liens, boutons" },
  { jeton: "turquoise-clair", nom: "Turquoise clair", valeur: "#8fbcc1", role: "Traits, petits textes" },
  { jeton: "violet", nom: "Violet", valeur: "#66486b", role: "Les matchs, en aplat" },
  { jeton: "jaune", nom: "Jaune ballon", valeur: "#f2bf2e", role: "Direct, nouveau, focus" },
  { jeton: "jaune-eteint", nom: "Jaune éteint", valeur: "#b8922c", role: "États secondaires" },
  { jeton: "led", nom: "LED", valeur: "#ffae1f", role: "Objets lumineux seulement" },
  { jeton: "erreur", nom: "Erreur", valeur: "#e0707e", role: "Erreurs de saisie, rien d'autre" },
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

const NUIT = "#16101a";

export function Palette() {
  return (
    <section className="colonne-large py-20">
      <p className={styles.etiquette}>01 · Palette</p>
      <h2 className="titre-affiche mt-3 text-5xl sm:text-7xl">Le gymnase, le soir</h2>
      <p className="mt-4 max-w-[62ch] leading-relaxed text-[var(--color-craie-douce)]">
        Un noir tiré du maillot, les couleurs du maillot telles qu&apos;elles sont, et de la
        lumière seulement sur ce qui éclaire vraiment. Le chiffre donne le contraste sur la nuit ;
        sous 4,5, la teinte ne porte jamais de texte courant.
      </p>

      <ul className="mt-12 grid grid-cols-2 gap-px border border-[var(--color-nuit-trait)] bg-[var(--color-nuit-trait)] sm:grid-cols-3 lg:grid-cols-5">
        {TEINTES.map((t) => {
          const c = contraste(t.valeur, NUIT);
          return (
            <li key={t.jeton} className="bg-[var(--color-nuit)]">
              <div className="h-24" style={{ background: t.valeur }} />
              <div className="p-4">
                <p className="font-semibold">{t.nom}</p>
                <p className="mt-1 font-mono text-xs text-[var(--color-craie-tenue)]">
                  --color-{t.jeton} · {t.valeur}
                </p>
                <p className="mt-2 text-sm text-[var(--color-craie-douce)]">{t.role}</p>
                {c > 1.6 ? (
                  <p className="mt-2 text-xs font-semibold tabular-nums">
                    {c.toFixed(1).replace(".", ",")} pour 1{" "}
                    <span className="font-normal text-[var(--color-craie-tenue)]">
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
