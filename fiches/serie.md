# Fiche , la série (liste et page d'un épisode)

> Fiche de page, selon la méthode des trois casquettes (`CLAUDE.md`). Rédigée le 30-09-2026 à
> 15:55, en autonomie. Veille : `veille.md`, section 14. Palette : `palette.md`, variante « net ».

## 1. Direction artistique

### L'intention

La série est **le récit de la saison**, et le site en est le sommaire. Une liste numérotée où le
grand numéro de l'épisode rythme la page comme un numéro de maillot, un titre qui raconte, et le
match qui s'y joue, relié à sa page. Aucun site de série observé ne fait ce lien : c'est notre
avantage.

La lumière reste aux tableaux : le match raconté par un épisode s'affiche en tableau LED sur la
page de l'épisode, nulle part ailleurs dans la série. Le jaune sert à « S'abonner » et à
« Nouveau », rien d'autre.

### Les références, et ce qu'on en prend

| Référence | Ce qu'on prend |
|---|---|
| Red Bull TV, Bragantino | Une accroche d'une phrase ; la ligne de métadonnées de l'épisode ; les titres-récits |
| Welcome to Wrexham (FX) | La liste éditoriale numérotée, sans grille de vignettes |
| The Immortals (Awwwards 2026) | Le grand numéro, le titre-récit, deux données sèches (adversaire, score) |
| The Last Dance For Glory (Awwwards 2026) | L'étiquette de résultat en capitales espacées |
| Contre-exemples | Aperçu vidéo lancé d'office (Netflix, Red Bull), « vidéos associées » en vrac (Red Bull, Wrexham AFC), page vidéo sans lien vers le match (Wrexham AFC) |

## 2. UX et UI

### La liste, `/serie`

1. **En-tête** : « La série », une accroche, « S'abonner à la série » en jaune (premier appel).
2. **L'épisode vedette** : le plus récent, grande vignette, marque « Nouveau » s'il a moins de
   quatorze jours, numéro, titre, date, étiquette du match.
3. **Les autres épisodes**, en liste numérotée : grand numéro, titre, résumé en deux lignes, date
   et étiquette du match. Toute la ligne mène à la page de l'épisode.
4. **Un rappel d'abonnement** en une ligne, en pied de liste (second et dernier appel).

### La page d'un épisode, `/serie/<slug>`

1. **« Toute la série »**, puis la ligne « Épisode 3 · 12 septembre 2026 ».
2. **Le lecteur** en façade : miniature servie par notre serveur, YouTube au clic seulement.
3. **Le titre et le résumé.**
4. **Le match raconté** : son tableau LED (score final, ou compte à rebours s'il est à venir) et
   « Voir le match ». Le lien est réciproque : la page du match mène à l'épisode.
5. **L'abonnement**, une carte après le visionnage.
6. **Épisode précédent et épisode suivant**, titres compris ; aucun contenu « associé » en vrac.

### Les états

- **Aucun épisode publié** : « La série arrive bientôt », et le bouton d'abonnement.
- **Épisode sans match** : le bloc du match disparaît ; épisode sans résumé : rien à la place.
- **Durée, chapitres, prochain épisode annoncé** : pas en base, donc pas affichés (principe 3).
- **Ancienne adresse d'un épisode** : redirection 308 (table `anciens_slugs_episode`).
- **Chaîne non renseignée** : les boutons « S'abonner » disparaissent.

### Mobile et accessibilité

Liste en une colonne, numéros réduits d'un cran, lignes entièrement cliquables avec un nom complet.
La façade vidéo est un bouton nommé ; le focus passe au lecteur après le clic.

## 3. Fullstack

- **Données** : `lib/serie.ts` (liste publiée avec match visible, un épisode et ses voisins mis en
  cache par requête, anciennes adresses). Garde de forme sur l'adresse avant toute requête.
- **Composants** : `LecteurEpisode` réutilisé, `TableauResultat` et `TableauProchainMatch` pour le
  match raconté, rubrique « La série » dans `EnTete`, lien réciproque depuis la page d'un match et
  depuis l'accueil.
- **Migration** : `0003_anciens-slugs-episode`, additive, appliquée en développement.
- **Vérification** : tests, `tsc`, lint, rendu en 390 et 1440 px, redirection testée, critique à
  froid.
