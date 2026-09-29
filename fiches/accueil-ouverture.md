# Fiche , l'ouverture de l'accueil

> Première fiche de page, selon la méthode des trois casquettes (`CLAUDE.md`). Elle couvre
> l'ouverture seulement : l'intro jouée à la première visite, et l'état qu'elle laisse en place.
> Le reste de l'accueil aura sa propre fiche.
>
> Rédigée le 29-09-2026 à partir de la proposition de l'utilisateur et de ses arbitrages. **À
> valider avant la première ligne de code.**

## 1. Direction artistique

### L'intention

Le site s'ouvre sur un point de volley, le point se joue, la salle exulte, et **le terrain lui-même
se replie pour écrire le nom du projet**. Tout le site est en trait fin, façon schéma de coach : le
sol, le filet et la trajectoire qui deviennent des lettres, c'est ce trait qui change de rôle. On
entre dans le site par le geste qui le fonde.

Ce que ça raconte : ce projet, c'est du volley avant d'être un site. Et le spectateur comprend
l'enjeu sans lire un mot, parce que le tableau affiche une balle de set.

### Les références, et ce qu'on en prend

| Référence | Ce qu'on prend |
|---|---|
| Lando Norris, Site of the Year 2025 | Une ouverture qui est déjà la page, un objet signature, une typographie énorme |
| Audi F1, Feel Every Second | La métaphore sportive dans l'interface : chez eux les feux de départ, chez nous le tableau et le bandeau LED de la salle |
| Mat Voyce | Le titre qui se construit, avec parcimonie : une seule fois, à l'ouverture |
| Scout Motors | Le garde-fou : l'animation sert l'information, elle ne la retient pas |

Écarté : l'écran de chargement autonome (un rideau devant la page), et tout ce qui dépasse quatre
secondes. The Last Dance For Glory reste le contre-exemple de ce qui bascule dans l'illisible.

### Les éléments de la salle

- **Le terrain** : le sol, le filet de trois quarts et la trajectoire en pointillés, déjà construits
  et validés sur `/prototype/ballon`.
- **Le tableau de score**, en haut : il affiche **24-23**, balle de set, et passe à **25-23** au
  point. Même langage que le tableau du prochain match.
- **Le public** : une rangée de points en tribune, abstraite, qui bondit à l'impact. Jamais de
  personnages.
- **Le bandeau LED** le long du terrain, proposé par l'utilisateur : le motif du maillot y défile
  doucement, comme les panneaux d'une vraie salle. Au point, il s'emballe et clignote. Le motif est
  un décor du lieu, il n'explose pas à l'écran.

## 2. UX et UI

### Le parcours

1. On arrive sur l'accueil, depuis Instagram le plus souvent, donc sur un téléphone.
2. L'intro démarre aussitôt, **4 secondes au plus**. Un bouton « Passer » est visible dès la
   première image ; un défilement, un clic ou une touche mène aussi à l'état final.
3. Le point se joue, la salle exulte, les lignes forment le titre.
4. **Le titre reste en place : c'est l'ouverture de la page.** La page continue dessous, sans
   rupture.
5. Plus bas, le bloc du prochain match : le tableau seul, qui s'allume au défilement. La scène du
   ballon qui était prévue là est retirée, pour ne pas jouer deux fois le même geste.

### Quand elle ne se joue pas

| Cas | Ce qu'on voit |
|---|---|
| Déjà vue pendant cette visite (même onglet) | L'état final directement : le titre formé par les lignes |
| Arrivée directe sur une autre page (effectif, match) | Rien : l'intro n'existe que sur l'accueil |
| Mouvement réduit demandé par l'appareil | L'état final, immobile |
| JavaScript absent ou en échec | L'état final, rendu par le serveur |

« Une visite » veut dire la session du navigateur : fermer et rouvrir le navigateur la rejoue, un
nouvel onglet aussi, un clic sur « Accueil » non.

### Mobile d'abord

Le cadrage téléphone est celui déjà resserré (9/10). Le titre formé doit tenir en largeur sur
360 px : c'est la contrainte qui fixera sa taille, et le nom définitif du projet pourra la changer.

### Accessibilité

- Le titre est un vrai `<h1>` dans le HTML dès le rendu serveur ; le dessin animé est décoratif,
  masqué aux lecteurs d'écran.
- Le bouton « Passer » est le premier élément atteignable au clavier, avec un libellé explicite.
- Aucun clignotement au-delà de trois par seconde : le bandeau LED en tient compte.
- Rien ne s'anime si le mouvement réduit est demandé.

## 3. Technique

### La séquence, minutée

| Instant | Ce qui se passe |
|---|---|
| 0,0 s | La salle, rendue en veilleuse par le serveur, s'allume : public, bandeau, tableau |
| 0,2 s | « Balle de set » pulse deux fois sur le 24-23 : le temps de lire l'enjeu |
| 1,0 s | Passe, frappe, smash : le geste du prototype (0,9 s jusqu'à l'impact) |
| 1,9 s | Impact : le tableau passe à 25-23, le public bondit, le bandeau s'emballe |
| 2,4 s | Les lignes du terrain se transforment en lettres (1,3 s, lettre après lettre) |
| 3,5 s | Le titre est rempli, le sous-titre et « Défiler » apparaissent |
| 3,9 s | Fin. L'état final est celui que voit tout visiteur suivant |

Révisée le 30-09-2026 : la salle ne se trace plus, elle s'allume (plus de flash au démarrage sur
téléphone lent), et la balle de set tient près d'une seconde, l'utilisateur n'avait pas le temps de
lire le 24-23.

### Architecture

- **Rendu serveur de l'état final** : titre, ouverture, contenu. L'intro est une couche au-dessus,
  qui ne retire rien au référencement ni au temps d'affichage.
- **Mémoire de visite** en `sessionStorage`, lue par un petit script placé en tête de page, avant
  le premier affichage : un visiteur qui l'a déjà vue ne la voit jamais, même un dixième de
  seconde. Aucune donnée ne quitte l'appareil, aucun cookie.
- **GSAP 3.15.0, déjà installé** : MorphSVG pour transformer les lignes en lettres, DrawSVG pour
  les tracés, tout inclus dans la licence standard gratuite. Vérifié dans le paquet le 29-09-2026.
- **Le titre en tracés vectoriels**, tiré d'Archivo (licence OFL, qui le permet) par un script
  lancé une fois. Le jour où le vrai nom du projet arrive, on relance le script. Le choix de l'outil
  de conversion se fera sous la règle des quinze jours, en dépendance de développement seulement.
- **La scène du prototype est réutilisée** : géométrie testée, calques composites, impacts. Ce qui
  est nouveau : les tribunes, le bandeau, le tableau d'intro, la transformation en titre.

### Performance

- Tout ce qui bouge à chaque image passe par `transform` et l'opacité, comme la scène actuelle
  (mesurée à 240 images par seconde sans perte).
- La transformation des lignes en lettres est l'étape la plus coûteuse : à mesurer sur un Android
  d'entrée de gamme, avec un repli prévu (fondu entre les lignes et le titre) si elle ne tient pas
  60 images par seconde.
- GSAP n'est chargé que sur l'accueil, jamais dans l'administration.

### Vérifications prévues

- Tests : la séquence respecte ses bornes (4 s au plus), la mémoire de visite, les quatre cas où
  l'intro ne joue pas.
- À l'écran, en 390 et 1440 px : l'intro complète, le passage par « Passer », l'état final pour
  un visiteur qui l'a déjà vue, le mouvement réduit.
- Mesure d'images en temps réel, et un essai sur téléphone réel par l'utilisateur.

## Points ouverts

- **Le nom du projet** reste provisoire : le titre formé en dépend. Tout est construit pour qu'un
  renommage ne demande que de relancer le script.
- **Le bandeau LED** est ma lecture de la proposition « le motif dans le public en mode bandeau » :
  à confirmer à la validation de cette fiche.
