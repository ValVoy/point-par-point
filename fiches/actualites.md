# Fiche , les actualités (liste, article, bloc de l'accueil)

> Fiche de page, selon la méthode des trois casquettes (`CLAUDE.md`). Rédigée le 30-09-2026 à
> 16:35, en autonomie. Veille : `veille.md`, section 16. Palette : `palette.md`, variante « net ».

## 1. Direction artistique

### L'intention

**Le programme de match qu'on lit en tribune** : un titre d'affiche, une date en toutes lettres,
un chapô qui donne l'essentiel, puis un texte qui se lit sans effort sur le noir. Peu d'articles,
donc une liste datée plutôt qu'une grille : elle tient avec un article comme avec cinquante.

### Les références, et ce qu'on en prend

| Référence | Ce qu'on prend |
|---|---|
| Paris Basketball | La lecture sur fond sombre : 18 px, interlignage 1,6, une colonne étroite |
| The Guardian | Le chapô distinct du corps, la date complète, les liens dans le texte |
| Toulouse FC (Awwwards 2023) | Titre condensé et date « Publié le » sur fond sombre ; pas son chapô condensé ni répété |
| Arsenal | « Autres actualités » en fin de page ; pas ses 110 caractères par ligne |
| Contre-exemples | Articles sans date (Toulouse FC en liste, Arsenal, The Players' Tribune), texte de juin laissé en tête fin septembre (The Players' Tribune), rubrique vide (Tours VB) |

## 2. UX et UI

### La liste, `/actualites`

1. **Titre** « Les actualités ».
2. **La plus récente en grand** : l'image si elle existe (3:2), sinon le titre seul en condensé
   géant ; « Publié le … », le chapô.
3. **Les autres en liste** d'une colonne : date en toutes lettres, titre, chapô sur deux lignes.
4. **Rubrique vide** : une phrase et deux liens, vers les matchs et la série. Jamais une page nue.

### La page d'un article, `/actualites/<slug>`

Titre condensé, « Publié le … », le chapô plus grand et plus clair, l'image si elle existe, le
corps dans une colonne de 34 em (60 à 68 caractères), intertitres condensés, liens soulignés en
turquoise clair. Puis **Partager** (partage natif du téléphone, sinon copie du lien), et
**Autres actualités** (les deux voisines).

### Le bloc de l'accueil

Jusqu'à trois articles en lignes datées et « Toutes les actualités ». **Masqué** s'il n'y a rien,
ou si le plus récent a plus de 90 jours : mieux vaut pas de bloc qu'un bloc qui montre l'abandon.

### Lecture sur fond sombre

Corps en 18 px (1,125 rem), interlignage 1,7, couleur craie douce relevée (pas de blanc pur sur
un long texte), 34 em de large, le chapô dans la même colonne. Condensé seulement pour les titres
et intertitres.

### Navigation

Quatre rubriques : sur téléphone, elles passent sous le nom du site ; le pied de page les reprend
toutes.

## 3. Fullstack

- **Données** : `lib/actualites-publiques.ts` (publiées seulement, voisines, anciennes adresses
  en 308 via `anciens_slugs_actualite`, migration additive 0004).
- **Rendu** : `TexteLeger`, déjà sûr (seuls les liens http et https deviennent des liens,
  testé), habillé par une classe `texte-article`.
- **Partage** : un petit composant client, `navigator.share` ou copie dans le presse-papiers.
- **Pas encore** : étiquettes de catégorie et bloc « Lié à » (match, joueur, épisode), faute de
  donnée en base ; à prévoir dans l'administration si l'ami le souhaite.
