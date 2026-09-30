# Fiche d'écran : la fiche joueur (01-10-2026)

Écran d'administration, ouvert depuis chaque ligne de l'effectif (« Fiche et photo », ou le nom).

- **Champs** : prénom, nom (seuls obligatoires), date de naissance (seul l'âge s'affiche),
  taille en centimètres (120 à 240), photo, point de visage, présentation et parcours (1 000
  caractères chacun). Principe 3 : une fiche à moitié remplie s'affiche proprement.
- **Point de visage** : un clic sur la photo, ou deux curseurs au clavier, avec l'aperçu du
  cadrage de la carte de l'effectif (4:5) à côté. Stocké en pourcentages (`visage_x`,
  `visage_y`, migration additive 0007), rendu en `object-position` sur la carte, la page du
  joueur et la vignette de l'administration. Sans point : le haut de la photo, centré. Une
  nouvelle photo, ou son retrait, remet le point à zéro.
- **L'adresse publique ne suit pas le nom** : corriger une faute ne casse pas un lien déjà
  partagé.
- Le numéro et le poste restent dans l'effectif de la saison : ils appartiennent à la saison.
