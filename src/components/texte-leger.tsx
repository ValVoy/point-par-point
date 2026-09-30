import { analyserTexteLeger, type Enligne } from "@/lib/texte-leger";

/**
 * Rendu du texte leger en elements React. Aucun HTML n'est injecte : chaque
 * morceau devient un element, et React echappe le texte. Sert a l'apercu de
 * l'administration et servira aux pages publiques, qui l'habilleront par
 * `className` sans toucher a l'analyse.
 */

function Morceaux({ contenu }: { contenu: Enligne[] }) {
  return contenu.map((morceau, index) => {
    switch (morceau.type) {
      case "texte":
        return morceau.valeur;
      case "saut":
        return <br key={index} />;
      case "gras":
        return (
          <strong key={index}>
            <Morceaux contenu={morceau.contenu} />
          </strong>
        );
      case "italique":
        return (
          <em key={index}>
            <Morceaux contenu={morceau.contenu} />
          </em>
        );
      case "lien": {
        // Un lien vers le site lui-meme reste dans l'onglet ; seul un site tiers en ouvre un nouveau.
        const site = process.env.NEXT_PUBLIC_SITE_URL;
        const externe = morceau.href.startsWith("http") && !(site && morceau.href.startsWith(site));
        return (
          <a
            key={index}
            href={morceau.href}
            {...(externe ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            <Morceaux contenu={morceau.contenu} />
          </a>
        );
      }
    }
  });
}

export function TexteLeger({
  texte,
  className,
}: {
  texte: string;
  className?: string;
}) {
  const blocs = analyserTexteLeger(texte);
  return (
    <div className={className}>
      {blocs.map((bloc, index) =>
        bloc.type === "intertitre" ? (
          <h2 key={index}>
            <Morceaux contenu={bloc.contenu} />
          </h2>
        ) : (
          <p key={index}>
            <Morceaux contenu={bloc.contenu} />
          </p>
        ),
      )}
    </div>
  );
}
