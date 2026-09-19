import { NOM_DU_SITE } from "@/lib/site";

/**
 * Page d'accueil provisoire. Sa vraie composition est decidee et documentee
 * dans PLAN.md : dernier episode et prochain match en tete, puis dernier
 * resultat, actualites et bandeau partenaires. Elle sera ecrite quand les
 * ecrans d'administration qui l'alimentent existeront.
 */
export default function Accueil() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col justify-center px-4 py-16">
      <p className="text-sm font-medium tracking-widest text-[var(--color-encre-tenue)] uppercase">
        Nom provisoire
      </p>

      <h1 className="mt-3 font-[family-name:var(--font-titre)] text-5xl leading-[1.05] text-balance sm:text-6xl">
        {NOM_DU_SITE}
      </h1>

      <p className="mt-6 max-w-prose text-lg leading-relaxed text-[var(--color-encre-douce)]">
        L&apos;effectif poste par poste, le calendrier, les résultats et la
        série. Les informations qui se consultent et qui durent, à côté de ce
        que racontent déjà les réseaux.
      </p>

      <div className="accent-degrade mt-10 h-px w-24" />

      <p className="mt-10 text-sm leading-relaxed text-[var(--color-encre-tenue)]">
        Site en construction. Les fondations sont posées : base de données,
        comptes et rôles. Les pages publiques arrivent ensuite.
      </p>
    </main>
  );
}
