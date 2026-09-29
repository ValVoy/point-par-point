import styles from "./planche.module.css";

type Teinte = { nom: string; valeur: string; role: string; mesuree?: string };

const TEINTES: Teinte[] = [
  { nom: "Nuit", valeur: "#0a0d1a", role: "Fond du site" },
  { nom: "Nuit surface", valeur: "#11162a", role: "Bandeaux, cartes" },
  { nom: "Nuit relevée", valeur: "#1a2140", role: "Survols, cadres vides" },
  {
    nom: "Turquoise",
    valeur: "#3ec5cc",
    role: "La seule couleur vive",
    mesuree: "#64979d",
  },
  {
    nom: "Turquoise foncé",
    valeur: "#1b7a82",
    role: "Motif, états secondaires",
    mesuree: "#406466",
  },
  { nom: "Violet", valeur: "#5e3f98", role: "Motif, libéro, rare", mesuree: "#66486b" },
  { nom: "Craie", valeur: "#eef2f4", role: "Texte" },
  { nom: "Craie douce", valeur: "#a3adc0", role: "Texte secondaire" },
];

export function Palette() {
  return (
    <section className="px-4 py-20 sm:px-10 lg:px-16">
      <p className={styles.etiquette}>01 · Palette</p>
      <h2 className="mt-3 max-w-[22ch] text-3xl font-semibold text-balance sm:text-4xl">
        Le maillot, ravivé pour l&apos;écran
      </h2>
      <p className="mt-4 max-w-[62ch] leading-relaxed text-[var(--craie-douce)]">
        Les teintes mesurées sur la photo sont ternies par l&apos;éclairage du
        gymnase. Les teintes d&apos;écran gardent la même couleur avec plus
        d&apos;éclat. Le petit carré montre la mesure brute.
      </p>

      <ul className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-[var(--trait)] bg-[var(--trait)] sm:grid-cols-4">
        {TEINTES.map((t) => (
          <li key={t.nom} className="bg-[var(--nuit)]">
            <div className="relative h-28" style={{ background: t.valeur }}>
              {t.mesuree ? (
                <span
                  className="absolute right-3 bottom-3 size-8 rounded-sm ring-1 ring-black/30"
                  style={{ background: t.mesuree }}
                  title={`Mesurée sur la photo : ${t.mesuree}`}
                />
              ) : null}
            </div>
            <div className="p-4">
              <p className="font-semibold">{t.nom}</p>
              <p className="mt-1 font-mono text-xs text-[var(--craie-douce)]">
                {t.valeur}
                {t.mesuree ? ` · photo ${t.mesuree}` : ""}
              </p>
              <p className="mt-2 text-sm text-[var(--craie-douce)]">{t.role}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
