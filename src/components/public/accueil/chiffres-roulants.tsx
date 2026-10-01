/**
 * Un numero en chiffres de tableau d'affichage (fiche
 * fiches/accueil-porte-entree.md) : chaque chiffre est une colonne de 0 a 9
 * dans une fenetre d'un chiffre de haut, decalee jusqu'au bon. Le rendu
 * serveur montre deja le bon numero ; `EquipeEnMouvement` fait rouler la
 * colonne de 0 jusqu'a lui, en translation seulement. Purement visuel : le
 * numero reel est dit ailleurs, en texte.
 */
export function ChiffresRoulants({ valeur }: { valeur: number }) {
  return (
    <span aria-hidden="true" className="inline-flex leading-none tabular-nums">
      {String(valeur)
        .split("")
        .map((chiffre, i) => (
          <span key={i} className="inline-block h-[1.1em] overflow-hidden">
            <span
              data-roule
              data-chiffre={chiffre}
              style={{ transform: `translateY(${-10 * Number(chiffre)}%)` }}
              className="flex flex-col"
            >
              {"0123456789".split("").map((c) => (
                <span key={c} className="flex h-[1.1em] items-center justify-center">
                  {c}
                </span>
              ))}
            </span>
          </span>
        ))}
    </span>
  );
}
