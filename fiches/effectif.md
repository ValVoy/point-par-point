# Fiche , l'effectif (grille et page d'un joueur)

> Fiche de page, selon la méthode des trois casquettes (`CLAUDE.md`). Rédigée le 30-09-2026 à
> 16:20, en autonomie. Veille : `veille.md`, section 15. Palette : `palette.md`, variante « net ».

## 1. Direction artistique

### L'intention

**Le vestiaire avant le match** : des maillots alignés par poste, tous de la même taille. Le
numéro est l'identité, en grand, sur le motif du maillot ; la photo, quand elle existe, vient se
poser dessus en surimpression turquoise. Personne n'est plus grand qu'un autre : le volley est un
sport d'équipe (principe 1), la grille n'a ni vedette, ni classement, ni compteur.

### Les références, et ce qu'on en prend

| Référence | Ce qu'on prend |
|---|---|
| Stade Toulousain | Des intertitres par poste ; l'âge visible sans cliquer |
| Trentino Volley | La saison dans l'adresse ; le parcours jusqu'au premier match au club |
| Toulouse FC (Awwwards 2023) | Le numéro géant en tête de la fiche |
| Tours Volley-Ball | Les postes nommés à la française ; la liste des coéquipiers par numéro sur la fiche |
| Sir Safety Perugia | Peu de données, et pas de date de naissance complète |
| Contre-exemples | « Top buteurs » (Toulouse FC), dates de naissance complètes (trois clubs), fiche d'un partant recyclée pour un nouveau (Tours), compteurs d'une autre saison (Trentino), vides laissés sans traitement (LOVB) |

## 2. UX et UI

### La grille, `/effectif?saison=2026-2027`

1. **Titre et saisons** en liens, comme le calendrier.
2. **Un groupe par poste**, dans l'ordre de présentation d'une équipe : passeurs,
   réceptionneurs-attaquants, centraux, pointus, libéros. Dans chaque groupe, par numéro.
3. **Des cartes toutes égales** : le portrait (photo en surimpression, sinon le numéro géant sur
   le motif), puis le numéro, le prénom et le nom, l'âge et la taille. Un « C » discret pour le
   capitaine. Toute la carte mène à la page du joueur.

### La page d'un joueur, `/effectif/<slug>`

1. **« Tout l'effectif »**, puis l'identité : numéro géant, prénom et nom, poste, capitaine.
2. **Le portrait** et les données : âge, taille. Jamais la date de naissance.
3. **La présentation**, puis **le parcours**, s'ils sont saisis.
4. **Ses matchs de la saison** : la liste des matchs où il était présent, avec le résultat de
   l'équipe, chacun relié à sa page. Aucun chiffre individuel au premier lot (plan : lot 2), et
   jamais de comparaison.
5. **L'effectif**, en liste courte par numéro, pour passer d'un joueur à l'autre ; pas de
   « même poste », qui inviterait à comparer.

### Vie privée

- **L'âge seulement**, calculé à l'affichage ; la date de naissance reste en base, jamais publiée.
- **Prénom et nom complet**, décision de l'utilisateur du 30-09-2026. **À vérifier avant la mise
  en ligne** : que l'accord de droit à l'image des joueurs couvre le site, pas seulement le
  tournage (point prévu au cadrage).
- **Joueur parti** : sa page vit tant qu'il est actif ; désactivé, elle répond 404. Une adresse
  n'est jamais réattribuée (le slug naît avec le joueur et ne change pas).

### Les états

Joueur sans photo : le numéro géant. Sans numéro : le poste en grand. Sans taille ni date : la
donnée disparaît. Saison sans effectif : « L'effectif de cette saison n'est pas encore publié ».
Aucun match joué : le bloc disparaît.

## 3. Fullstack

- **Données** : `lib/effectif-public.ts` (effectif d'une saison, joueur avec sa ligne d'effectif
  et ses matchs, adresse de photo R2 ou rien) ; `lib/postes.ts` (regroupement par poste, testé).
- **Staff** : hors de ce lot, il vit sur la page « L'équipe derrière ».
- **Vérification** : tests, `tsc`, lint, rendu en 390 et 1440 px, 404 sur joueur inconnu,
  critique à froid.
