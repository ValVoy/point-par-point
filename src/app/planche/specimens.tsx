import type { CSSProperties } from "react";
import { CANDIDATES, type Candidate } from "./polices";
import { Motif } from "./motif";
import styles from "./planche.module.css";

function styleTitre(c: Candidate): CSSProperties {
  return {
    fontFamily: c.famille,
    fontWeight: c.graisse,
    fontStretch: c.largeur,
    textTransform: "uppercase",
    lineHeight: 0.86,
    letterSpacing: "-0.01em",
  };
}

function Specimen({ candidate, rang }: { candidate: Candidate; rang: number }) {
  const titre = styleTitre(candidate);

  return (
    <article
      className={`relative overflow-hidden border-t border-[var(--trait)] px-4 py-16 sm:px-10 lg:px-16 ${
        rang % 2 === 1 ? "bg-[var(--nuit-surface)]" : ""
      }`}
    >
      <Motif className={styles.texture} fond="transparent" />

      <div className="relative flex flex-wrap items-baseline justify-between gap-4">
        <p className={styles.etiquette}>
          Candidate {candidate.id.toUpperCase()} · {candidate.nom}
        </p>
      </div>

      <div className="relative mt-8 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p style={titre} className="text-[clamp(4rem,13vw,11rem)]">
            Dép 2
          </p>
          <p style={titre} className="mt-2 text-[clamp(2.5rem,7vw,6rem)] text-[var(--turquoise)]">
            VF Francheville
          </p>
        </div>
        <p
          aria-hidden="true"
          style={{ ...titre, WebkitTextStroke: "1.5px var(--turquoise)" }}
          className="text-[clamp(8rem,22vw,16rem)] text-transparent"
        >
          11
        </p>
      </div>

      <div className="relative mt-12 grid gap-10 lg:grid-cols-2">
        <div>
          <h3 style={{ ...titre, textTransform: "none", lineHeight: 1 }} className="text-4xl">
            Le prochain match se joue samedi au gymnase du Bourg
          </h3>
          <p className="mt-4 max-w-[62ch] leading-relaxed text-[var(--craie-douce)]">
            Trois sets à un la semaine dernière, une réception enfin stable et
            un central qui a trouvé son timing. Texte courant en Hanken
            Grotesk : c&apos;est lui qui porte la lecture, la condensée ne sert
            qu&apos;aux titres et aux chiffres.
          </p>
        </div>
        <dl className="grid content-start gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-semibold text-[var(--craie)]">Pourquoi</dt>
            <dd className="mt-1 leading-relaxed text-[var(--craie-douce)]">{candidate.pourquoi}</dd>
          </div>
          <div>
            <dt className="font-semibold text-[var(--craie)]">Réserve</dt>
            <dd className="mt-1 leading-relaxed text-[var(--craie-douce)]">{candidate.reserve}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}

export function Specimens() {
  return (
    <section>
      <div className="px-4 pt-20 pb-10 sm:px-10 lg:px-16">
        <p className={styles.etiquette}>02 · Typographie</p>
        <h2 className="mt-3 max-w-[22ch] text-3xl font-semibold text-balance sm:text-4xl">
          Trois condensées libres, le même texte
        </h2>
        <p className="mt-4 max-w-[62ch] leading-relaxed text-[var(--craie-douce)]">
          À comparer sur le nom de l&apos;équipe, un numéro de maillot et un
          titre de phrase. Regarde aussi en mobile : c&apos;est là qu&apos;une
          condensée gagne ou perd.
        </p>
      </div>
      {CANDIDATES.map((c, i) => (
        <Specimen key={c.id} candidate={c} rang={i} />
      ))}
    </section>
  );
}
