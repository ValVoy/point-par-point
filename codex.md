# Codex , concepts du projet

> Base de connaissances curatée. À chaque ajout : bonne catégorie + sommaire à jour.

## Sommaire

- [Principes de conception](#principes-de-conception)
  - [Le volley est un sport d'équipe](#le-volley-est-un-sport-déquipe)
  - [Le match est la source unique](#le-match-est-la-source-unique)
  - [La saisie est partielle par nature](#la-saisie-est-partielle-par-nature)
  - [Le site vieillit dignement](#le-site-vieillit-dignement)
  - [Des champs, jamais de la mise en page](#des-champs-jamais-de-la-mise-en-page)
- [Conventions](#conventions)
  - [Le marquage des données de démonstration](#le-marquage-des-données-de-démonstration)
  - [L'effectif appartient à la saison, pas au joueur](#leffectif-appartient-à-la-saison-pas-au-joueur)

## Principes de conception

### Le volley est un sport d'équipe

Posé par l'utilisateur au cadrage du 19-09-2026, en refusant un classement interne des marqueurs
que je proposais. **Le site ne classe jamais les joueurs entre eux.** Pas de palmarès individuel,
pas de meilleur marqueur mis en avant, pas de tri décroissant sur une statistique de joueur.

Ce que cela n'interdit pas : afficher les chiffres d'un joueur **sur sa propre page**, seuls, sans
comparaison possible. Et mettre en avant, partout ailleurs, les chiffres collectifs.

C'est un principe de fond, pas une préférence d'affichage : il tranche d'avance toute demande de
fonctionnalité qui reviendrait à hiérarchiser douze copains.

### Le match est la source unique

Aucune statistique n'est saisie deux fois. On remplit une feuille de match, et les fiches joueurs,
les totaux de saison et le bilan collectif en découlent par calcul. Conséquence directe : aucune
donnée dérivée n'est stockée telle quelle, et deux pages du site ne peuvent pas se contredire.

### La saisie est partielle par nature

Tous les champs de statistique sont nullables, et c'est volontaire. Un match peut n'avoir qu'un
score, ou un score plus quelques joueurs, ou une feuille complète. Le site doit s'afficher
proprement dans les trois cas, sans jamais montrer de case vide ni de zéro trompeur.

La raison est humaine et non technique : le dépouillement vidéo, c'est vingt minutes par match
pendant huit mois. Le site doit tenir la semaine où personne n'a le temps, sinon il meurt en
novembre comme tous les sites d'équipe.

### Le site vieillit dignement

Une section sans contenu à jour **disparaît** plutôt que d'afficher une donnée périmée. Pas de
prochain match connu, pas de bloc prochain match sur l'accueil. Classement non tenu depuis trop
longtemps, section masquée. Un site qui affiche une date de novembre au mois de mars décrédibilise
tout ce qu'il dit par ailleurs, y compris ce qui est encore vrai.

### Des champs, jamais de la mise en page

L'administration saisit des champs typés. Pas de HTML libre, pas de blocs à disposer, pas de
création de pages nouvelles. La structure du site est fixe, seul son contenu bouge.

Deux effets recherchés : le site ne peut pas devenir laid en trois mois, et un CMS complet ne peut
pas naître par accident au fil des demandes.

## Conventions

### Le marquage des données de démonstration

Le site est livré rempli de faux joueurs et de faux matchs, pour que l'ami n'ait pas à remplir un
site vide avant de l'avoir vu vivre. Le risque connu de cette approche est qu'un faux joueur reste
en ligne le jour de la mise en service.

La parade retenue n'est pas une note dans un coin : **chaque enregistrement de démonstration porte
une colonne `demo`**, l'administration affiche un bandeau tant qu'il en reste un seul, et une
commande unique les purge tous. Il faut alors vouloir ignorer un bandeau pour se tromper.

### L'effectif appartient à la saison, pas au joueur

Le numéro de maillot et le poste changent d'une année sur l'autre. Ils sont donc portés par la
table `effectif`, qui relie un joueur à une saison, et non par la table `joueur`. Sans cela,
changer de numéro en septembre réécrirait rétroactivement toutes les feuilles de match des saisons
passées.
