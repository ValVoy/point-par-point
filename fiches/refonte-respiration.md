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
