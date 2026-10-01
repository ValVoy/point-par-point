# Fiche , l'accueil devient la porte d'entrée

> Fiche de page, selon la méthode des trois casquettes (`CLAUDE.md`). Elle complète
> `accueil.md` (30-09-2026), qui reste valable pour les blocs de fraîcheur, et `accueil-ouverture.md`
> pour l'intro. Rédigée le 01-10-2026 à 18:12. Veille : `veille.md`, sections 12 et 18.
>
> **Pourquoi elle existe.** Vu en production sur une base vide, l'accueil n'a montré que l'ouverture
> puis le pied de page : la fiche du 30-09 ne retenait que des blocs de fraîcheur, et chacun
> disparaît quand il n'a rien. Même rempli, rien ne disait qui est l'équipe. Décisions de
> l'utilisateur du 01-10-2026 : l'accueil est une porte d'entrée complète ; trois chapitres
> permanents, **Qui on est**, **L'équipe**, **Le projet** ; les permanents tiennent seuls, seuls les
> blocs de fraîcheur disparaissent ; le manifeste se modifie dans l'administration. Et le mouvement
> est un objectif à part entière : chaque chapitre porte un geste qui lui est propre.

## 1. Direction artistique

### L'intention

L'accueil se lit comme **un match** : on entre dans la salle (l'ouverture), on apprend qui joue (le
manifeste), on regarde (la série), on vient (le tableau), on rencontre l'équipe, on remonte
l'histoire. Les chapitres permanents donnent la colonne vertébrale, les blocs de fraîcheur
s'intercalent entre eux quand ils ont quelque chose à dire.

Le mouvement fait l'identité. Trois gestes neufs, chacun tiré d'un objet de la salle :

- **Le manifeste s'allume mot à mot**, comme les rampes de la salle qu'on rallume une à une.
- **Les numéros de l'effectif roulent** jusqu'au leur, comme les chiffres d'un tableau d'affichage
  qu'on met à jour.
- **Le fil du projet se trace** sous le pouce, et chaque étape s'allume quand il l'atteint.

Ils s'ajoutent à ce que le site fait déjà : la révélation à l'entrée, l'allumage en néon des
tableaux, le ballon qui passe le filet. Une fois allumé, un texte ne bouge plus : on lit au calme.

### Les références, et ce qu'on en prend

| Référence | Ce qu'on prend |
|---|---|
| Oakland Roots SC | Le manifeste typographique, plein écran, sans image, sur fond sombre |
| Hashtag United | L'origine dite en une phrase : l'équipe vit aussi dans une série. Leur accueil la tait, le nôtre la dit |
| Team Vitality | L'équipe entière d'un regard, le lien vers l'effectif aligné sur le titre |
| WC26 Player Album | L'absence de photo comme état voulu, du même gabarit, porteur du signe du maillot |
| FC Porto, Memorial | L'étape « 01. » : un titre court, une ou deux phrases, une date |
| Contre-exemples | Le carrousel une carte à la fois (LOVB), la boucle infinie qui bouge pendant la lecture (Vitality), le récit qui laisse des écrans vides (Porto), la vignette absente qui casse la colonne (Clapton) |

## 2. UX et UI

### L'ordre des chapitres

| # | Chapitre | Nature | Sans données |
|---|---|---|---|
| 0 | L'ouverture | Permanent | Inchangée |
| 1 | **Qui on est** | Permanent | Texte de départ (ci-dessous) |
| 2 | La série | Fraîcheur, avec repli | **Repli : une invitation à la chaîne** (voir plus bas) |
| 3 | Au tableau | Fraîcheur | Disparaît (fiche `accueil.md`) |
| 4 | **L'équipe** | Permanent, nourri par l'effectif | Disparaît tant qu'aucun joueur n'est publié |
| 5 | **Le projet** | Permanent, nourri par la chronologie | Disparaît tant qu'aucune étape n'est publiée |
| 6 | Les actualités | Fraîcheur | Disparaît |
| 7 | Pied de page | Permanent | Inchangé |

**Sur la base vide d'aujourd'hui**, la page montre donc l'ouverture, le manifeste, l'invitation à
la série et le pied : quatre écrans qui disent qui, quoi et où regarder, sans case « bientôt ». Elle
s'étoffe d'elle-même à chaque saisie de Tom : son premier joueur fait apparaître L'équipe, sa
première étape Le projet.

**Le repli de la série** : la chaîne YouTube est connue (`lib/site.ts`). Sans épisode publié, le
chapitre ne disparaît plus : il dit « La série, sur YouTube » et propose S'abonner. C'est le
premier but du site, il ne doit jamais manquer.

### 1. Qui on est

- Un surtitre turquoise « Qui on est », un **titre de 6 à 12 mots** en capitales condensées, très
  grand (jusqu'à environ 80 px en grand écran), puis **un paragraphe de 60 mots au plus**.
- Plein écran de hauteur au plus, pleine largeur de colonne large, sans image. Le motif de
  triangles du maillot, très discret, dans un coin.
- Un lien « Notre histoire » vers `/le-projet` **seulement si** la chronologie a au moins une étape
  publiée (jamais un lien vers une page vide).
- **Texte de départ**, que Tom réécrit dans l'administration :
  - titre : « Une équipe de D2, filmée de l'intérieur. »
  - texte : « Point Par Point suit l'équipe D2 masculine du VF Francheville, dans l'ouest lyonnais,
    match après match. Sur le terrain le week-end, dans la série le reste du temps : les
    entraînements, les déplacements, les sets qui basculent. Ici, tout ce qui dure : l'effectif,
    les scores, le calendrier. » (51 mots)

### 4. L'équipe

- Titre « L'équipe » et, sur la même ligne, le lien **« Tout l'effectif »**. Sous le titre, une
  ligne de comptes : « 14 joueurs · saison 2026-2027 ».
- **L'équipe entière d'un regard**, pas de carrousel : grille de cartes égales, triées par numéro,
  capitaine marqué. Jusqu'à 12 cartes en grand écran (6 colonnes), 6 sur téléphone (2 colonnes) ;
  au-delà, la dernière carte devient « + 8 joueurs » et mène à l'effectif.
- Chaque carte reprend le portrait de l'effectif (`portrait-joueur.tsx`) : photo quand elle
  existe, sinon **le numéro géant sur le motif**, même gabarit, jamais de trou. Nom, poste.
- La carte entière mène à la fiche du joueur.

### 5. Le projet

- Titre « Le projet », lien **« Toute l'histoire »** aligné.
- **Les trois dernières étapes** de la chronologie, dans l'ordre du récit : « 01. », titre, date,
  une ou deux phrases (le texte de l'étape coupé proprement). Disposition horizontale en grand
  écran, verticale sur téléphone, reliées par le fil turquoise de la page « Le projet ».

### Le mouvement, chapitre par chapitre

| Chapitre | Geste propre | Comment | Sous mouvement réduit |
|---|---|---|---|
| Qui on est | Les mots s'allument un à un, de la craie éteinte à la craie pleine, les mots clés en turquoise | Mots découpés au rendu serveur, opacité liée au défilement sur environ une demi-hauteur d'écran ; une fois tout allumé, le geste se fige et ne revient pas en arrière | Texte allumé d'emblée |
| La série | Inchangé (révélation, image qui reprend ses couleurs au survol) ; le repli entre avec la même révélation | Existant | Existant |
| Au tableau | Inchangé (allumage néon, ballon et filet) | Existant | Existant |
| L'équipe | **Les numéros roulent** de 00 à leur valeur, en vague de gauche à droite, 40 ms d'écart, 600 ms au plus pour toute la grille | Chiffres empilés en colonne, `translateY` seulement, `tabular-nums` ; le vrai numéro est dans le HTML, la colonne animée en `aria-hidden` | Numéros posés d'emblée |
| L'équipe, au survol | La carte se lève de 4 px, un triangle turquoise balaie le bord bas | `transform` seulement, 80 ms | Bord turquoise sans balayage |
| Le projet | **Le fil se trace** au défilement, chaque étape s'allume quand il l'atteint | SVG, `stroke-dashoffset` lié au défilement, un seul déclencheur | Fil entier, étapes allumées |
| Tous | Révélation à l'entrée, existante | `Revelations` | Rien |

Règles tenues : `transform` et `opacity` seulement, place réservée (aucun décalage de mise en
page), aucune section épinglée, aucune boucle qui tourne pendant la lecture, texte réel sous toute
animation, un bloc atteint au clavier se révèle aussitôt.

### Mobile d'abord

Un chapitre par écran ou presque. Manifeste en 44 px environ, paragraphe en 18 px. Grille de
l'équipe en 2 colonnes, cartes au pouce. Le fil du projet vertical, à gauche des étapes.

### Accessibilité

Le manifeste découpé reste une phrase continue pour un lecteur d'écran (mots en `span` dans le
flux, aucun `aria-hidden` sur le texte). Les liens « Tout l'effectif » et « Toute l'histoire » ont
un nom complet. Le numéro animé est doublé du numéro réel en texte.

## 3. Fullstack

- **Données** : `lib/accueil.ts` lit en plus, dans la même passe parallèle, le manifeste (deux
  réglages `manifeste_titre` et `manifeste_texte`, repli sur le texte de départ), l'effectif de la
  saison courante (fonction existante `effectifDeLaSaison`) et les étapes publiées
  (`etapesPubliees`, les trois dernières). Aucune migration : `reglages` est une table clé-valeur.
- **Logique pure, testée** : le choix des cartes de l'équipe (tri par numéro, capitaine, limite,
  carte « + n ») et l'extrait d'étape (coupe à la phrase, 200 caractères au plus).
- **Administration** : un écran « Le manifeste » dans la rubrique Projet, à côté de « Venir à la
  salle » : titre (80 caractères au plus) et texte (500 au plus), compteur, texte de départ
  pré-rempli, bouton « Revenir au texte de départ ». Même action serveur protégée que la salle.
- **Composants** : `bloc-manifeste.tsx`, `bloc-equipe.tsx`, `bloc-projet.tsx`, et le repli de
  `bloc-serie.tsx`. Mouvement dans des composants clients dédiés, tous sous `gsap.matchMedia()`,
  importés depuis `lib/gsap`. Chaque fichier sous 300 lignes.
- **Performance** : aucune bibliothèque nouvelle. Photos de l'aperçu en `next/image` avec `sizes`
  ajusté à la grille, chargées en différé.
- **Vérification** : tests, `tsc`, lint, `next build` ; à l'écran en 390 et 1440 px, **trois
  états** : base vide (le cas de la production aujourd'hui), base de démonstration, et un seul
  joueur sans photo ; mouvement réduit forcé. Puis critique à froid par un agent qui ne l'a pas
  construite, avant le commit, puisqu'un push sur `main` part en production.

## 4. Écarts assumés à la construction (01-10-2026, après critique à froid)

- **Manifeste en deux colonnes en grand écran** : titre à gauche, texte à droite. En une colonne,
  la moitié droite de l'écran restait vide. Titre plafonné à environ 84 px, coupé proprement si
  Tom saisit un mot long.
- **Titre du repli de la série** : « La saison, épisode après épisode », et non « La série, sur
  YouTube ». Le surtitre dit déjà « La série » ; le premier titre essayé répétait celui du
  manifeste.
- **Voyant d'enregistrement** du repli : à l'ambre des LED du tableau (la palette n'a pas de rouge),
  trois pulsations puis fixe. Rien ne tourne pendant la lecture.
- **Le fil du projet est fait de tronçons** d'un repère au suivant, et non d'un trait sur toute la
  largeur : avec une ou deux étapes, il ne traverse plus de colonne vide. Sa fin est bornée au bas
  de la page, pour que le chapitre finisse son geste même juste avant le pied de page.
- **Numéros** : la vague va de carte en carte (40 ms, 600 ms au plus) et non de chiffre en chiffre ;
  translation pure.
- **Administration** : pas de compteur de caractères en direct, la limite est dite sous chaque
  champ et tenue par le navigateur. Les blancs sont ramenés à une espace avant de compter (le texte
  s'affiche d'un seul paragraphe). Enregistrer le texte de départ tel quel ne le fige pas en base.
  Le retour au texte de départ se confirme en deux temps.
- **Texte de départ du manifeste revu le 01-10-2026** : il dit l'objectif de la saison, passer de
  Départementale 2 à Départementale 1, que Tom répète dans chaque épisode. Les extraits « les
  entraînements, les déplacements, les sets qui basculent » sont retirés pour rester sous 60 mots.
