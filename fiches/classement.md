# Fiche : le classement de la poule (01-10-2026)

Décisions de l'utilisateur du 01-10-2026 : tableau complet sur la page Matchs et rang sur
l'accueil ; saisie sur une grille préremplie ; disparition après 30 jours sans mise à jour.

## Public

- **Page Matchs**, sous le calendrier : un vrai tableau (rang, équipe, points, joués, gagnés,
  perdus), chiffres alignés, intitulé de la poule et « à jour au … » toujours dits. Notre ligne en
  jaune avec un filet, `aria-current`, et « (notre équipe) » pour les lecteurs d'écran. Un chiffre
  manquant s'écrit « – », jamais 0 (principe 3).
- **Accueil**, dans le chapitre des matchs : « 2e sur 8 au classement, poule A », lien vers le
  tableau.
- **Péremption** (principe 4) : saison courante, le classement disparaît après 30 jours sans mise
  à jour, sur les deux pages. Saison passée : c'est le classement final, il reste.

## Administration

- `/administration/matchs/classement`, droit `saisirResultats` (comme les scores), relié depuis
  l'écran des matchs.
- Grille préremplie avec la dernière version : on change les chiffres et l'ordre (▲ ▼), le rang
  est la position. Une carte par équipe au téléphone, une ligne avec intitulés en grand écran.
- Contrôles : une et une seule équipe « Nous », pas de doublon, entiers seulement, pas plus de
  victoires et de défaites que de matchs joués, 20 équipes au plus.
- Enregistrement en un lot atomique (les lignes sont remplacées d'un coup), date de mise à jour
  posée par le serveur.
