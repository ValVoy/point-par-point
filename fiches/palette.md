# Fiche , la palette

> Fiche du système de design, selon la méthode des trois casquettes (`CLAUDE.md`). Elle remplace la
> palette nuit et turquoise du 29-09-2026, jugée « beaucoup trop site IA » le 30-09-2026.
>
> Rédigée le 30-09-2026 à partir de deux salves d'arbitrages et de la veille (section 10 de
> `veille.md`). **Validée le 30-09-2026 à 10:15.**

## 1. Direction artistique

### L'intention

Le site est **un programme de match imprimé** : un papier clair, trois encres, et une touche de
jaune qui n'apparaît que là où il se passe quelque chose. Les couleurs sont celles du tissu du
maillot, telles qu'elles sont, sourdes : c'est leur manque d'éclat qui les rend vraies. On quitte
l'écran lumineux pour l'objet qu'on garde après le match.

Ce que ça raconte du volley : le jaune est le ballon. Là où il est, le regard va, comme sur le
terrain.

### Les références, et ce qu'on en prend

| Référence | Ce qu'on prend |
|---|---|
| Munich 1972, Otl Aicher | La palette est une règle écrite, avec ses exclusions |
| Veikkausliiga 2025, Bond | Les bandeaux pleine largeur comme bandes d'écharpe |
| Lando Norris, 2025 | Chaque couleur vive en deux versions, aplat et papier |
| Wimbledon | Deux couleurs de club, et des états en voiles neutres |
| Mailchimp | Le jaune n'est jamais un texte |
| Aesop | Le texte sur aplat sombre est le papier lui-même |

### Les exclusions (ce que le site ne fait jamais)

- Pas de fond sombre bleuté, pas de halo, pas de lueur, pas de dégradé, pas d'ombre floue.
- Pas de blanc pur (`#ffffff`), ni pour les cartes ni pour les champs de formulaire.
- Pas de bleu roi : avec le jaune, c'est la marque d'un ballon.
- Pas de quatrième couleur, y compris pour les victoires et défaites (voir 2).
- Pas de vieillissement de pacotille : ni papier jauni, ni taches, ni bords déchirés.

## 2. UX et UI

### Les valeurs

Contrastes mesurés (critère WCAG, 4,5 pour 1 exigé pour le texte courant, 3 pour 1 pour les gros
titres et les éléments d'interface).

| Rôle | Jeton | Valeur | Contraste sur `papier` |
|---|---|---|---|
| Fond, papier de programme | `papier` | `#f8f4ea` | |
| Second papier (cartes, champs, lignes alternées) | `papier-creuse` | `#efe9dc` | |
| Texte, encre violette | `encre` | `#1f1622` | 16,0 |
| Texte secondaire | `encre-douce` | `#4b404e` | 8,9 |
| Légendes, texte discret | `encre-tenue` | `#6b6070` | 5,4 |
| Filets | `trait` | `#ddd5c6` | |
| Turquoise du maillot, aplat | `turquoise` | `#64979d` | 3,0 : aplat seulement |
| Turquoise d'encre, liens et boutons | `accent` | `#2d5f65` | 6,5 |
| Violet du maillot | `violet` | `#66486b` | 7,1 |
| Jaune du ballon, aplat | `jaune` | `#f2bf2e` | 1,6 : aplat seulement |
| Ocre, jaune pour petits éléments sur papier | `ocre` | `#7a5c00` | 5,7 |

Le papier passe de `#f4efe5` (première proposition) à `#f8f4ea` : la veille met en garde contre le
crème qui vire au sépia sur les longues pages comme l'effectif ou le calendrier. La chaleur est
portée par les bandeaux, pas par le fond.

### Les règles d'usage

- **Proportions** : environ 70 % de papier, 25 % de turquoise et violet, moins de 5 % de jaune.
- **Bandeaux** : rythme papier, couleur, papier. Jamais deux bandeaux de couleur en contact, et
  jamais turquoise contre violet (écart de clarté de 2,4 pour 1 seulement, la limite se brouille).
- **Texte sur aplat** : sur turquoise, l'encre (5,4 pour 1) ; sur violet, le papier (7,1 pour 1) ;
  sur jaune, l'encre (10,3 pour 1). Le papier sur turquoise ne sert qu'aux très gros titres.
- **Jaune** : bouton principal, balle de set, score en cours, ballon, fond de lien au survol.
  Jaune sur violet (4,5 pour 1) seulement pour les gros titres.
- **États** : survol = un cran plus foncé de la même teinte, ou un voile d'encre translucide
  identique sur toutes les couleurs. Changement de couleur en 80 ms.
- **Focus clavier** : un contour d'encre de 2 px décalé de 2 px, sur toutes les surfaces. Jamais en
  jaune sur papier (1,6 pour 1, invisible).
- **Victoire et défaite** : codées par la forme et la lettre, pas par une couleur (voir décisions).
- **Tableaux de données** : lignes alternées en `papier-creuse`, couleur du club en en-tête
  seulement, vainqueur marqué par la graisse.
- **Photos** : en surimpression, encre sur turquoise ou encre sur violet (`mix-blend-mode:
  multiply`), jamais en couleurs brutes dans un bandeau.
- **Grain** : bruit SVG fixe, opacité 3 à 5 %, sur le site public seulement, jamais animé.
- **Administration** : mêmes jetons, sans grain ni surimpression.

### Lisibilité en plein soleil

Tout texte qui porte une information (score, date, lieu, adversaire) est en `encre`, jamais en
`encre-tenue`. L'écart entre `papier` et `papier-creuse` ne sert jamais seul à porter un sens.

## 3. Fullstack

- **Préserver l'intro validée** : elle part dans `src/components/public/intro-nuit/`, ses couleurs
  de nuit figées en variables locales au composant. Elle ne dépend plus des jetons globaux. Une
  étiquette git `intro-nuit-v1` marque le commit.
- **Jetons** : `globals.css` perd les jetons `nuit`, `nuit-*`, `craie`, `craie-douce`,
  `turquoise-clair` ; `papier`, `encre`, `accent`, `trait` changent de valeur ; `jaune`, `ocre`,
  `violet` et `turquoise` (réel) entrent. Les usages recensés sont repris un par un.
- **Couleurs écrites en dur** retirées : lueurs du tableau de score, fond `#05060c`, planche.
- **Tableau du prochain match** : aplats imprimés, chiffres en encre sur papier, balle de set en
  pastille jaune.
- **Planche** : nuancier réécrit avec les nouvelles valeurs et les contrastes affichés.
- **Vérification** : tests, `tsc`, lint, `next build`, puis rendu à l'écran de la planche, de
  l'administration et du tableau de score, en mobile et en grand écran.
- **Ensuite, fiche séparée** : la nouvelle intro, salle dessinée à l'encre sur papier.

## Décisions du 30-09-2026 à 10:15

Fiche validée par l'utilisateur, avec ces trois arbitrages.

1. **Victoire et défaite** : victoire en pastille pleine à l'encre, « V » en réserve de papier,
   score en gras ; défaite en pastille contour, « D », score en graisse normale. La lettre porte le
   sens, la forme le confirme.
2. **Une fonction par couleur** : turquoise pour l'équipe (effectif, joueurs), violet pour les
   matchs (résultats, calendrier), jaune pour ce qui est en direct ou nouveau.
3. **Portraits** : surimpression encre sur la couleur de fonction, donc encre sur turquoise pour
   l'effectif. Remplace la trichromie nuit du 29-09-2026.
