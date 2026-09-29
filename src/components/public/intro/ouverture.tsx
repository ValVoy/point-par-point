import { TITRE } from "../titre-traces";
import { AnimationOuverture } from "./animation-ouverture";
import { INTRO_GRAND, INTRO_PORTRAIT } from "./geometrie-intro";
import { Salle } from "./salle";
import { SCRIPT_AVANT_AFFICHAGE } from "./script-intro";

/**
 * L'ouverture de l'accueil (fiche `fiches/accueil-ouverture.md`). Rendue par
 * le serveur dans son etat final ; l'intro n'est qu'une couche au-dessus.
 *
 * Le script en ligne vient en premier : execute pendant la lecture du HTML,
 * avant le premier affichage, il decide si l'intro joue. C'est ce qui evite
 * qu'un visiteur l'ayant deja vue en apercoive une image.
 */
export function Ouverture({ sousTitre }: { sousTitre: string }) {
  const suite = (
    <div className="text-center">
      <p className="mx-auto max-w-[46ch] text-base leading-relaxed text-[var(--color-craie-douce)] md:text-lg">
        {sousTitre}
      </p>
      <p aria-hidden="true" className="mt-6 text-xs font-semibold tracking-[0.25em] text-[var(--color-turquoise)] uppercase">
        Défiler
      </p>
    </div>
  );

  return (
    <section aria-labelledby="titre-du-site" className="relative flex min-h-svh flex-col justify-center bg-[var(--color-nuit)] text-[var(--color-craie)]">
      <script dangerouslySetInnerHTML={{ __html: SCRIPT_AVANT_AFFICHAGE }} />
      <h1 id="titre-du-site" className="sr-only">
        {TITRE}
      </h1>
      <AnimationOuverture>
        <Salle gi={INTRO_GRAND} variante="grand">
          {suite}
        </Salle>
        <Salle gi={INTRO_PORTRAIT} variante="portrait">
          {suite}
        </Salle>
      </AnimationOuverture>
    </section>
  );
}
