# Fiche , les matchs (calendrier et page d'un match)

> Fiche de page, selon la méthode des trois casquettes (`CLAUDE.md`). Rédigée le 30-09-2026 à
> 15:15, en autonomie. Veille : `veille.md`, section 13. Palette : `palette.md`, variante « net ».

## 1. Direction artistique

### L'intention

Le calendrier est **le carnet du coach** : une liste nette, qui se lit à la volée sur un
téléphone, où l'on sait d'un coup d'oeil ce qui s'est passé et ce qui vient. La page d'un match est
**le tableau du gymnase** : l'objet lumineux porte la page à lui seul, le reste s'efface.

La lumière reste un événement : seuls le prochain match (en tête du calendrier) et le tableau de
la page d'un match s'allument. Les lignes du calendrier sont mates, en chiffres d'affiche.

### Les références, et ce qu'on en prend

| Référence | Ce qu'on prend |
|---|---|
| Premier League | Un seul emplacement sur la ligne : l'heure avant le match, le score après |
| Stade Toulousain | La liste par mois, l'équipe qui reçoit à gauche |
| Toulouse FC | L'état du match commande l'ordre des blocs de sa page |
| Volleyball World | Les sets en colonnes |
| Contre-exemples | Calendrier en image (Tours), « 0 % » affiché faute de donnée (TFC), agenda derrière un compte (VNL), heure au fuseau du visiteur (LOVB) |

## 2. UX et UI

### Le calendrier, `/matchs?saison=2026-2027`

1. **Titre et saisons** : « Les matchs », puis les saisons en liens (pas de liste déroulante),
   la saison affichée soulignée. Le bilan collectif de la saison : « 5 victoires · 1 défaite »
   (principe 1 : collectif seulement).
2. **Le prochain match** en tableau LED, avec ses actions. Absent s'il n'y en a pas.
3. **La liste**, une seule, groupée par mois, avec un filet **« Aujourd'hui »** entre ce qui est
   joué et ce qui vient. Chaque ligne : le jour en grand, « Contre » ou « Chez » l'adversaire, la
   compétition en petit, et à droite l'emplacement unique : l'heure avant, le score (locaux
   d'abord) et la pastille après, ou l'état en toutes lettres. Une marque « Épisode » si la série
   raconte ce match. Toute la ligne mène à la page du match.

La saison est dans l'adresse en paramètre, pas en chemin : `/matchs/2026-2027` entrerait en
collision avec `/matchs/<slug>`, dont les slugs commencent aussi par une date.

### La page d'un match, `/matchs/<slug>`

L'état commande l'ordre :

| État | Ordre des blocs |
|---|---|
| À venir, en cours | Tableau du prochain match, actions (agenda, itinéraire), salle, compétition |
| Joué | Tableau du résultat (sets en colonnes dedans), épisode lié, commentaire, salle |
| Score à venir | Bandeau « Score bientôt en ligne », date, salle |
| Reporté, annulé | Bandeau en toutes lettres, date initiale barrée, salle |

Puis toujours : **match précédent et match suivant**, et « Tous les matchs ».

### Les états

- **Jamais de zéro inventé** : un score non saisi n'est pas 0-0, c'est « Score à venir ».
- **Heure de la salle** : toujours à l'heure de Paris, quel que soit le fuseau du visiteur.
- **Saison sans match** : une phrase, « Le calendrier de cette saison n'est pas encore publié ».
- **Slug inconnu ou match en corbeille** : 404.

### Mobile et accessibilité

Lignes d'au moins 64 px, toute la ligne cliquable, rien en tableau horizontal. La liste est une
vraie liste ; chaque ligne a un nom accessible complet (« Samedi 3 octobre, contre Entente
Val-Fleury, victoire 3 sets à 1 »). Les saisons sont des liens, le filet « Aujourd'hui » est
annoncé.

## 3. Fullstack

- **Données** : `lib/calendrier.ts` (statut public, regroupement par mois à l'heure de Paris,
  testés) ; `lib/matchs-publics.ts` (calendrier d'une saison par libellé, un match avec son
  épisode publié). Rendu dynamique, comme l'accueil.
- **Composants** : `ActionsMatch` partagé avec l'accueil, les deux tableaux LED réutilisés tels
  quels, une en-tête publique commune (logo et « Matchs ») pour les pages hors accueil.
- **Métadonnées** : titre et description par match (« VF Francheville - Adversaire, 3 octobre »).
- **Vérification** : tests, `tsc`, lint, rendu à l'écran en 390 et 1440 px, chaque état provoqué
  avec les données de démonstration, critique à froid.

### Reporté à un lot suivant, et pourquoi

- **Abonnement d'agenda à toute la saison** (`.ics` mis à jour seul) : très utile, mais une
  deuxième route publique à revoir en passe adversariale ; il vient avec la page « Où nous voir ».
- **Carte statique hébergée chez nous** : demande de générer et stocker des images de carte ; le
  lien « Itinéraire » suffit au premier lot.
- **Transition animée liste → match** (le tableau qui glisse) : belle place à prendre, mais le
  support navigateur est à vérifier avant d'en faire une promesse.

## Complément du 01-10-2026 : le bilan de saison

Choisi par l'utilisateur : enrichir le « victoires · défaites » sans rien demander de plus à
l'ami. En tête de page, la grammaire des chiffres de la page joueur : bilan (V et D), sets gagnés
et perdus, à domicile, à l'extérieur, puis la série en cours à partir de deux matchs (« 3
victoires de suite », en jaune). Pas de pourcentage : sur huit matchs, il donnerait une précision
qu'il n'a pas. Un match sans score saisi ne compte pas. Calcul pur dans `src/lib/bilan.ts`.


## Retouches du 01-10-2026, demandées par l'utilisateur

- **Le tableau défile à la seconde** : quatre groupes (jours, heures, minutes, secondes), et seul
  le chiffre qui change bascule, comme le volet d'un afficheur. Rien ne bascule à l'arrivée (le
  tableau a son allumage) ni sous mouvement réduit ; le texte des lecteurs d'écran reste à la
  minute. La taille des chiffres suit la largeur du tableau (requête de conteneur) : à mi-largeur
  sur l'accueil, quatre groupes débordaient à 1280 px.
- **Chaque ligne du calendrier porte sa marque** « Domicile » (turquoise plein) ou « Extérieur »
  (au trait), en tête de sa ligne d'informations ; le nom accessible dit « à domicile contre » ou
  « à l'extérieur, chez ». Choix de l'utilisateur : une marque par ligne, sans filtre.
