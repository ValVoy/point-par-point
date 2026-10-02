# Fiche , la refonte « trop tassé » : le système, la Série, les Matchs

> Fiche de refonte, selon la méthode des trois casquettes (`CLAUDE.md`). Rédigée le 01-10-2026 à
> 23:25. Veille : `veille.md`, section 19 (vidéos, respiration, matchs). Demande de l'utilisateur :
> « tout est trop tassé » ; périmètre : tout le site public, par étapes, en commençant par le
> système, puis la Série et les Matchs.

## 0. Le diagnostic (le directeur artistique UX, sur les pages actuelles)

- **Un seul motif de composition partout** : bloc à gauche, texte à droite, en moitié-moitié
  (épisode à la une, vidéo du match, tableau et salle). La page ne change jamais de forme.
- **Un rythme vertical uniforme** : chaque section a le même padding en haut et en bas (96 puis
  128 px). Rien ne signale l'entrée d'un chapitre ; tout est également espacé, donc tout paraît
  serré. C'est le constat central du graphiste : l'air vient de l'asymétrie.
- **Des titres de section en étiquette** : « TOUS LES ÉPISODES » en 12 px. La hiérarchie repose sur
  des filets, pas sur l'échelle.
- **La liste des épisodes est un tableau de texte** : les épisodes anciens n'ont pas d'image.
- **Des lignes de calendrier à 64 px** : sous les 80 à 130 px mesurés chez les clubs lisibles.

## 1. Le système (le graphiste, arbitré par le directeur artistique)

### Ce qu'on garde

- La **colonne large à 84rem** : la proposition de 75rem est écartée, l'utilisateur a demandé le
  20-09 un site plus large ; l'air vient du vertical et des pleines largeurs, pas d'une colonne
  plus étroite.
- La palette, Archivo, le motif, le tableau LED : rien ne change dans l'identité.

### Les jetons (dans `globals.css`, `@theme`)

| Jeton | Valeur | 390 px | 1440 px | Rôle |
|---|---|---|---|---|
| `--marge` | `clamp(1.25rem, 3.5vw, 3.5rem)` | 20 | 50 | Marge latérale (aujourd'hui 16 à 58) |
| `--largeur-lecture` | `38rem` | | 608 | Colonne de texte (aujourd'hui 62ch) |
| `--air-chapitre` | `clamp(6rem, 3rem + 12vw, 16rem)` | 95 | 221 | Le grand vide **avant** le titre d'un chapitre |
| `--titre-contenu` | `clamp(1.25rem, 0.75rem + 1.5vw, 2.5rem)` | 20 | 34 | Du titre à son contenu : serré |
| `--air-suite` | `clamp(3rem, 2rem + 4vw, 6rem)` | 48 | 90 | Entre deux blocs d'une même suite |
| `--gouttiere` | `clamp(0.875rem, 0.6rem + 1vw, 1.5rem)` | 14 | 24 | Écart entre cartes |

### L'échelle typographique

| Rôle | Valeur | 390 | 1440 | Aujourd'hui |
|---|---|---|---|---|
| Titre de page (h1) | `clamp(4rem, 1rem + 12vw, 12rem)` | 63 | 189 | 96 |
| Titre de chapitre (h2) | `clamp(2.75rem, 1.5rem + 5vw, 6.5rem)` | 44 | 96 | 48 à 60 |
| Chiffre géant (scores, jours, bilans) | `clamp(4rem, 2rem + 9vw, 10rem)` | 67 | 160 | variable |
| Titre de carte (h3) | `clamp(1.5rem, 1.1rem + 1.6vw, 2.5rem)` | 24 | 40 | 24 à 36 |
| Chapeau | `clamp(1.125rem, 1rem + 0.6vw, 1.5rem)`, interligne 1,4 | 19 | 24 | 18 |
| Corps | `clamp(1rem, 0.95rem + 0.25vw, 1.1875rem)`, interligne 1,55 | 16 | 19 | 16 à 18 |
| Étiquette | `0.8125rem`, capitales, interlettrage 0,15em | 13 | 13 | 12 |

Règle : aucun paragraphe sous 16 px, aucune étiquette sous 13 px, sur fond nuit.

### Les utilitaires de composition

- `chapitre` : `padding-top: var(--air-chapitre)` ; le titre est suivi de `--titre-contenu`.
  **Un chapitre ouvre grand, puis tout s'enchaîne serré.**
- `suite` : `margin-top: var(--air-suite)` pour les blocs liés.
- `bandeau` : pleine largeur, marge latérale seule, pour images, vidéos et tableaux.
- Fin de page : `--air-chapitre` avant le pied de page.

### Le mouvement du système

Les titres de chapitre entrent par un **volet en triangle** (clip-path qui découvre le titre en
biais, comme le motif du maillot), 500 ms, une fois. Il remplace la simple montée en opacité sur
les titres ; les blocs gardent leur révélation. Sous mouvement réduit : titre posé.

## 2. La Série (la page, l'épisode, le bloc de l'accueil)

### La page `/serie`

1. **Ouverture** : surtitre, « LA SÉRIE » au titre de page (189 px), chapeau d'une phrase, bouton
   S'abonner. À droite en grand écran, le compte des épisodes en chiffre géant (« 04 épisodes »).
2. **Le dernier épisode en bandeau** : façade 16:9 pleine colonne large (environ 1 300 px de large
   en 1440), dégradé nuit en pied, et dessus : « Épisode 04 » en étiquette, titre en h2, date. Le
   résumé et le match raconté passent dessous, en une ligne. Fini le moitié-moitié.
3. **Chapitre « Tous les épisodes »**, titre en h2, puis une **liste verticale, numérotée, du plus
   récent au plus ancien** (veille 19.1) :
   - vignette 16:9 de **40 % de la colonne** (environ 520 px en 1440) à gauche, texte à droite ;
   - « Épisode 03 » en étiquette turquoise, titre en h3 (40 px), résumé de 2 lignes, date et
     match raconté en pied ;
   - `--air-suite` entre deux épisodes, un filet ;
   - au téléphone, une carte empilée : vignette pleine largeur, puis le texte.
   **Chaque épisode a sa vignette** (miniature YouTube par l'optimiseur, déjà en place pour la
   une) : la liste cesse d'être un tableau de texte.
4. **L'annonce** (épisode sans numéro) : une ligne à part en fin de liste, « Avant la série ».

Mouvement propre : la vignette se découvre par un **volet en triangle** au défilement, puis passe du
gris à la couleur au survol, comme aujourd'hui.

### La page d'un épisode

Le lecteur d'abord, en **bandeau** (pleine colonne large, 16:9), puis le titre (h1 réduit à 6rem
max : un titre d'épisode est long), le résumé en chapeau, le match raconté en tableau LED, et
**« Épisode suivant »** mis en avant (carte large) avant « Tous les épisodes ».

### Le bloc de l'accueil

Le dernier épisode passe en **bandeau pleine largeur** (même composant que la page Série), le titre
superposé en pied, S'abonner et Toute la série dessous. Le repli sans épisode ne change pas.

## 3. Les Matchs (la page, la ligne, la page d'un match)

### La page `/matchs`

1. **Ouverture** : « LES MATCHS » au titre de page ; le **bilan en chiffres géants sur légendes
   minuscules** (veille 19.2, Williams) : « 3 V · 2 D », sets, domicile, extérieur.
2. **Le prochain match en bandeau** : le tableau LED pleine colonne large, actions dessous.
3. **Un chapitre par mois** : le mois en titre de chapitre (h2, 96 px), `--air-chapitre` avant,
   puis ses matchs serrés. Le filet « Aujourd'hui » reste.
4. **La ligne de match** (veille 19.3) : **96 px** en grand écran, **carte de 128 px** au téléphone,
   trois blocs seulement :
   - le jour : chiffre géant (64 px) et jour de la semaine ;
   - l'adversaire en h3 (« Contre X » ou « Chez X »), et en sur-titre la marque Domicile ou
     Extérieur puis la compétition ;
   - la case de droite : l'heure, ou « Horaire à confirmer » en turquoise, ou le score avec les sets
     en petit dessous (gagnés clairs, perdus atténués).
   - **Signal de lieu renforcé** (Racing 92) : à domicile, la ligne porte un fond légèrement plus
     clair et un filet turquoise à gauche ; à l'extérieur, fond nuit. La marque reste.

Mouvement propre : à l'entrée de chaque mois, **les jours roulent** jusqu'à leur valeur, avec les
chiffres de tableau déjà construits pour l'effectif, en vague, 600 ms au plus.

### La page d'un match

Ouverture : sur-titre compétition, « Contre X » au titre de page, date et heure (ou « horaire à
confirmer ») en chapeau. Puis le tableau en **bandeau**, la salle et l'itinéraire en suite, le match
dans la série en bandeau (même composant que l'épisode), et « Match suivant » en grande carte.

## 4. Fullstack

- **Étape 1, le système** : jetons et utilitaires dans `globals.css`, composant `TitreChapitre`
  (titre + volet), aucune page modifiée sauf l'adoption des jetons de marge et de lecture. Effet
  sur tout le site : marges et largeur de lecture, à vérifier page par page.
- **Étape 2, la Série** : `app/serie/page.tsx`, `components/public/serie/*`, page d'épisode,
  `bloc-serie.tsx` ; un composant `BandeauEpisode` partagé par la Série, l'accueil et la page match.
- **Étape 3, les Matchs** : `app/matchs/page.tsx`, `ligne-calendrier.tsx` (réécrite), bilan,
  page match.
- Chaque fichier sous 300 lignes ; aucune bibliothèque nouvelle ; `transform` et `opacity`
  seulement, `prefers-reduced-motion` avec état final propre.
- Vérification à chaque étape : tests, `tsc`, lint, `next build` ; écran en 390, 768, 1440 et
  1920 px, mesures de hauteur de ligne et de débordement ; puis critique à froid avant le push, qui
  part en production.

## 5. Écarts assumés et corrections, après la critique à froid du 01-10-2026

- **Le volet anime un clip-path**, exception écrite à la règle « transform et opacity » : une fois,
  500 ms, retiré ensuite. Un élément déjà à l'écran à l'arrivée n'est pas rejoué (il clignotait).
- **Les grands titres se coupent** (`overflow-wrap`, césure) au lieu de déborder au téléphone.
- **Le titre posé sur une vignette** : dégradé nuit plus dense en pied, étiquette en craie pleine,
  trois lignes au plus.
- **Niveaux de titre** : le dernier épisode est un h2 dans la page Série, chaque épisode de la liste
  un h3. Sur l'accueil, la façade est un bouton, qui ne peut pas contenir de titre : la section
  porte le sien.
- **Sans épisode numéroté**, les annonces tiennent la page seules (la première sous « Annonce »).
- **Étiquettes à 13 px partout** dans la Série, y compris l'étiquette du match raconté.
- **Validé par l'utilisateur le 01-10-2026** : sur la page d'un épisode, le titre vient avant le lecteur, et
  non l'inverse comme écrit en section 2. Le titre situe la vidéo avant qu'on la lance.
- Hors périmètre, corrigé au passage : la grille de `/contact` débordait à 1024 px ; elle passe en
  deux colonnes à partir de 1280 px.

## 6. Étape 3, les Matchs : écarts assumés après la critique à froid du 01-10-2026

- **Hauteur des lignes** : 116 px en grand écran (fiche : 96), 124 à 181 px au téléphone (fiche :
  128). Le jour en chiffres de tableau et son jour de semaine imposent cette hauteur ; la veille
  mesure 80 à 130 px chez les clubs lisibles. Au téléphone, la case heure ou score passe sous
  l'adversaire, la compétition (identique sur toutes les lignes) cède la place et reste dans le nom
  accessible, avec le détail des sets.
- **L'adversaire est un h3** sous le h2 du mois.
- **Le titre d'une page de match est au corps des chapitres** (96 px), pas au titre de page :
  « Chez Volley Club des Trois Rivières » ne tiendrait pas à 189 px.
- **« Match suivant »** reste un lien de navigation à deux colonnes, agrandi, pas une carte.
- **Le compte à rebours ne tourne que tableau à l'écran** : rien ne bouge pendant qu'on lit le
  calendrier.
- **Les jours qui roulent** gardent leur valeur finale tant que leur mois n'est pas atteint (rien
  ne montre « 00 » dans une capture ou une impression).
- **Étiquettes à 13 px** aussi sur le tableau du prochain match et l'en-tête du classement.

## 7. Étape 4, l'Effectif et la fiche joueur (fiche du 02-10-2026)

Arbitré par l'utilisateur le 02-10-2026, par questions à choix : le poste en colonne fixe, et une
ouverture avec titre géant et chiffre. L'intention de `fiches/effectif.md` ne change pas (le
vestiaire avant le match, des maillots alignés par poste, tous de la même taille) ; ses références
restent celles de cette fiche, aucune veille nouvelle n'a été faite pour cette étape.

### Le diagnostic, mesuré en capture à 1440 et 390 px

- Le titre de page à 96 px, la moitié de l'échelle (189 px).
- Cinq bandes identiques, une par poste, chacune ouverte par une étiquette de 12 px sur filet ; deux
  ou trois cartes par poste, si bien que **la moitié droite de l'écran reste vide** sur toute la
  hauteur.
- Le staff en petit, comme une note.
- Fiche joueur : la structure tient ; étiquettes à 12 px, « Parcours » et « Sur le terrain » en
  étiquettes au lieu de chapitres.

### La page `/effectif`

- **Ouverture**, comme la Série : sur-titre de l'équipe, « L'effectif » au titre de page (189 px),
  le chapeau, et à droite le **nombre de joueurs en chiffre géant** avec « joueurs cette saison » en
  étiquette. Ce n'est pas un compteur au sens de la fiche d'origine (aucun classement, aucune
  statistique) : c'est la taille du vestiaire. Les onglets de saison restent sous le chapeau.
- **Le poste en colonne fixe** (à partir de 1024 px) : chaque poste est une rangée à deux colonnes,
  `minmax(14rem, 1fr)` et `3fr`. À gauche, le nom du poste au corps des titres de carte (40 px),
  coupé proprement (« Réceptionneurs-attaquants » est long), et le nombre de joueurs du poste en
  chiffres turquoise ; cette colonne **reste en place pendant qu'on défile les joueurs du poste**
  (`position: sticky`), comme la marge d'un programme de match. À droite, les cartes, trois par
  ligne : plus grandes qu'aujourd'hui (environ 320 px contre 210), et plus de vide à droite.
- Les rangées se suivent à `--air-suite`, séparées par un filet craie ; le premier poste ouvre le
  chapitre.
- **Au téléphone**, le poste repasse au-dessus de ses cartes (titre de carte et nombre), deux
  cartes par ligne, rien de fixe.
- **Le staff** devient un chapitre : « Le staff » en titre de chapitre (96 px) avec son volet, puis
  les membres en titre de carte, le rôle en étiquette de 13 px, la présentation au corps.
- **États** : un poste sans joueur disparaît (inchangé) ; un effectif vide garde son message ; une
  saison passée s'affiche à l'identique, sans mention « actuel ».

### La fiche d'un joueur, `/effectif/<slug>`

- Le nom au titre de page, coupé proprement au téléphone ; le numéro turquoise devant reste.
- Poste, âge et taille : étiquettes à 13 px, valeurs inchangées.
- « Parcours » : bloc `suite`, titre au corps des titres de carte, texte au corps de lecture.
- « Sur le terrain en 2026-2027 » : un **chapitre** (titre de chapitre et volet), lignes inchangées.
- « L'effectif 2026-2027 », la navigation par numéros : bloc `suite`, titre en étiquette de 13 px,
  pastilles de 44 px au moins.

### Le mouvement

- Les titres de chapitre entrent par le volet du système, une fois.
- La colonne du poste qui reste en place est le seul mouvement nouveau, et ce n'est pas une
  animation : elle suit le défilement sans rien calculer.
- Les cartes gardent leur geste au survol ; rien de plus, conformément à « un geste propre par
  bloc ».

### Fullstack

- `app/effectif/page.tsx`, `components/public/effectif/cartes.tsx`, `app/effectif/[slug]/page.tsx`,
  enveloppe `Volets`, `TitreChapitre`.
- Le décalage de la colonne fixe se règle sur l'air du haut de page : l'en-tête ne suit pas le
  défilement.
- Vérification : tests, `tsc`, lint, build ; écran à 390, 768, 1024, 1440 et 1920 px, avec un
  poste à un joueur, un poste à quatre, et un nom très long ; aucun texte sous 13 px ; aucun
  débordement ; critique à froid par un agent qui ne l'a pas construite.
