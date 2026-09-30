# Carnet de bord , Projet Volley

## 19-09-2026

**15:34** · **[bootstrap] Dossier du projet posé, rien de codé**

Squelette créé depuis la session du chantier d'hébergement. Le projet était le seul des quatre à ne
pas avoir été cité au cadrage du 17-09 : l'utilisateur l'a rattrapé aujourd'hui. Un ami a monté un
concept autour d'une équipe de volley, qu'il fait vivre sur Instagram et par une série YouTube
lancée pour accompagner le projet. L'utilisateur lui a proposé le site. L'idée tient en une phrase :
donner ce que les réseaux ne savent pas faire, des informations qui se consultent et qui durent,
l'effectif poste par poste, les âges, les résultats.

Trois décisions sont prises d'emblée, et la première commande tout le reste. Le site aura une
**interface d'administration**, parce que le but est de le mettre à jour régulièrement, au rythme de
la saison et de la série : il faut donc une base, une authentification et un back-office que l'ami
utilise seul. L'hébergement sera le VPS Coolify. Et **pas d'Instagram dans le premier lot**, ce qui
écarte au passage le seul vrai piège technique du lot, l'ancienne API publique d'affichage ayant
fermé fin 2024 ; la série YouTube, elle, s'intègre par simple lecteur intégré.

Le point de droit à l'image, qui aurait pu bloquer la publication des fiches joueurs, est réglé en
amont : les joueurs sont filmés pour la série et ont donné leur accord. Reste une vérification de
cadrage, pas un obstacle, que cet accord couvre aussi un site public et pas seulement le tournage.

`Projet Volley` est un nom de travail. Le vrai nom du concept est à récupérer auprès de l'ami, et le
dossier comme le dépôt seront renommés à ce moment-là.

- Portée : `CLAUDE.md`, `ROADMAP.md`, `codex.md`, `carnetdebord.md`, `.gitignore`, dépôt git local
  sans distant.
- Vérifié : rien à vérifier, aucun code.
- Suite : ouvrir une séance dans ce dossier et lancer le cadrage par questions décrit dans
  `CLAUDE.md`. Première chose à établir avec l'ami : le vrai nom, puis ce que l'interface
  d'administration doit permettre, poste par poste.

**23:15** · **[cadrage] Cadrage d'ouverture terminé, plan écrit**

Neuf salves, quarante questions, tous les terrains du `CLAUDE.md` couverts. Le projet sort de la
séance avec `PLAN.md`, cinq principes de conception dans le codex et une roadmap en trois lots.
Aucune ligne de code, comme prévu.

Le concept est un projet média d'abord, adossé à une vraie équipe de championnat FFVB
départemental ou régional. Le site doit servir deux choses et pas dix : faire s'abonner à la série,
et faire venir au match. La page d'accueil découle directement de là, dernier épisode et prochain
match en tête, parce que ce sont les deux seuls contenus qui bougent souvent.

La décision la plus structurante est venue de l'utilisateur, pas de moi. Sur la question des
statistiques, il a refusé l'arbitrage que je proposais entre fiche riche et fiche pauvre, et a posé
l'architecture correcte : le match est la source unique, on saisit une feuille de match et tout le
reste se recalcule. Cela l'a conduit à demander les statistiques volley complètes, ce qui est
ambitieux, le dépouillement vidéo représentant une vingtaine de minutes par match pendant huit
mois. La parade est dans le principe de saisie partielle : tous les champs de statistique sont
nullables, un match peut n'avoir qu'un score, et le site s'affiche proprement dans tous les cas.
L'ambition est gardée sans que le site meure en novembre comme tous les sites d'équipe.

La deuxième décision de fond est un refus, et elle vaut mieux qu'une fonctionnalité. J'ai proposé
un classement interne des marqueurs, présenté comme la récompense naturelle des statistiques
saisies. Réponse : le volley est avant tout un sport d'équipe. Le site ne classera donc jamais les
joueurs entre eux, les chiffres collectifs passent devant, et les chiffres individuels n'existent
que sur la page du joueur concerné, sans comparaison. C'est écrit dans le codex comme principe, pas
comme préférence d'affichage : cela tranche d'avance toutes les demandes futures qui reviendraient
à hiérarchiser douze copains.

Le reste s'est joué sur des garde-fous, tous retenus : pas de mise en page libre, pas de création
de pages, pas de suppression définitive, pas de publication sans brouillon. C'est ce qui empêche un
CMS complet de naître par accident. S'y ajoute une idée de l'utilisateur, durcie d'un cran : le
site sera livré avec des données de démonstration pour ne pas imposer à l'ami de remplir un site
vide, mais chaque faux enregistrement portera une colonne `demo`, l'administration affichera un
bandeau tant qu'il en reste un, et une commande unique purgera l'ensemble. Une note dans un coin
s'oublie, un bandeau rouge non.

Deux points ont été posés pour ne pas rester flous entre amis. La maintenance : la construction et
l'hébergement sont offerts, les pannes corrigées au fil de l'eau, aucune nouvelle fonctionnalité
promise au-delà du lot 1. Et le domaine : acheté par l'utilisateur et offert, alors que l'éditeur
déclaré du site sera l'ami à titre de particulier. Les deux rôles sont distincts et c'est normal,
mais les relances de renouvellement arriveront chez l'utilisateur, d'où le transfert prévu et
documenté à l'avance.

Écarté au passage, et c'est autant de travail en moins : la lettre d'information, donc tout envoi
d'e-mail et tout le volet données personnelles des visiteurs qui allait avec ; la galerie photos,
parce que personne ne sait s'il y a des photos ; la boutique avec paiement. Le mur de soutiens est
gardé mais renvoyé au lot 2, avec validation obligatoire avant affichage : c'est le seul endroit du
site où un inconnu écrit, et c'est lui qui déclenchera la revue de sécurité manuelle.

- Portée : `PLAN.md` créé, `codex.md` et `ROADMAP.md` réécrits, `carnetdebord.md`.
- Vérifié : rien à vérifier, aucun code. Le plan attend la validation de l'utilisateur.
- Suite : faire valider le plan, créer le dépôt GitHub privé et pousser le squelette, puis
  initialiser Next.js 15 et le schéma Drizzle complet, colonnes du lot 2 comprises.

## 20-09-2026

**00:20** · **[fondations] Plan validé, fondations techniques posées et vérifiées**

Le plan a été validé sans réserve dans la foulée du cadrage. Séance de nuit consacrée aux seules
fondations : rien de visible, tout ce sur quoi le reste va s'appuyer.

Choix de départ qui a évité une heure de tâtonnement : plutôt que de lancer `create-next-app`,
interdit par la règle npm du socle puisqu'il s'exécute en `@latest`, j'ai repris à l'identique les
versions de `ope_cdm`, qui tourne en production depuis des mois. Next 15.5.18, React 19.1.0,
Drizzle 0.45, Tailwind 4. Elles sont éprouvées et publiées depuis longtemps, ce qui règle d'un coup
la question de la chaîne d'approvisionnement. La structure du projet a été posée fichier par
fichier, sans générateur.

Le schéma fait dix-sept tables, découpées en trois fichiers par domaine plutôt qu'un seul gros :
sportif, éditorial, exploitation, plus un fichier de colonnes communes qui porte à lui seul deux
principes du codex. La corbeille et le marquage de démonstration ne sont pas recopiés table par
table, ils sont définis une fois et réutilisés, ce qui rend impossible d'oublier l'un des deux en
ajoutant une table.

Deux écarts au plan, tous deux assumés et écrits dans `PLAN.md`. Le premier : bcrypt au lieu
d'argon2id, parce que les portages argon2 pour Node demandent une compilation native qui alourdit
l'image Docker et casse au moindre changement d'architecture, pour un enjeu qui reste un faux
résultat de match publié. Le second va dans l'autre sens : le lint et la vérification des types
restent actifs pendant le build, alors qu'ils étaient désactivés sur `ope_cdm`. La raison de leur
désactivation là-bas était le plafond mémoire de 644 Mo de Clever Cloud, que le VPS Hetzner n'a pas.

Rien n'a été déclaré fait sur la foi du code. La migration a été appliquée à une vraie base SQLite
jetable, et les dix-sept tables ont été relues depuis `sqlite_master`, colonnes comprises : les
champs de statistique sont bien nullables, ce qui vérifie le principe de saisie partielle dans le
SQL et non seulement dans l'intention. L'authentification a été éprouvée en dix points, dont les
trois qui comptent : le jeton stocké en base diffère bien de celui du cookie, un jeton inventé est
refusé, et désactiver un compte lui retire sa session immédiatement sans qu'il faille penser à la
supprimer. Le cycle de démonstration a tourné en entier, 50 enregistrements marqués semés puis 116
lignes effacées enfants compris, le compte utilisateur survivant à la purge comme prévu.

Un défaut trouvé à l'écran, et c'est précisément pourquoi la règle de vérification visuelle existe :
la page s'affichait sans accents. J'avais écrit les chaînes comme les commentaires, en caractères
simples. Les commentaires peuvent s'en passer, pas ce que lit un visiteur. Tout le texte affiché est
repassé en français correct, jeu de démonstration compris, et la règle est notée dans `src/lib/site.ts`
pour ne pas se reproduire. Au passage, la fabrique d'adresses est sortie du script de démonstration
vers `src/lib/slug.ts` : deux implémentations divergentes auraient fini par produire deux adresses
pour le même joueur.

- Portée : `package.json`, configurations Next, TypeScript, ESLint, PostCSS et Drizzle, `Dockerfile`,
  `src/lib/db/` (schéma en quatre fichiers), `src/lib/auth/` (quatre fichiers), `src/lib/demo.ts`,
  `src/lib/slug.ts`, `src/app/` (layout, accueil provisoire, jetons de style), `scripts/` (migration,
  semis, purge, vérification, création d'administrateur).
- Vérifié : `next build`, `tsc --noEmit` et `eslint` sans erreur ; migration appliquée et relue sur
  base SQLite ; authentification éprouvée en dix points ; semis et purge de démonstration joués en
  entier ; page d'accueil vue dans un navigateur, défaut d'accents trouvé et corrigé.
- Suite : créer la base Turso réelle et y appliquer la migration, puis écrire l'écran de connexion
  et la coquille de l'administration, avec le bandeau de données de démonstration qui attend déjà
  son emplacement.

**00:35** · **[administration] Connexion, rôles et bandeau de démonstration**

Autonomie sur la base de données accordée en cours de séance, inscrite dans le `CLAUDE.md` du
projet avec deux réserves que je me suis gardées faute d'accord explicite : la base de production
et les migrations destructives se demandent toujours.

La base Turso de développement était déjà branchée, l'utilisateur ayant posé le `.env.local`
pendant la séance précédente. Migrée, semée, et la connexion vérifiée avant tout le reste.

Point d'outillage tranché définitivement : **il n'existe pas de CLI Turso pour Windows**. Vérifié
plutôt que supposé, la version `1.0.32` ne publie que des binaires Darwin et Linux, et la
documentation officielle exige toujours WSL, abandonné mi-2026. Le carnet d'`ope_cdm` le
documentait depuis des mois et je ne l'avais pas lu avant de proposer la commande. Plutôt que
d'installer un manifest tiers, j'ai écrit `npm run db:sql`, qui couvre l'usage réel de
`turso db shell` en passant par `@libsql/client`, déjà installé.

L'écran de connexion a reçu une **limitation de débit** qui n'était pas au plan, reprise de ce qui
existe sur `ope_cdm`. Elle se justifie par le cadrage lui-même : la connexion est, avec le
formulaire de contact, l'un des deux seuls endroits où une entrée non contrôlée entre dans le
système, donc l'un des deux qui déclenchent la revue de sécurité. Deux compteurs en fenêtre
glissante, serré par adresse visée, large par adresse réseau, parce que l'équipe peut partager une
connexion. Le contrôle passe avant le hachage du mot de passe : laisser déclencher sans limite un
calcul volontairement coûteux serait offrir un déni de service sur le processeur.

Deux défauts corrigés dans ma propre copie avant de committer. D'abord, j'avais écrit une purge des
tentatives qui effaçait aussi par adresse réseau après une connexion réussie : quiconque possède un
compte valide aurait pu remettre son compteur à zéro à volonté et contourner la protection contre
le balayage. Restreinte à l'adresse visée. Ensuite, mon premier layout d'administration lisait un
en-tête `x-chemin` qui n'existe pas, pour distinguer la page de connexion du reste. Remplacé par un
groupe de routes `(interieur)`, qui est la vraie réponse Next.js : la connexion garde son adresse
mais n'hérite ni de la navigation ni de l'exigence d'être connecté, ce qui serait circulaire.

Deux défauts trouvés à l'écran, et non dans le code. Le formulaire se vidait après un échec, il
fallait retaper son adresse : c'est le correctif que le carnet d'`ope_cdm` mentionne déjà, l'adresse
revient désormais avec l'erreur, jamais le mot de passe. Et le bandeau de démonstration affichait
« 1 saisons, 1 classements », sans accents et sans accord. Un garde-fou qu'on veut voir pris au
sérieux ne peut pas être écrit à la va-vite, les libellés portent maintenant un singulier et un
pluriel.

- Portée : `src/lib/auth/tentatives.ts`, `src/lib/db/schema/exploitation.ts` (table
  `tentatives_auth`, migration `0001`), `src/app/administration/` (layout, groupe `(interieur)`,
  connexion, coquille, bandeau, tableau de bord), `src/lib/demo.ts`, `scripts/sql.ts`,
  `CLAUDE.md`, `PLAN.md`, `ROADMAP.md`.
- Vérifié : `next build`, `tsc --noEmit` et `eslint` sans erreur ; migration `0001` appliquée sur
  Turso et table relue ; dans le navigateur, refus sur mauvais mot de passe, connexion réussie,
  redirection de `/administration` vers la connexion, déconnexion effective, et navigation
  réellement réduite en rôle rédacteur, cinq rubriques au lieu de huit ; limitation de débit
  éprouvée, blocage au sixième essai, adresse voisine épargnée, compteur remis à zéro après succès.
  Compte d'essai et tentatives effacés de la base après le test.
- Suite : les écrans de saisie, en commençant par les saisons et l'effectif, puisque tout le reste
  s'y rattache. Changer le mot de passe provisoire affiché en clair dans le terminal.

**00:50** · **[administration] Saisons et effectif, les deux écrans dont tout dépend**

Premiers écrans de saisie. Ils passent en premier parce que tout le reste s'y rattache : un match
appartient à une saison, une feuille de match désigne des joueurs, et sans ces deux tables rien
d'autre ne peut être saisi.

Les règles métier tenues par le code plutôt que par la base, chacune pour une raison. **Une seule
saison courante** : SQLite ne sait pas exprimer « un seul vrai dans cette colonne », et deux
saisons courantes rendraient la page d'accueil indéterministe. **Un numéro de maillot unique par
saison** : une contrainte d'unicité aurait renvoyé « constraint failed », alors que l'écran dit
maintenant « Le numéro 10 est déjà porté par Romain Démo ». **Un seul capitaine par saison**, même
logique. Et **une saison courante ne peut pas partir à la corbeille**, ce serait laisser le site
sans saison affichable.

Le retrait d'un joueur du groupe ne touche pas au joueur lui-même, seulement à sa ligne d'effectif :
ses feuilles de match des saisons passées y font référence, et il peut revenir l'année suivante.
C'est le principe de la source unique appliqué à l'effectif.

Trois défauts trouvés à l'écran, aucun par le compilateur. Le bouton « Enregistrer » sautait à la
ligne dès qu'un nom était long : `flex-wrap` fait dépendre le retour à la ligne de la largeur du
contenu, remplacé par une grille dont les colonnes sont décidées. Les actions « désigner capitaine »
et « retirer du groupe » flottaient hors de la carte, sur le fond gris, faute d'être dans le
composant de ligne. Et le badge « capitaine » se faisait couper par la troncature du nom alors
qu'il est plus court que lui : il est descendu sur la ligne de détails.

Une correction avant même l'écran : j'avais placé des `<div>` en enfants directs d'un `<ul>`, ce qui
est invalide en HTML. Le composant de ligne rend désormais un `<div>` et c'est la page qui
l'enveloppe dans son `<li>`.

Noté au passage, parce que la panne est déroutante : lancer `next build` pendant que le serveur de
développement tourne écrase son `.next` et casse tous ses fichiers statiques, sans message clair.
Le serveur continue de répondre en HTML mais la page arrive sans style ni script.

- Portée : `src/components/formulaire.tsx`, `src/lib/dates.ts`, `src/lib/postes.ts`,
  `src/lib/saisons.ts`, `src/app/administration/(interieur)/saisons/` et `.../effectif/`.
- Vérifié : `next build`, `tsc --noEmit` et `eslint` sans erreur. Dans le navigateur : création
  d'une saison, mise à la corbeille et restauration, tri de l'effectif par poste puis par numéro,
  refus d'un numéro en double avec le nom du joueur en conflit, ajout de deux joueurs homonymes
  produisant `etienne-demo` et `etienne-demo-2`. Données d'essai effacées de la base après le test,
  les 50 enregistrements de démonstration sont intacts.
- Suite : les matchs, calendrier de la saison saisi d'un coup, puis le score set par set sur un
  écran court pensé pour le téléphone.

**00:55** · **[direction artistique] Deux exigences de design posées en fin de séance**

Fin de la première journée de code. L'utilisateur arrête la séance mais pose deux demandes qu'il
veut voir survivre à la session, et elles sont notées dans `codex.md`, `ROADMAP.md`, `PLAN.md` et
en mémoire plutôt que dans une seule.

**La largeur.** Tout le site est aujourd'hui dans une colonne de `max-w-5xl`, jugée trop étroite.
La marge latérale reste, elle n'est pas remise en cause, mais elle doit maigrir. Et surtout, elle
cesse d'être absolue : les bandeaux doivent pouvoir aller d'un bord à l'autre de l'écran, images,
bandes de résultats, lecteurs vidéo, sections colorées. La conséquence pratique est qu'il faut une
échelle de largeurs nommée appliquée partout, sinon chaque page aura la sienne.

**Le motion design**, avec insistance, le mot « vraiment » en majuscules. Ce n'est pas une finition
de fin de projet mais une ambition du site. L'exemple donné dit bien l'intention : au défilement,
un ballon de volley qui passe au-dessus d'un filet. Ce qui compte n'est pas l'effet, c'est que le
mouvement raconte le sport dont le site parle.

La conséquence sur l'ordre des travaux est réelle et vaut d'être écrite : **la bibliothèque
d'animation se tranche avant d'écrire les pages publiques**, pas après. Plaquer du mouvement sur
des pages déjà faites coûte toujours plus cher que de les concevoir animées. Trois garde-fous
notés au codex pour que l'ambition ne se retourne pas contre le site : `prefers-reduced-motion`
respecté sans exception, le mouvement qui ne retarde jamais la lecture d'une information, et rien
de tout cela dans l'administration, où l'ami veut de la vitesse et de la prévisibilité.

- Portée : `codex.md` (nouvelle section Direction artistique), `ROADMAP.md` (chantier dédié),
  `PLAN.md` (ligne Animation dans l'architecture), mémoire de projet.
- Vérifié : rien à vérifier, aucun code écrit dans cette entrée.
- Suite : trancher la bibliothèque d'animation et l'échelle de largeurs, **avant** d'écrire les
  pages publiques. Côté administration, reprendre aux matchs : calendrier de la saison saisi d'un
  coup, puis score set par set sur un écran court pensé pour le gymnase.

## 29-09-2026

**12:35** · **[méthode] Trois casquettes, refonte visuelle et première veille**

Reprise après neuf jours. L'utilisateur relève encore l'exigence : un site très haut de gamme, avec
un vrai motion design, et il veut que je tienne pendant tout le projet trois rôles à la fois,
développeur fullstack senior, directeur artistique en veille permanente, directeur artistique UX et
UI. Il m'a laissé carte blanche sur l'organisation, y compris en plusieurs agents.

J'ai proposé une seule main pour le code et trois étapes par page, qui produisent une fiche validée
avant le code. Trois agents qui codent chacun de leur côté casseraient la cohérence, et c'est
précisément la cohérence qui fait un site haut de gamme. Les agents gardent deux rôles où ils
apportent quelque chose que je n'ai pas seul : la veille en parallèle, et la critique à froid d'une
page qu'ils n'ont pas construite. Méthode validée telle quelle, inscrite dans `CLAUDE.md` et en
mémoire.

Il a ajouté de lui-même que tout le visuel existant pouvait repartir de zéro. L'inventaire montre
qu'il est petit : les jetons de `globals.css`, les polices, l'habillage de l'administration. La
logique n'est pas concernée. Les polices actuelles, Instrument Serif et Inter, forment un duo très
répandu qui ferait générique : elles sont les premières à partir.

La veille a tourné en trois agents parallèles, triée dans `veille.md`. Ce qui en sort de plus
utile n'est pas un effet mais une règle : les meilleurs sites ont **une seule scène spectaculaire**
et une grammaire sobre partout ailleurs. La pile proposée est GSAP seul plus le CSS natif, sans
Lenis, Motion, Rive ni 3D au premier lot, et j'ai revérifié moi-même les versions dans le registre
plutôt que de me fier aux rapports. Les deux agents du web ont croisé une injection dans la
documentation Next.js, un bloc qui invite les agents à installer un paquet : ignorée, rien
d'exécuté.

- Portée : `CLAUDE.md`, `ROADMAP.md`, `veille.md` (nouveau), mémoire de projet.
- Vérifié : versions de `gsap`, `@gsap/react` et `next` relues dans le registre npm. Aucune
  référence encore vue à l'écran, c'est une limite assumée de cette passe.
- Suite : ouvrir les références retenues dans le navigateur, puis trancher le système de design
  (couleurs, typographie, largeurs, grammaire du mouvement) et la montée vers Next 16.3.5.

**12:40** · **[technique] Montée vers Next 16.3.5 et React 19.3.0**

Décidée avec l'utilisateur avant d'écrire la moindre page publique : les transitions entre pages,
qui porteront le passage de la carte d'un joueur à sa fiche, ne sont qu'expérimentales en 15.5 et
stables en 16. Le code est encore petit, la montée ne coûtera jamais moins cher qu'aujourd'hui.

Versions choisies sous la règle des quinze jours et lues dans le registre, pas déduites : Next
16.3.7 était sortie le matin même, la 16.3.5 du 11-09 est la plus récente admissible. React, ses
types et `eslint-config-next` suivent, en versions exactes. Aucun nouveau paquet ne lance de script
à l'installation, l'audit de production est vide.

Deux effets de bord de Next 16, qui valent d'être écrits. `next build` ne lance plus le lint : le
commentaire de `next.config.ts` le promettait encore, il est corrigé et le lint se passe à part.
Et `next dev` a écrit de lui-même un bloc d'instructions pour agents dans `CLAUDE.md`. Traité
d'abord comme une injection possible, vérifié en lisant le code de Next : c'est un comportement
voulu, qui réécrit le bloc à chaque lancement si on l'efface. Il est déplacé dans `AGENTS.md`, que
Next préfère, et la convention est au codex.

- Portée : `package.json`, `package-lock.json`, `eslint.config.mjs` (configuration plate native),
  `next.config.ts`, `tsconfig.json` (ajusté par Next), `AGENTS.md` (nouveau), `codex.md`,
  `ROADMAP.md`.
- Vérifié : `tsc --noEmit`, `npm run lint` et `next build` sans erreur. Dans le navigateur, écrans
  saisons et effectif affichés depuis la base, console sans erreur ni avertissement, `CLAUDE.md`
  intact après relancement du serveur.
- Suite : l'utilisateur parcourt les références de `veille.md` et dit ce qui lui parle, puis on
  tranche le système de design en salves de questions.

**14:30** · **[cadrage] Références jugées et système de design orienté**

Reprise après une coupure de session, reconstituée depuis `veille.md` et ce carnet. L'utilisateur a
ouvert les références et les a jugées à l'écran. Retenus : Lando Norris pour le mouvement, Cadillac
F1 pour la fiche joueur, Toulouse FC pour l'effectif, Radian pour le terrain et les postes,
Volleyball World pour la série intégrée. Écartés : LOVB, EF, The Immortals, et The Last Dance, jugé
à la limite de l'illisible. Alaba est superbe mais hors de portée d'une équipe amateur, qui n'aura
jamais autant de matière par joueur : la fiche se conçoit donc sur peu de données.

Quatre salves ont suivi et toutes les options recommandées ont été prises sauf une. Pour les
portraits, pas de séance photo dédiée : on reprend les photos existantes et c'est le site qui les
harmonise, par une bichromie aux couleurs de l'équipe et un point de visage cliqué dans
l'administration. Ce choix déplace le travail vers le code, et il ajoute un champ au schéma.

Le reste : fond sombre et une couleur vive, titres en grotesque condensée libre, bandeaux pleine
largeur et colonne de lecture étroite, mouvement nerveux et net, scène du ballon en transition sous
l'ouverture de l'accueil avec une version mobile courte, prochain match en tableau de score de
gymnase. Le détail est dans `veille.md`, sections 6 et 7.

- Portée : `veille.md`, `ROADMAP.md`, `carnetdebord.md`.
- Vérifié : rien à vérifier, aucun code écrit dans cette entrée.
- Suite : récupérer les couleurs de l'équipe (maillot, logo, réseaux), puis construire la planche
  de style : palette, trois polices condensées libres, un portrait en bichromie, le tableau de
  score. Le prototype du ballon vient ensuite.

**14:40** · **[cadrage] Palette tirée du maillot**

L'utilisateur a donné la page compétition du club. L'équipe de Projet Volley est le Départemental 2
masculin du VF Francheville. Le club est en marine et rouge, mais les maillots sont turquoise avec
un motif de triangles marine, violet et blanc : c'est le maillot qui est retenu. C'est lui qu'on
voit dans la série et sur les photos, la bichromie des portraits tombera donc juste, et le site se
distingue de celui du club au lieu de le doubler.

Le motif de triangles est la meilleure trouvaille de la séance : une signature propre à l'équipe,
qu'aucune référence de la veille ne pouvait donner. Il reste discret, en texture et en volet de
transition. Le club est cité sobrement, avec un lien, sans son logo, faute d'accord du bureau.

- Portée : `veille.md` (section 8), `carnetdebord.md`.
- Vérifié : page du club vue à l'écran en 1440 px, les maillots lus sur les photos des équipes.
- Suite : construire la planche de style, avec le fond nuit, le turquoise mesuré sur de vraies
  photos, trois condensées libres, un portrait en bichromie, le motif de triangles et le tableau
  de score.

**14:55** · **[design] Planche de style**

Pas encore de photo de la D2 : la planche est construite avec une photo d'une équipe senior du club,
téléchargée dans `public/_local/`, ignoré par git. Elle ne quitte pas le poste et sera remplacée.

La planche est une route `/planche`, réservée au développement (`notFound` en production, jamais
indexée), avec ses propres jetons : `globals.css` et l'administration ne bougent pas tant que rien
n'est tranché. Elle montre la palette (teinte d'écran à côté de la teinte mesurée sur la photo),
les trois condensées candidates sur le même texte, la photo en bichromie et en trichromie, quatre
cartes joueurs, le motif du maillot à trois intensités et le tableau de score avant et après
match. Un bouton bascule la police des cartes et du tableau entre les trois candidates.

Les cartes sont toutes découpées dans une seule photo de groupe, par un point de visage relevé à la
main : le pire cas, et il tient. Un défaut trouvé en le regardant : l'optimiseur d'images servait
la taille affichée du cadre, puis la photo était agrandie cinq fois, d'où du flou. La taille
demandée intègre désormais le zoom. La leçon vaudra pour le vrai composant.

- Portée : `src/app/planche/` (nouveau), `.gitignore`.
- Vérifié : `tsc`, lint, rendu à l'écran en 1440 et 390 px, bascule de police, aucun
  défilement horizontal en mobile, console sans erreur hors l'icône du site absente.
- Suite : l'utilisateur tranche sur la planche (police A, B ou C, bichromie ou trichromie,
  intensité du motif). Puis les jetons montent dans `globals.css` et on attaque le prototype du
  ballon.

**15:20** · **[admin] Filigrane, puis les matchs de bout en bout**

L'utilisateur trouve le motif du maillot trop voyant et le veut à peine perceptible. Il passe en
filigrane sur la planche, en trois variantes : contour fin qui s'efface vers les bords, ton sur ton
presque noir, halo façon projecteur. Les choix de la planche restent en suspens, l'utilisateur
devant partir : il m'a demandé d'enchaîner sur ce que je pouvais faire seul.

J'ai pris les matchs de l'administration, que la feuille de route donnait comme indépendants du
visuel. La liste d'une saison met en tête les matchs passés sans score, parce que c'est la relance
qui fait vivre le site. Le calendrier se saisit d'un coup dans une grille, tout ou rien, et la
grille survit à un refus : React vide un formulaire après chaque envoi, et vingt lignes perdues sur
une faute de frappe feraient abandonner la saisie. Une date posée sans heure reprend celle de la
ligne du dessus, et domicile et extérieur alternent d'office.

L'écran de score est pensé pour le gymnase : gros chiffres, clavier numérique, passage automatique
au champ suivant après deux chiffres, un set de plus seulement si le match n'est pas décidé, total
calculé sous les yeux. Il accepte aussi le score final seul. L'analyse distingue ce qui est
impossible, refusé, de ce qui est inhabituel, signalé mais enregistrable : c'est l'ami qui sait ce
qui s'est passé dans la salle.

Deux pièges évités, qui valent d'être écrits. Une heure saisie doit être lue comme heure de Paris,
alors que le VPS tourne en heure universelle : sans conversion, chaque match aurait été décalé.
Et importer le schéma dans un formulaire client aurait embarqué Drizzle dans le navigateur, d'où un
fichier de libellés à part. Premiers tests automatisés du projet, avec l'exécuteur intégré à Node,
sans nouvelle dépendance.

- Portée : `src/lib/score.ts`, `src/lib/rencontres.ts`, `src/lib/etats-rencontre.ts`,
  `src/lib/dates.ts`, leurs tests, `src/app/administration/(interieur)/matchs/`, `src/app/planche/`,
  `package.json` (script `test`), `codex.md`, `ROADMAP.md`.
- Vérifié : 18 tests (sets, score final, heures d'été et d'hiver, dates impossibles), `tsc`, lint,
  `next build`, `/planche` en 404 sur un serveur de production. À l'écran avec ta session de
  développement : liste, score saisi en une frappe continue sur 390 px puis relu en base, refus
  d'un set à égalité sans perte de saisie, calendrier refusé puis accepté (heure 20 h 30 relue
  19:30 UTC en novembre), modification, corbeille, restauration. Les deux matchs de test et un
  compte de vérification créés pour l'occasion ont été supprimés ; le match de démonstration
  contre Sainte-Colombe garde le score saisi pendant le test.
- Suite : l'utilisateur tranche sur la planche (police A, B ou C, bichromie ou trichromie,
  variante du filigrane), puis les jetons montent dans `globals.css` et on attaque le prototype
  du ballon.

**16:05** · **[admin] Épisodes de la série et tableau de bord**

Toujours en autonomie, l'utilisateur m'ayant demandé ce que je pouvais encore avancer seul. Les
épisodes d'abord, parce que la série est le pilier du site et que le schéma était prêt. L'ami colle
le lien de la vidéo tel qu'il le copie, lien de partage, barre du navigateur, Shorts ou direct, et
le site en tire l'identifiant. Seuls les domaines de YouTube sont acceptés : l'identifiant finit
dans un lecteur intégré, il ne doit pas pouvoir venir d'ailleurs. La miniature s'affiche dès que
le lien est reconnu, ce qui dit tout de suite si c'est la bonne vidéo.

Un épisode naît en brouillon et se publie d'un geste séparé, sous le droit de publier. Publier pose
la date du jour si la date de sortie manque. Un épisode lié à un match prend la saison du match,
sinon la saison courante. Le formulaire garde ses champs contrôlés, pour qu'un lien mal collé
n'efface pas un résumé déjà écrit, et repart vide avec le numéro suivant après un ajout.

Le tableau de bord ne dit plus que ce qui attend une action : les scores à saisir, les épisodes en
brouillon, le prochain match. C'est la première page vue à chaque connexion, donc l'endroit où un
score oublié doit se voir.

- Portée : `src/lib/youtube.ts` et son test, `src/lib/episodes.ts`, `src/lib/rencontres.ts`
  (`prochainMatch`), `src/app/administration/(interieur)/episodes/`,
  `src/app/administration/(interieur)/page.tsx`, `ROADMAP.md`.
- Vérifié : 21 tests (dont douze formes d'adresse YouTube et les domaines déguisés), `tsc`, lint,
  `next build`. À l'écran : miniature en direct, ajout en brouillon, formulaire remis à zéro avec
  le numéro suivant, adresse d'un autre domaine refusée sans perte du résumé, brouillon signalé sur
  le tableau de bord, publication (date posée, saison courante), liaison à un match, corbeille.
  L'épisode de test a été supprimé de la base.
- Suite : trancher la planche de style. En autonomie, les actualités ensuite, une fois décidé le
  format du texte (paragraphes simples ou mise en forme légère).

**16:40** · **[admin] Actualités, puis la vitrine du projet**

L'utilisateur a choisi une mise en forme légère pour les actualités, puis le staff, les
partenaires et la chronologie comme chantier suivant.

Le format des actualités est écrit dans le projet : intertitre, gras, italique et lien, rien
d'autre. Aucun paquet ajouté, un analyseur lisible en entier, et un rendu en éléments React qui
n'injecte jamais de HTML : un `<script>` tapé dans le texte s'affiche comme du texte, et seules
les adresses web et de messagerie deviennent des liens. L'éditeur pose la syntaxe par des boutons
et montre l'aperçu avec le composant même que les pages publiques réutiliseront. Le test à l'écran
a trouvé un vrai défaut : un intertitre suivi directement d'un paragraphe s'affichait avec ses
dièses. L'analyseur le détache désormais, puisque c'est ainsi qu'on l'écrit spontanément.

La vitrine du projet est réservée à l'administrateur, sous un droit neuf, `gererProjet` : le plan
ne la confiait pas au rédacteur, c'est ce que le site dit de lui-même. Trois onglets, un ordre
choisi par des boutons monter et descendre plutôt qu'un glisser-déposer, qui se passe mal au doigt
et au clavier, et une liste renumérotée à chaque déplacement. Les étapes naissent en brouillon, les
partenaires se mettent en pause sans disparaître, et leur lien n'accepte qu'une adresse web. Photos
et logos attendent l'envoi vers R2.

- Portée : `src/lib/texte-leger.ts`, `src/components/texte-leger.tsx`,
  `src/components/editeur-texte-leger.tsx`, `src/lib/actualites.ts`, `src/lib/ordre.ts`,
  `src/lib/projet.ts`, `src/lib/slug.ts` (adresse libre factorisée), `src/lib/auth/roles.ts`,
  `src/app/administration/(interieur)/actualites/` et `projet/`, la coquille, le tableau de bord,
  `codex.md`, `ROADMAP.md`.
- Vérifié : 34 tests, `tsc`, lint, `next build`. À l'écran : actualité écrite avec les boutons,
  aperçu (script affiché en texte), brouillon enregistré depuis l'aperçu, publication, extrait sans
  balisage ; étape déplacée puis remise, ajout refusé sans perte de saisie puis accepté ; lien
  `javascript:` d'un partenaire refusé côté serveur. Données de test supprimées, ordre de
  démonstration rétabli.
- Suite : l'utilisateur tranche la planche de style. En autonomie, il reste le classement, les
  comptes et les messages, puis l'envoi d'images vers R2, qui demande le bucket.

**17:55** · **[design] Planche tranchée, système figé**

De retour devant l'écran, l'utilisateur a jugé la planche. Trichromie pour les portraits, jugée
moins violente que la bichromie. Contour pour le filigrane, et le halo gardé pour un seul endroit,
la scène du ballon, où il deviendra mouvement. Il a rappelé qu'un match peut aller au cinquième
set : le tableau de score montre désormais ce cas, le plus large sur un téléphone, et le test a
fait apparaître des scores coupés au tiret, corrigés.

Il n'arrivait pas à choisir la police. La mesure du cinquième set a tranché mieux qu'un goût :
Big Shoulders n'a pas de chiffres à largeur fixe, « 22-25 » y est plus large que « 25-21 », et un
score qui défile bougerait de côté. Archivo retenue, une seule famille pour tout, avec un axe de
largeur qui s'anime. L'administration reste claire, sur les mêmes teintes, avec le turquoise foncé
pour les actions, lisible sur blanc.

Le système est dans `globals.css` : couleurs de nuit et claires, `titre-affiche` et `titre-admin`,
trois largeurs, trois durées et deux courbes partagées avec GSAP. Les quinze écrans
d'administration ont basculé d'un coup, sans toucher à leur logique.

- Portée : `src/app/globals.css`, `src/app/layout.tsx`, `src/app/page.tsx`, les titres de
  `src/app/administration/`, `src/app/planche/tableau-score.tsx`, `veille.md` (section 9),
  `codex.md`, `ROADMAP.md`.
- Vérifié : `tsc`, lint ; cinq sets mesurés sur 375 px avec les trois polices ; administration et
  accueil provisoire vus à l'écran en 1280 px.
- Suite : cadrer puis construire le prototype de la scène du ballon, avec GSAP 3.15.0.

**18:35** · **[motion] Prototype de la scène du ballon**

Cadrée en une salve avec l'utilisateur : une attaque, passe haute puis smash ; un trait fin façon
schéma de coach ; pilotée par le défilement sans bloquer la molette ; le halo révèle le motif du
maillot dans le sillage du ballon, puis le tableau du prochain match s'allume à l'impact.

GSAP 3.15.0 et `@gsap/react` 2.1.2 installés en versions exactes, après lecture des dates de
publication (avril 2026 et janvier 2025) et vérification qu'aucun ne lance de script. Un seul point
d'entrée, `lib/gsap.ts`. Le ballon n'utilise pas l'extension de trajectoire : il est placé à la
main sur trois tracés, ce qui donne au passage sa position exacte pour centrer le halo.

Trois défauts trouvés en regardant, dont deux qu'aucun test n'aurait vus. Le filet en perspective
faisait traverser le ballon à son extrémité lointaine : la marge se vérifie désormais sur toute la
largeur du panneau, par un test, et la frappe est plus haute, ce qui est d'ailleurs plus juste.
Sur téléphone, rien ne s'animait : `gsap.matchMedia()` n'exécute sa fonction que si une condition
au moins est vraie, et ni « grand écran » ni « mouvement réduit » ne l'étaient. Enfin, en
mouvement réduit, la section gardait sa longue course de défilement sans rien à montrer : elle
reprend sa hauteur naturelle.

- Portée : `src/lib/gsap.ts`, `src/components/public/` (scène, géométrie et son test, tableau du
  prochain match), `src/components/motif.tsx` (déplacé depuis la planche), `src/app/prototype/`,
  `package.json`, `package-lock.json`, `ROADMAP.md`.
- Vérifié : 40 tests dont la géométrie des deux cadrages, `tsc`, lint, `next build`, audit de
  production vide. À l'écran en 1440 et 390 px : passe, sommet, frappe, smash, impact et tableau
  allumé, retour en arrière au défilement inverse ; mouvement réduit émulé, état final immédiat et
  section non épinglée.
- Suite : l'utilisateur juge la scène. Puis la fiche de la page d'accueil, où elle prendra place.

**18:55** · **[motion] Scène du ballon, deuxième version**

Retours de l'utilisateur sur le prototype : passe moins en cloche, plus d'étiquettes « Passe » ni
« Attaque », ressentir les deux impacts, un rebond qui sort du champ, un ballon plus gros, et un
déclenchement automatique plutôt qu'un pilotage au défilement.

La scène se joue désormais d'elle-même quand elle est entièrement à l'écran, en moins de deux
secondes, et se rejoue si l'on remonte au-dessus. La longue section épinglée disparaît avec le
pilotage : la page défile normalement. À la frappe, le ballon s'écrase, un éclat part en étoile et
la scène tremble ; au sol, écrasement, trois ondes, secousse plus forte, le sol s'éclaire et le
tableau s'allume en grésillant comme un néon ; puis le ballon rebondit et sort par la droite. Le
rendu serveur est l'état de départ : les tracés portent `pathLength="1"` et se masquent sans être
mesurés, rien ne clignote avant l'animation.

Deux défauts attrapés en figeant la chronologie image par image, ce que permet un accès à GSAP
réservé au développement. La fonction qui enchaîne les temps plaçait tout à la fin de la
chronologie, si bien que le smash serait parti après la fin des effets de frappe : chaque temps
reçoit maintenant sa position. Et changer l'origine d'un même groupe en pleine animation laissait
le ballon décalé de quatorze unités après l'impact : deux groupes d'écrasement, chacun son origine.
Le navigateur de test a aussi bridé les animations à deux images par seconde après un
redimensionnement, page vide comprise : un artefact d'environnement, pas de la scène.

- Portée : `src/components/public/` (géométrie et tests, scène découpée en dessin et animation),
  `src/lib/gsap.ts`, `src/app/prototype/ballon/page.tsx`.
- Vérifié : 44 tests (marge au filet sur toute sa largeur, passe tendue, sortie du cadre), `tsc`,
  lint, `next build`. Chronologie relevée en temps réel en 1440 px (passe, frappe à 0,96 s, sol à
  1,2 s, sortie à 1,9 s, néon), impacts figés à l'image près en 1440 et 390 px, mouvement réduit
  émulé.
- Suite : l'utilisateur juge la deuxième version, puis la fiche de la page d'accueil.

**22:10** · **[motion] Scène du ballon, fluidité**

Trois retours : l'éclat de la frappe « attendait » visible avant la frappe, « Point » devait
partir, et l'utilisateur voulait encore plus de fluidité. Il estime qu'on tient quelque chose.

L'éclat venait d'un comportement de GSAP : `fromTo()` pose son état de départ dès la construction
de la chronologie. L'éclat était donc à opacité pleine dès le chargement, et le sol allumé d'avance.
Ces effets passent en `immediateRender: false`, ils n'existent qu'à leur instant.

Pour la fluidité, le ballon et le halo quittent le SVG pour des calques HTML déplacés par
`translate3d`, avec les setters rapides de GSAP : la carte graphique les fait glisser, là où
déplacer un élément dans un SVG obligeait à repeindre tout le SVG à chaque image. Le halo devient
une fenêtre ronde qui se déplace, avec le motif contre-déplacé dedans pour rester fixe sur le
terrain. Le ballon s'étire dans l'axe du smash, un flou de vitesse dessiné, par trois calques
(orienter, étirer, réorienter). Mesuré en temps réel : 550 images sur le geste, à 240 par seconde,
aucune image perdue, la pire à 8,4 ms.

Un défaut caché trouvé en figeant la chronologie : GSAP arrondit au pixel par défaut, et sur des
tracés normalisés de 0 à 1 le pointillé sautait d'un coup de masqué à complet au lieu de suivre le
ballon. `autoRound: false` sur ces tweens.

- Portée : `src/components/public/ballon-scene.tsx`, `ballon-filet.tsx`.
- Vérifié : 44 tests, `tsc`, lint, `next build` ; éclat à 0 et sol à 0,35 avant la frappe ; tracé
  relevé à 0,94 puis 0,68 pendant le smash ; mesure d'images en temps réel en 1440 px.
- Suite : la scène est validée dans son principe. Fiche de la page d'accueil, où elle prendra
  place sous l'ouverture.

**22:35** · **[cadrage] L'intro de l'accueil, fiche d'ouverture**

Deux retouches sur la scène d'abord : la version téléphone passe d'un cadre 3/4 à 9/10, filet
rapproché de la gauche, et le tableau du prochain match se voit désormais au moment de l'impact.

Puis une proposition de l'utilisateur, qui change l'accueil : ouvrir le site sur le point de
volley, rendu plus riche (tableau de score, public), une exclamation de joie visuelle, puis le
terrain qui se transforme en titre. Jouée une fois par visite. Mon avis a été favorable, avec trois
garde-fous que j'ai posés comme non négociables : quatre secondes au plus, passable dès la première
image, et une fin qui est l'ouverture de la page elle-même plutôt qu'un rideau. Cette intro assouplit
consciemment la règle « pas d'écran de chargement » ; ces garde-fous sont ce qui la rend tenable.

Arbitrages : une fois par visite (session du navigateur) ; à l'impact, le tableau passe de 24-23 à
25-23 et un public en points bondit ; l'utilisateur a refusé le motif qui éclate à l'écran et
proposé de le faire vivre dans le public, en bandeau, que je lis comme le bandeau LED de la salle ;
l'intro devient l'ouverture ; la scène du ballon sous l'ouverture disparaît au profit d'un bloc
prochain match, pour ne pas jouer deux fois le même geste. MorphSVG, DrawSVG et SplitText sont
vérifiés présents dans GSAP 3.15.0 installé : rien à ajouter pour l'animation.

- Portée : `fiches/accueil-ouverture.md` (nouveau), `src/components/public/` (cadrage téléphone).
- Vérifié : 44 tests ; cadrage téléphone vu à l'écran en 390 px ; présence des extensions de GSAP
  lue dans `node_modules`.
- Suite : l'utilisateur valide la fiche d'ouverture, en particulier la lecture « bandeau LED », puis
  on construit l'intro sur `/prototype/ballon` avant de l'installer sur l'accueil.

**23:35** · **[motion] L'intro de l'accueil, premier prototype complet**

Fiche validée par l'utilisateur, « bandeau LED » compris. Construite sur `/prototype/ouverture` :
la salle se trace, le tableau affiche 24-23 (balle de set), le point se joue avec le geste du
prototype, le score roule à 25, le public en points bondit, le bandeau s'emballe, puis les lignes du
terrain se transforment en « PROJET VOLLEY », qui reste en place comme ouverture. 3,8 s, passable
à tout moment, une fois par visite.

Le geste a d'abord été extrait dans `ballon-geste.ts` et le terrain dans `Terrain`, partagés avec
la scène du prototype, vérifiée sans régression au centième. Le titre est converti en tracés par
`scripts/titre-en-traces.py` (fontTools 4.65.0, épinglé sous la règle des quinze jours, dans un
environnement Python isolé, sans aucune dépendance npm) : relancer le script suffira le jour du vrai
nom. Les lettres de « PROJET » naissent de la trajectoire, celles de « VOLLEY » du sol, par un
découpage testé.

Le serveur rend l'état final ; un script en ligne décide avant le premier affichage si l'intro joue,
d'où zéro image parasite pour un visiteur qui l'a déjà vue. Un filet de sécurité CSS rétablit l'état
final au bout de six secondes si le JavaScript échoue. Un défaut trouvé : en développement, React
exécute l'effet deux fois, et le second passage relisait la ligne de départ comme cible, le titre ne
bougeait plus. Les cibles viennent désormais du fichier généré, jamais du DOM.

- Portée : `src/components/public/intro/` (nouveau), `ballon-geste.ts`, `ballon-scene.tsx`,
  `ballon-filet.tsx`, `titre-traces.ts` (généré), `scripts/titre-en-traces.py`, `src/lib/gsap.ts`
  (DrawSVG, MorphSVG), `globals.css`, `layout.tsx`, `src/app/prototype/ouverture/`.
- Vérifié : 57 tests, `tsc`, lint, `next build`. En 1440 px : lecture complète 3,8 s, 896 images
  sans perte (pire 12,6 ms) ; visiteur qui revient sans aucune classe d'intro ; « Passer » en 58 ms
  vers l'état final ; tableau, joie et titre final vus figés. En 390 px : joie et titre final vus.
- Suite : l'utilisateur regarde l'intro (bouton « Rejouer l'intro » en bas du prototype) et sur son
  téléphone. Puis l'installer sur l'accueil, et le bloc prochain match simple à la place de la scène.

**00:15** · **[perf] Intro plus légère au démarrage, motif du maillot corrigé**

Mesure demandée par l'utilisateur, faite sur un build de production local, au processeur bridé six
fois (Android d'entrée de gamme) : environ 315 Ko transférés au premier chargement (socle React et
Next 144 Ko, police 88 Ko, intro 57 Ko, HTML 14 Ko), premier affichage sous 0,35 s, intro fidèle à
3,8 s. Un seul défaut perceptible : un accroc au démarrage, deux blocages de 64 et 87 ms.

Deux causes traitées. Le public était animé point par point, plus de cinq cents animations à
préparer : il bondit désormais par dix-huit groupes (rang et portion de tribune), en ordre
aléatoire. Et en regardant où tombaient les saccades, un défaut plus gênant est apparu : le serveur
montrait la salle dessinée, puis l'animation l'effaçait pour la retracer, d'où un flash sur
téléphone lent. La salle est maintenant rendue en veilleuse et s'allume : la première image de
l'intro est celle déjà affichée. Le tracé progressif et l'extension DrawSVG disparaissent. Résultat
mesuré trois fois : plus aucun blocage au-dessus de 50 ms, opacité du public strictement croissante
depuis la première image, saccades résiduelles toutes dans la demi-seconde de démarrage de la page,
salle immobile.

L'utilisateur trouvait le motif du bandeau méconnaissable. Relevé sur la photo : le maillot n'est
pas fait de losanges fendus mais de carrés coupés en deux par une diagonale, orientés différemment.
Le composant `Motif` est réécrit sur ce modèle, ce qui corrige d'un coup le bandeau, le filigrane et
le halo ; le bandeau passe en motif plein, comme le tissu.

- Portée : `src/components/motif.tsx`, `src/components/public/intro/`, `ballon-scene.tsx`,
  `globals.css`, `src/lib/gsap.ts`, la planche et le prototype du ballon (nouvelle API du motif).
- Vérifié : 57 tests, `tsc`, lint, `next build` ; trois mesures au processeur bridé sur build de
  production (ouverture temporaire des prototypes, retirée après) ; bandeau vu en gros plan.
- Suite : l'utilisateur juge le nouveau motif et l'allumage de la salle. Puis installer l'intro sur
  l'accueil avec le bloc prochain match branché sur la base.

## 30-09-2026

**00:25** · **[motion] La balle de set respire**

L'utilisateur aime l'intro mais la trouvait trop pressée : on n'avait pas le temps de voir le
24-23, qui est tout le suspense. « Balle de set » pulse désormais deux fois sur le tableau et la
passe ne part qu'à la première seconde ; la transformation en titre, un peu plus serrée, garde le
total à 3,9 s, sous les quatre secondes promises par la fiche.

En mesurant la durée, un défaut caché : le public bondissait en quatre vagues successives pendant
2,3 s, bien après la fin de l'intro. Un `repeat` posé à côté d'un échelonnement répète toute la
vague ; placé dans l'échelonnement, il répète chaque groupe. Corrigé, la joie tient en une seconde.

- Portée : `src/components/public/intro/animation-ouverture.tsx`, `fiches/accueil-ouverture.md`.
- Vérifié : 57 tests, `tsc`, lint ; durée mesurée en temps réel à 3,86 s (chronologie 3,90 s),
  l'élément le plus tardif identifié avant et après correction.
- Suite : installer l'intro sur l'accueil, avec le bloc prochain match branché sur la base.

**00:30** · **[cadrage] La palette est à revoir en premier**

Fin de séance. L'utilisateur est content de l'intro pour une première version, et pose la priorité
de la prochaine séance : la palette, qu'il trouve « beaucoup trop site IA ». Fond nuit bleuté,
turquoise lumineux, lueurs de néon : c'est le réflexe générique des sites sombres produits en
série, et il a raison de le relever. La palette avait été tirée du maillot, mais le choix du fond
nuit et de l'éclat turquoise ravivé l'a tirée vers ce cliché.

À cadrer d'abord, avant l'installation de l'intro sur l'accueil : elle touche le site public,
l'intro, l'administration et la planche, qui partagent les mêmes jetons dans `globals.css`, donc un
changement se fera en une fois.

- Portée : `ROADMAP.md`, `carnetdebord.md`.
- Vérifié : rien à vérifier, aucun code dans cette entrée.
- Suite : cadrer la palette en salve de questions (fond clair ou sombre, couleurs du maillot
  gardées ou non, références qui ne ressemblent pas à un site généré), puis la décliner dans
  `globals.css`.

**10:25** · **[design] La palette devient un programme de match imprimé**

Première séance consacrée à la palette jugée « trop site IA ». Deux salves de questions ont fixé
le cap : fond papier clair, teintes réelles du maillot sans les raviver, jaune du ballon en
accent, univers d'imprimé sportif, encre violette pour le texte, grain très léger,
administration sur les mêmes jetons sans matière.

L'utilisateur m'a arrêté avant l'application : la méthode des trois casquettes n'avait pas été
suivie, je proposais des teintes sans veille ni fiche. Rattrapé par trois veilles parallèles
(imprimé sportif, sites actuels à fond clair, codes du volley), triées dans `veille.md` section
10, puis une fiche `fiches/palette.md` validée. La veille a corrigé trois choses : un papier moins
jaune pour éviter le sépia, un ocre pour le jaune en petit, et l'abandon du vert et du rouge des
résultats, remplacés par une pastille pleine ou en contour. L'utilisateur a ajouté une fonction
par couleur (turquoise l'équipe, violet les matchs, jaune le direct).

L'intro validée n'est pas perdue : étiquette `intro-nuit-v1`, dossier `intro-nuit/`, et une
classe `.palette-nuit` qui lui garde ses couleurs. Deux écarts assumés à la fiche : un jeton
`erreur` pour les erreurs de saisie de l'administration, et un jeton `champ`, papier presque
blanc, pour les champs qui étaient en blanc pur. Une lecture de la veille a renvoyé une phrase
adressée à un agent (site de Perugia) : ignorée, référence écartée.

- Portée : `globals.css`, `fiches/palette.md`, `veille.md`, planche réécrite, tableau du prochain
  match, `pastille-resultat.tsx`, administration (messages, champs, bandeau de démonstration),
  intro déplacée dans `intro-nuit/`.
- Vérifié : 57 tests, `tsc`, lint, `next build` ; à l'écran la planche en 1440 et 390 px (aucun
  défilement horizontal), l'accueil et les matchs de l'administration en 390 px.
- Suite : l'utilisateur juge la planche à l'écran (la pastille de résultat sur le violet est à
  trancher). Puis la fiche de la nouvelle intro, salle dessinée à l'encre sur papier.

**11:35** · **[design] Version 2 : le gymnase le soir**

La palette papier n'a pas passé l'écran. L'utilisateur aimait le style de la veille, moderne,
limite néon, et le tableau du prochain match, jugé plus réel. Son reproche du matin ne
visait que l'air de site généré, et je l'avais lu comme un rejet du sombre : mes quatre
recommandations de la première salve fuyaient toutes la nuit. Leçon notée en mémoire.

Recadrage en une salve : on revient au sombre, mais réel. Deux veilles parallèles (le vrai
matériel de gymnase, les sites sombres qui ne font pas générés, `veille.md` section 11) ont donné
le diagnostic : la palette du 29-09 cochait cinq des six signes du sombre généré. Le bleu nuit
devient un noir violacé tiré du maillot, le cyan ravivé redevient le turquoise réel (qui se lit
tel quel sur ce noir, 5,8 pour 1), et la lumière ne vit plus que sur trois objets : le tableau,
le bandeau LED, le ballon. Survol par inversion, focus jaune, plus de verre dépoli.

Le tableau revient en LED ambre, dessinées en SVG : chaque segment est une rangée de points,
comme sur les tableaux Bodet, et les segments éteints restent visibles. Première version trop
espacée, illisible à taille réelle pour les chiffres à peu de segments : points resserrés,
segments éteints assombris. L'intro passe à la nuit réelle sans changer un geste ; défaut trouvé
à l'écran, les scores empilés 24 et 25 s'affichaient côte à côte, corrigé. L'administration passe
de nuit elle aussi, par cohérence, décision de l'utilisateur. La version 1 reste dans l'historique
(`c4d89e2`), l'intro d'origine sous l'étiquette `intro-nuit-v1`.

- Portée : `globals.css`, `fiches/palette.md` (version 2), `veille.md`, `afficheur-led.tsx`
  (nouveau), tableau du prochain match, intro (`salle.tsx`, bouton passer), ballon, planche,
  administration (bascule des jetons dans 38 fichiers).
- Vérifié : 57 tests, `tsc`, lint, `next build` ; à l'écran la planche en 1440 px, le tableau LED
  en gros plan et à taille réelle, l'intro au début, au point marqué et à la fin, les matchs de
  l'administration en 390 px.
- Suite : l'utilisateur juge la version 2 à l'écran (planche, intro, administration). Puis
  installer l'intro sur l'accueil avec le bloc prochain match branché sur la base.

**12:10** · **[design] Modernité : variantes à comparer, et les résultats refaits**

Retour de l'utilisateur sur la version 2 : le tableau du prochain match plaît beaucoup, mais
l'ensemble a perdu en modernité, et la liste des derniers résultats ne convainc pas. Diagnostic
demandé plutôt que deviné, cette fois : couleurs trop ternes, texte crème à l'effet rétro, mise
en page trop sage. Le reste (la lumière réservée aux objets lumineux) n'est pas en cause.

Plutôt que trancher sur description, la planche porte un sélecteur de quatre variantes appliquées
à toute la page : l'actuelle, « éclat » (turquoise `#2ec4b6` plus vert que le cyan du 29-09,
violet `#7d4fc4`), « net » (blanc d'écran `#f5f6f7`, noir plus profond `#0e0c11`), et les deux
ensemble. Contrastes vérifiés pour chacune.

Les résultats sont refaits : le dernier match a son tableau LED (`tableau-resultat.tsx`), frère
de celui du prochain match, les deux côte à côte ; les précédents défilent en cartes pleine
largeur avec un score géant, plein pour une victoire, en contour pour une défaite, la grammaire
de la pastille. Premier pas contre la mise en page trop sage.

- Portée : `planche/` (sélecteur, variantes, chapitre des matchs), `tableau-resultat.tsx` et
  `resultats-precedents.tsx` (nouveaux).
- Vérifié : 57 tests, `tsc`, lint ; à l'écran en 1440 px la planche en variante actuelle et
  « éclat et net ».
- Suite : l'utilisateur choisit une variante sur la planche ; je la reporte dans les jetons de
  `globals.css` et dans la fiche palette, puis j'installe l'intro sur l'accueil.

**12:30** · **[design] Variante « net » retenue, glow des LED renforcé**

L'utilisateur a comparé les variantes à l'écran et penchait pour « net », puis m'a demandé mon
avis. J'ai suivi ce choix, avec une réserve : le blanc net sur un noir profond règle l'effet rétro et
fait la modernité par le contraste, sans raviver le turquoise vers le cyan qu'on a quitté ; mais
le turquoise sourd en grand aplat restait terne. Décision : « net », turquoise en accent (un mot,
un filet, le motif), plus de bandeau turquoise pleine largeur.

Autre demande, un glow plus présent sur les chiffres LED : trois couches, du cœur saturé à
une diffusion large et faible qui éclaire le boîtier. Toujours réservé aux tableaux. Le
sélecteur de variantes est retiré de la planche, il a rempli son rôle.

- Portée : `globals.css`, `afficheur-led.tsx`, planche (bandeau de l'équipe, nuancier),
  `fiches/palette.md`, `codex.md`.
- Vérifié : `tsc`, lint ; à l'écran en 1440 px, le glow sur les deux tableaux et le chapitre de
  l'équipe en accent turquoise.
- Suite : installer l'intro sur l'accueil, avec le bloc prochain match et le dernier résultat
  branchés sur la base.

**13:20** · **[page] L'accueil branché sur la base**

Autonomie accordée à 13:03, avec la consigne de tenir les trois casquettes. Veille ciblée d'abord
(`veille.md` section 12) : sept accueils de clubs ouverts dans un navigateur. Deux places à
prendre en sont sorties, personne n'intègre bien un épisode et personne ne met l'itinéraire à
côté du prochain match, et trois contre-exemples d'états vides ratés. Puis la fiche
`fiches/accueil.md`, puis le code.

Sous l'ouverture, deux rendez-vous et une mémoire. La série : le dernier épisode, vignette
traitée comme les portraits, lecteur YouTube chargé au clic seulement. Les matchs : prochain
match et dernier résultat côte à côte en tableaux LED, qui s'allument avec un scintillement
quand on arrive devant, puis « Ajouter à l'agenda » (fichier `.ics` servi par une route à nous)
et « Itinéraire ». Enfin les matchs précédents en cartes défilantes. Le compte à rebours tourne
dans le navigateur et affiche « C'est parti » au coup d'envoi, la parade au compteur figé à 00
relevé par la veille. Actualités et partenaires attendent leurs pages : une carte qui ne s'ouvre
sur rien ferait pire que son absence.

La route d'agenda est un point d'entrée public : revue adversariale à la main, onze sondes
(slug inventé, match passé, injection d'en-tête, remontée de dossier, apostrophe, caractère de
contrôle Unicode, slug de 300 caractères, POST). Toutes refusées proprement. Un faux départ en
chemin : le serveur de développement avait planté après un `next build` lancé en parallèle, d'où
des 500 sans rapport avec le code ; redémarré, tout répond.

- Portée : `src/app/page.tsx`, `src/app/agenda/`, `src/components/public/accueil/`,
  `lecteur-episode.tsx`, `compte-rebours-led.tsx`, les deux tableaux et les cartes,
  `lib/accueil.ts`, `lib/resultats.ts`, `lib/agenda.ts` (et leurs tests), `lib/site.ts`.
- Vérifié : 70 tests (13 nouveaux), `tsc`, lint ; à l'écran l'accueil en 1440 et 390 px avec les
  données de démonstration (deux défauts mobiles corrigés : bouton sur deux lignes, noms coupés) ;
  la route d'agenda sondée. Pas encore vérifiés à l'écran : les états vides (aucun épisode, aucun
  match), couverts par la logique testée mais pas provoqués en base.
- Suite : obtenir l'adresse de la chaîne YouTube ; puis la page Matchs et la page d'un match.

**13:30** · **[revue] Critique à froid de l'accueil, et ses corrections**

Un agent qui n'avait pas construit la page l'a critiquée à trois casquettes, au navigateur, au
clavier et en mouvement réduit. Il a trouvé un défaut bloquant que je n'avais pas vu : les
révélations au défilement passaient les blocs en `visibility: hidden`, si bien qu'au chargement
la touche Tab n'atteignait aucun lien et qu'un lecteur d'écran ne lisait rien. Corrigé : on
n'anime plus que l'opacité et la position, et un bloc qui reçoit le focus se révèle aussitôt.
Mesuré ensuite : les six éléments interactifs sont joignables, chaque bloc apparaît au focus.

En corrigeant, deux pièges de plus. La scène du ballon de l'intro portait déjà un attribut
`data-revele` : mon composant l'attrapait aussi, au risque de dérégler l'intro validée ; mes blocs
prennent `data-apparait`, cherché dans la seule zone de l'accueil. Et tuer un déclencheur de
défilement dans GSAP tue l'animation qu'il pilote, sauf `kill(false, true)`. Un faux positif
aussi : le navigateur partagé était resté en mouvement réduit après les sondes de l'agent.

Le reste de la critique, appliqué : une seule règle de lecture des scores (locaux d'abord, comme
au gymnase) avec Victoire ou Défaite en toutes lettres ; le match reste trois heures au tableau
après le coup d'envoi, « Match en cours » ; la vignette de l'épisode perd son aplat turquoise ;
« Voir sur YouTube » passe en jaune tant que la chaîne manque ; contours des boutons secondaires
à 5,8 pour 1 ; focus donné au lecteur après le clic ; plus de téléchargement forcé pour l'agenda,
et un lien Google Agenda en secours ; texte lu du compte à rebours qui suit les chiffres ; icône
d'onglet ; route d'agenda non indexée.

Laissé pour plus tard : le vide en haut de l'ouverture à l'état final (intro validée, à ne pas
retoucher sans l'utilisateur), l'heure et le slug des données de démonstration (le semis
n'utilise pas le fuseau de Paris), la mesure de performance sur un vrai build et un téléphone
d'entrée de gamme.

- Portée : `accueil/revelations.tsx`, les tableaux, les cartes, `bloc-serie.tsx`,
  `bloc-tableaux.tsx`, `lecteur-episode.tsx`, `lib/resultats.ts`, `lib/agenda.ts`,
  `lib/accueil.ts`, la route d'agenda, `app/icon.svg`.
- Vérifié : 74 tests, `tsc`, lint ; au navigateur, le parcours clavier et l'état des blocs avant
  et après focus, le rendu du chapitre des matchs en 1440 px.
- Suite : l'adresse de la chaîne YouTube ; puis la page Matchs et la page d'un match.

**14:55** · **[identité] Le site s'appelle Point Par Point**

L'utilisateur a donné le vrai nom, celui de la série : « Point Par Point », et l'adresse de la
chaîne YouTube. Le nom est posé dans `lib/site.ts`, et les tracés du titre de l'intro sont
régénérés par le script prévu pour ce jour-là (fontTools 4.65.0, déjà vérifié à la première
génération, dans un environnement isolé du dossier temporaire ; police Archivo du dépôt Google
Fonts). Treize lettres par mise en page, sur trois lignes au téléphone. Le bouton « S'abonner »
apparaît. La mémoire de l'intro change de clé : chacun la reverra une fois avec le nouveau titre.

En vérifiant, le titre restait invisible à la fin de l'intro. L'enquête a montré que le
navigateur de test tournait à 3 images en 2 secondes (fenêtre masquée, machine à court de
mémoire) : GSAP ralentit alors l'intro plutôt que de sauter des images, et le filet de sécurité
CSS affichait la fin avec des lettres encore sous leur forme de départ. Pas un défaut du nouveau
titre, mais un vrai trou pour un appareil saturé : une garde en temps réel fait désormais sauter
l'intro à sa fin après 6 secondes, comme le bouton « Passer ». Vérifié dans ce navigateur bridé :
titre complet sans intervention.

Le dossier `ProjetVolley` et le dépôt `ValVoy/projet-volley` gardent leur nom : les renommer
touche le dépôt distant et les chemins, c'est à l'utilisateur de le décider.

- Portée : `lib/site.ts`, `titre-traces.ts` (régénéré), `scripts/titre-en-traces.py`,
  `intro-nuit/script-intro.ts` et `animation-ouverture.tsx`, `lib/agenda.ts`, la route d'agenda,
  planche, prototype, semis de démonstration, `CLAUDE.md`, `ROADMAP.md`, `PLAN.md`.
- Vérifié : 74 tests, `tsc`, lint ; titre à l'écran en 1440 et 390 px ; garde vérifiée dans un
  navigateur à 1,5 image par seconde.
- Suite : décision de l'utilisateur sur le renommage du dossier et du dépôt ; la page Matchs et
  la page d'un match.

**15:40** · **[page] Le calendrier et la page d'un match**

Veille d'abord (`veille.md` section 13) : six calendriers et pages de match ouverts dans un
navigateur, dont un contre-exemple parlant, un club de Ligue A qui publie tout son calendrier en
une image sans texte. Puis la fiche `fiches/matchs.md`, puis le code.

Le calendrier : le bilan collectif de la saison, le prochain match en tableau LED avec ses
actions, et une seule liste par mois avec un filet « Aujourd'hui ». Chaque ligne suit la
grammaire relevée chez la Premier League : un seul emplacement qui porte l'heure avant le match,
le score après, ou l'état en toutes lettres. Les lignes restent mates, la lumière est réservée
aux tableaux. La page d'un match : l'état commande l'ordre des blocs, et un match joué met sa
salle et son commentaire à côté du tableau pour équilibrer le grand écran.

Arbitrages faits seul : la saison passe en paramètre (`?saison=`) et non en chemin, qui serait
entré en collision avec les adresses des matchs ; l'abonnement d'agenda à la saison, la carte
statique et la transition animée liste → match sont reportés, notés dans la fiche. Le serveur de
développement est tombé deux fois sur des routes dynamiques : mesure faite, il ne restait que 1,9
Go de mémoire libre sur 32 ; redémarré, tout répond.

- Portée : `src/app/matchs/`, `src/components/public/matchs/`, `entete.tsx`,
  `actions-match.tsx` (extrait de l'accueil), `lib/calendrier.ts`, `lib/matchs-publics.ts`,
  `lib/dates.ts` (heure à la française), `tableau-resultat.tsx` (étiquette), lien depuis l'accueil.
- Vérifié : 82 tests, `tsc`, lint ; à l'écran le calendrier et les pages de match joué, à venir et
  reporté (état provoqué en base de développement puis remis) en 1440 et 390 px ; 404 sur un slug
  inconnu. Pas vus à l'écran : « score à venir » et « annulé » (logique testée).
- Suite : critique à froid des deux pages, puis la série.

**16:00** · **[revue] Critique à froid des matchs, et ses corrections**

Rien de bloquant, mais un défaut qui aurait coûté cher le jour venu : l'administration recalcule
l'adresse d'un match à chaque modification, pour qu'une faute corrigée ne reste pas dans l'URL,
si bien qu'un match reporté changeait d'adresse et que les liens déjà partagés tombaient en 404.
Plutôt que figer l'adresse, une table `anciens_slugs_rencontre` (migration additive
`0002_anciens-slugs`, appliquée en développement) garde les anciennes adresses et la page redirige
en 308. Testé par une ancienne adresse insérée puis retirée.

L'ordre du score opposait les deux critiques : l'utilisateur a tranché, notre score d'abord dans
les listes (calendrier et cartes de l'accueil), l'ordre du gymnase dans les tableaux, où les noms
sont écrits au-dessus des chiffres. Le reste : l'épisode remonte sous le tableau, le tableau prend
la largeur quand rien ne l'accompagne, le filet « Aujourd'hui » devient un vrai séparateur entre
les mois, la salle a son bloc pour un match à venir, date en double retirée, lien « Aller au
contenu », titre d'onglet corrigé, adresse vérifiée par expression avant la base, une requête de
moins, miniature prioritaire, et l'allumage des tableaux sans délai. Le semis de démonstration
prend la date de Paris et une heure réaliste (20 h 30) ; démonstration purgée puis ressemée.

- Portée : `lib/db/schema/sportif.ts`, `drizzle/0002_anciens-slugs.sql`, `lib/demo.ts`, l'action
  de modification d'un match, `lib/matchs-publics.ts`, les deux pages de matchs, les composants de
  matchs et de résultats, `layout.tsx`, `revelations.tsx`, `scripts/semer-demo.ts`.
- Vérifié : 82 tests, `tsc`, lint ; redirection 308, 404 sur une adresse inconnue ou mal formée ;
  à l'écran le calendrier en 390 px et un match joué avec épisode en 1440 px.
- Suite : la série, liste des épisodes et page d'un épisode.

**16:15** · **[page] La série**

Veille d'abord (`veille.md` section 14) : six sites de séries sportives ouverts, dont deux
primés en 2026. Aucun ne relie un épisode au match qu'il raconte, même « Welcome to Wrexham » qui
les nomme dans ses synopsis : c'est l'avantage du site, et il fonctionne dans les deux sens. Puis
la fiche `fiches/serie.md`, puis le code.

La liste : l'accroche et l'abonnement en jaune, le dernier épisode en vedette avec « Nouveau », les
autres en liste numérotée, le grand numéro rythmant la page comme un numéro de maillot. La page
d'un épisode : le lecteur au clic, le titre et le résumé, le match raconté en tableau LED avec
« Voir le match », une carte d'abonnement après le visionnage, les épisodes voisins. L'adresse
d'un épisode suit son titre : même parade que pour les matchs, table `anciens_slugs_episode`
(migration additive 0003, appliquée en développement) et redirection 308, testée.

Deux retenues volontaires : pas de durée ni de chapitres, faute de donnée en base ; et une
accroche neutre, après avoir retiré en relecture des phrases qui promettaient un contenu (les
vestiaires, un épisode après chaque temps fort) que personne n'a validé.

- Portée : `src/app/serie/`, `src/components/public/serie/`, `lib/serie.ts`, schéma éditorial et
  migration 0003, action de modification d'un épisode, purge de démonstration, `entete.tsx`,
  liens depuis la page d'un match et l'accueil.
- Vérifié : 82 tests, `tsc`, lint ; à l'écran la liste en 1440 et 390 px, un épisode en 1440 px ;
  en-tête mesurée à 375 px sans débordement ; redirection 308 d'une ancienne adresse ; 404.
- Suite : critique à froid de la série, puis l'effectif.

**16:35** · **[revue] Critique à froid de la série, et ses corrections**

Un point bloquant : le focus clavier du bouton de lecture était invisible. En le corrigeant, deux
causes empilées, instructives pour tout le site. La règle de focus de `globals.css` était écrite
hors des couches de Tailwind, et une règle hors couche l'emporte sur toutes les classes
utilitaires : aucun anneau ne pouvait être ajusté, ni ici ni sur la rangée des résultats de
l'accueil, dont la correction de la veille n'avait donc jamais pris. Elle passe dans
`@layer base`. Et l'anneau replié dans le cadre était peint sous la vignette, positionnée : le
cadre de focus est maintenant un calque au-dessus d'elle. Vérifié à la vraie touche Tab, gros plan
à l'appui.

Le reste : vignettes en haute définition avec repli (`MiniatureEpisode`, 950 pixels servis au
lieu de 455), image de partage pour les réseaux sur chaque épisode, bouton lecture jaune sur
l'épisode vedette, page d'épisode en deux colonnes avec le titre au-dessus du lecteur, libellés
qui ne disent jamais « Épisode null », tri par date de publication, « Publié le » devant les
dates, noms de liens explicites, surtitres harmonisés, redirection des adresses en majuscules.

- Portée : `globals.css`, `lecteur-episode.tsx`, `miniature-episode.tsx` (nouveau),
  `lib/youtube.ts`, `lib/serie.ts`, les deux pages de la série, `bloc-serie.tsx`,
  `blocs-match.tsx`, page d'un match.
- Vérifié : 82 tests, `tsc`, lint ; au navigateur l'anneau au clavier, la vignette HD, la balise
  `og:image`, la page d'épisode en 1440 px.
- Suite : l'effectif, grille par poste et page d'un joueur.

**16:45** · **[page] L'effectif**

Veille d'abord (`veille.md` section 15) : six clubs ouverts, dont trois qui publient la date de
naissance complète de leurs joueurs, et un club de Ligue A dont l'adresse d'un ancien joueur
affiche un nouveau. Aucun ne traite l'absence de photo. Puis la fiche `fiches/effectif.md`, puis
le code.

La grille : un groupe par poste dans l'ordre de présentation d'une équipe, des cartes toutes
égales, ni vedette ni compteur, un « C » discret pour le capitaine. Sans photo, le grand numéro
sur le motif du maillot fait portrait ; avec une photo, elle se posera en surimpression turquoise
(aucune gestion de photo n'existe encore, le composant est prêt). La page d'un joueur : identité,
âge et taille, présentation, parcours, les matchs de la saison où il était sur le terrain avec le
résultat de l'équipe, puis l'effectif par numéro. Aucun chiffre individuel au premier lot.

L'utilisateur a tranché : prénom et nom complet. L'âge seulement, jamais la date de naissance.
Reste à vérifier avant la mise en ligne que l'accord de droit à l'image couvre le site.

- Portée : `src/app/effectif/`, `src/components/public/effectif/`, `lib/effectif-public.ts`,
  `lib/postes.ts` (regroupement testé), `lib/dates.ts` (âge à instant donné), `entete.tsx`.
- Vérifié : 83 tests, `tsc`, lint ; à l'écran la grille en 1440 et 375 px (en-tête à trois
  rubriques sans débordement) et la page d'un joueur en 1440 px ; 404 sur un joueur inconnu.
- Suite : critique à froid de l'effectif.

**17:00** · **[revue] Le staff, et la critique à froid de l'effectif**

L'utilisateur a relevé l'absence du staff : je l'avais renvoyé à une future page « L'équipe
derrière ». Il ferme désormais la page de l'effectif (rôle, nom, présentation, photo si fournie),
dans l'ordre choisi dans l'administration.

La critique à froid, sans point bloquant, a surtout touché juste sur la chaleur : des groupes de
deux ou trois joueurs sur quatre colonnes laissaient la moitié droite vide, et le premier nom
tombait sous la ligne de flottaison. Recomposition : une grille continue dans l'ordre des postes,
le poste écrit au-dessus de chaque nom, des portraits plus bas, le motif lisible en turquoise, une
accroche collective ; la page passe de 3 444 à 1 549 pixels. Le reste : numéro toujours lu par les
lecteurs d'écran, effet du survol aussi au focus, traitement photo en noir et blanc avec un filet
turquoise (plus d'aplat teinté), compteur « 4 matchs » retiré (chiffre individuel), saison
indiquée pour un joueur d'une saison passée, sigle de poste sans numéro, initiale du nom dans les
raccourcis, redirection des majuscules seulement si la page existe (matchs, série, effectif).
Point ajouté à la mise en ligne : un joueur mineur demande l'accord de ses parents.

- Portée : `src/app/effectif/`, `src/components/public/effectif/` (dont `cartes.tsx`), pages de
  match et d'épisode, `fiches/effectif.md`.
- Vérifié : 83 tests, `tsc`, lint ; à l'écran la grille avec staff en 1440 et 390 px ; 404 sans
  redirection pour une adresse inconnue en majuscules.
- Suite : les actualités, puis les pages « Le projet », « Où nous voir », partenaires, contact et
  les mentions légales.

**17:20** · **[page] Les actualités**

Veille d'abord (`veille.md` section 16) : six sites mesurés dans leurs styles calculés. Ce qui en
sort pour la lecture sur fond sombre : un corps de 18 px, un interlignage plus ample que sur fond
clair, 60 à 68 caractères par ligne, pas de blanc pur. Et deux échecs répétés : des articles sans
date visible, et des rubriques vides ou périmées (celle d'un club de Ligue A est entièrement vide).

La liste : la plus récente en grand, les autres en liste datée d'une colonne, et une rubrique vide
qui renvoie vers les matchs et la série. L'article : date en toutes lettres, chapô distinct, corps
dans une colonne de 612 pixels réglée par une classe `texte-article` (18 px, interlignage 1,7,
craie de lecture à 13,6 pour 1, liens turquoise clair soulignés), partage natif ou copie du lien
sans aucun script tiers, articles voisins. Sur l'accueil, un bloc de trois actualités, masqué si
la plus récente a plus de quatre-vingt-dix jours. L'adresse d'une actualité suit son titre :
troisième table d'anciennes adresses (migration additive 0004) et redirection 308.

L'en-tête compte quatre rubriques : sur téléphone, elles passent sous le nom du site ; le pied de
page les reprend toutes. Un titre d'affiche géant débordait de l'écran au téléphone : tailles
réduites d'un cran et césure française. Débordement mesuré à 375 px sur les six pages publiques :
aucun.

- Portée : `src/app/actualites/`, `src/components/public/actualites/`, `bloc-actualites.tsx`,
  `lib/actualites-publiques.ts`, schéma éditorial et migration 0004, action de modification d'une
  actualité, purge de démonstration, `entete.tsx`, `pied-de-page.tsx`, `globals.css`.
- Vérifié : 83 tests, `tsc`, lint ; à l'écran la liste et un article en 1440 px, la liste en 375
  px, le bloc de l'accueil ; débordement à 375 px sur six pages.
- Suite : critique à froid des actualités, puis « Le projet », « Où nous voir », partenaires,
  contact, mentions légales.

**17:40** · **[retour] La grille de l'effectif par poste, rétablie**

L'utilisateur préférait la grille d'avant, une section par poste avec de grandes cartes au
numéro géant : « un vrai choix identitaire ». Je l'avais remplacée par une grille continue sur la
foi de la critique à froid, qui mesurait du vide et une page trop haute. Rétablie, en gardant ce
qui ne touche pas à ce choix : le staff, l'accroche collective, le numéro lu par les lecteurs
d'écran, l'effet du focus. Leçon notée en mémoire : un défaut se corrige seul, un choix de
composition se propose d'abord.

- Portée : `src/app/effectif/page.tsx`, `src/components/public/effectif/cartes.tsx`.
- Vérifié : `tsc`, lint ; la page en 1440 px.
- Suite : critique à froid des actualités (en cours), puis « Le projet », « Où nous voir »,
  partenaires, contact, mentions légales.

**17:55** · **[revue] Critique à froid des actualités, et ses corrections**

Rien de bloquant, et rien qui touche à un choix d'identité : tout est corrigé sans détour, selon
la règle posée une heure plus tôt. Le plus sérieux : sur ordinateur, « Partager » ouvrait la
feuille de partage de Windows au lieu de copier le lien, sans repli en cas d'erreur ; le partage
natif est désormais réservé aux écrans tactiles, la copie a son message d'échec. La colonne de
lecture comptait 69 à 74 caractères pour une cible de 60 à 68 : 31 em, environ 65. Le pied de
page lit lui-même la saison courante, identique sur toutes les pages. Le reste : hiérarchie des
titres en haut de la liste, dates balisées, titres de liste en `h3`, flèches muettes pour les
lecteurs d'écran, mots longs coupés, liens vers le site lui-même dans le même onglet, ancienne
adresse en majuscules redirigée, plus de corps d'article chargé pour une simple liste.

Effet de bord signalé à l'utilisateur : le test du partage par l'agent critique a écrit une
adresse dans le presse-papiers de la machine.

- Portée : pages et composants des actualités, `pied-de-page.tsx` (et ses neuf usages),
  `texte-leger.tsx`, `lib/actualites-publiques.ts`, `globals.css`.
- Vérifié : 83 tests, `tsc`, lint ; pied de page et colonne mesurés sur un article ; aucun
  débordement à 375 px.
- Suite : « Le projet », « Où nous voir », partenaires, contact, puis mentions légales.

**18:00** · **[rectificatif] Le partage, corrigé pour de bon**

L'entrée de 17:55 et le commit `79e1282` annonçaient le bouton « Partager » corrigé ; ce n'était
pas vrai, le script de corrections ne touchait pas ce fichier. Relevé en relisant, corrigé
maintenant : partage natif sur écran tactile seulement, copie du lien sinon, repli sur la copie
si le partage échoue autrement que par une annulation, message « Copie impossible » en cas
d'échec. Vérifié au navigateur avec une copie simulée, sans toucher au presse-papiers réel.

- Portée : `src/components/public/actualites/partager.tsx`.
- Vérifié : `tsc`, lint ; clic en 1440 px : copie appelée, partage natif non appelé, « Lien
  copié. » annoncé.
- Suite : « Le projet », « Où nous voir », partenaires, contact, puis mentions légales.

**18:20** · **[page] La vitrine : le projet, où nous voir, partenaires**

Une veille pour les trois (`veille.md` section 17) : ESTAC Troyes montre l'ordre juste pour un
petit lieu (adresse et itinéraire en tête, puis transports, parking, PMR, sans carte intégrée),
Fréjus Var Volley le contre-exemple des logos hétérogènes, non cliquables et sans texte
alternatif. Fiche `fiches/vitrine.md`.

Le projet : une phrase qui situe, puis la chronologie saisie dans l'administration, reliée par un
fil turquoise ; aucun récit inventé. Où nous voir : la salle, déduite des matchs à domicile (la
plus fréquente), avec « Itinéraire » et « Copier l'adresse », le prochain match à domicile en
tableau LED, les suivants, et un texte « Venir à la salle ». Ce texte n'existait nulle part :
l'utilisateur a choisi de l'ajouter, d'où une table `reglages` (migration additive 0005) et un
onglet « La salle » dans l'administration, en texte léger. Partenaires : un merci, des cases
égales, logos ramenés en blanc et couleur au survol, sinon le nom ; « Devenir partenaire » mène
au contact, construit juste après.

L'en-tête garde ses quatre rubriques ; ces trois pages vivent dans le pied de page, et « Où nous
voir » est relié depuis la salle d'un match à domicile.

- Portée : `src/app/le-projet/`, `src/app/ou-nous-voir/`, `src/app/partenaires/`,
  `copier-adresse.tsx`, `lib/vitrine.ts`, `lib/reglages.ts`, schéma et migration 0005, onglet
  « La salle » de l'administration, `entete.tsx`, `pied-de-page.tsx`, `blocs-match.tsx`.
- Vérifié : 83 tests, `tsc`, lint ; les trois pages en 1440 px, « Venir à la salle » avec un
  texte de test (retiré ensuite), aucun débordement à 375 px après correction des partenaires.
- Suite : le formulaire de contact, avec sa revue de sécurité.

**18:15** · **[page] Le contact, et l'écran « Messages »**

Fiche `fiches/contact.md` posée avant le code : une page calme, sans mouvement, quatre champs
(sujet, nom, e-mail, message), le sujet pré-choisi par l'adresse (« Devenir partenaire » arrive
sur `?sujet=partenariat`). Refus annoncé en tête avec la saisie conservée, confirmation qui
remplace le formulaire et prend le focus. Une phrase dit ce qu'on garde, qui le lit, et pour
combien de temps : un an.

Côté sécurité : longueurs bornées, piège à robots hors écran et hors tabulation, plafonds de
3 envois par heure et par adresse réseau et de 30 au total, adresses gardées 24 heures dans une
table séparée, jamais reliées au message. La promesse d'un an est tenue par un effacement réel,
seule exception au principe de la corbeille, déclenché à chaque envoi et à chaque ouverture de
l'écran « Messages ».

La passe adversariale a trouvé un défaut qui dépassait le contact : `lireIp` retenait la première
entrée de `X-Forwarded-For`, choisie par le client. `Coolify/ETAT.md` note que le Traefik de
Coolify ajoute la vraie adresse en fin de liste ; la fonction retient désormais la dernière. La
connexion à l'administration en profite aussi, même si son compteur par adresse visée la
protégeait déjà.

L'écran « Messages » de l'administration, relié dans la navigation mais absent jusqu'ici :
non lus d'abord, réponse par un lien e-mail pré-rempli, marquer lu, corbeille restaurable. Le
texte s'affiche en texte brut. L'entrée « Comptes » de la même navigation mène encore à une page
absente.

- Portée : `src/app/contact/`, `src/lib/envois-contact.ts`, `src/lib/messages.ts`,
  `src/lib/auth/tentatives.ts` et son test, `administration/(interieur)/messages/`, schéma et
  migration 0006, `entete.tsx` (Contact au pied de page), `fiches/contact.md`, codex, ROADMAP.
- Vérifié : 91 tests, `tsc`, lint ; à 390 px le sujet pré-choisi et aucun débordement ; un
  message trop court refusé avec saisie gardée et focus sur l'alerte ; trois envois reçus, le
  quatrième refusé ; le piège rempli donne la confirmation sans rien ranger ; en 1440 px,
  marquer lu, corbeille et restauration, une balise `<b>` saisie reste du texte. Essais retirés
  de la base de développement ensuite.
- Suite : critique à froid du contact, puis mentions légales et politique de confidentialité,
  puis l'écran « Comptes ».

**18:05** · **[correctif] La critique à froid du contact**

Un agent qui n'avait pas construit la page l'a relue : sept défauts, deux mineurs, trois
propositions de composition. Tous les défauts sont corrigés ; les propositions attendent l'avis de
l'utilisateur.

Le plus important : l'ami n'aurait jamais su qu'un message l'attendait, puisque rien ne part par
e-mail. Un compteur jaune de non lus s'affiche désormais à côté de « Messages » dans la
navigation de l'administration, et la purge d'un an y passe aussi, pour que la promesse faite au
visiteur ne dépende plus d'un nouvel envoi.

La limite de débit comptait avant d'écrire : une salve simultanée passait. L'envoi est
maintenant réservé d'abord, compté ensuite. Le refus pour plafond global ne dit plus au visiteur
qu'il a trop écrit. Le champ piège s'appelait `site_web`, un nom que les navigateurs remplissent
d'eux-mêmes, au risque d'écarter un humain en silence ; il porte un nom sans sens, et chaque
rejet est journalisé sans contenu. Le sujet choisi est gardé après un refus, le champ fautif est
marqué pour les lecteurs d'écran, la bordure des champs passe à 3,6:1 (nouveau jeton
`--color-nuit-bord`), un sujet « Une idée pour la série » rejoint la liste, et la phrase de
confidentialité mentionne l'adresse réseau gardée 24 heures.

- Portée : `src/app/contact/`, `src/lib/contact.ts` et son test, `src/lib/envois-contact.ts`,
  `src/lib/messages.ts`, `administration/(interieur)/layout.tsx`, `coquille.tsx`, `messages/`,
  `globals.css`, `fiches/contact.md`, ROADMAP.
- Vérifié : 91 tests, `tsc`, lint ; à 390 px un e-mail `a@b` refusé par le serveur garde le
  sujet choisi et marque le champ ; trois envois reçus, le quatrième refusé avec le nouveau
  texte ; compteur « 3 non lus » dans la navigation. Essais retirés de la base ensuite.
- Suite : mentions légales et politique de confidentialité (éditeur en nom seul, anonymat LCEN ;
  demandes par le formulaire ; Hetzner, Turso et R2 nommés), puis Umami sur le VPS, puis l'écran
  « Comptes ».

**18:25** · **[ui] Contact élargi, actions de l'administration à 44 px**

Deux propositions de la critique, validées par l'utilisateur. Sur grand écran, la page Contact
laissait 600 px de nuit à droite : une colonne « Ce qu'on peut vous répondre » y explique les
sujets et renvoie vers ce qui n'a pas besoin d'un message (les matchs, la salle, la série).

Dans l'administration, les actions de ligne étaient de petits liens de 14 px, pénibles au
téléphone, alors que l'ami gérera le site depuis le sien. Une classe commune `.action-admin`
(44 px, bordure discrète) les remplace sur tous les écrans ; les boutons principaux, les liens
« Retour », les onglets de saison et les flèches d'ordre passent aussi à 44 px. Les trois liens
pris dans une phrase restent des liens.

- Portée : `src/app/contact/page.tsx`, `globals.css`, `components/formulaire.tsx`, 18 écrans de
  `administration/(interieur)/`.
- Vérifié : `tsc`, lint ; contact en 1440 et 375 px ; sept écrans d'administration à 390 px,
  aucune action sous 44 px, aucun débordement.
- Suite : mentions légales et politique de confidentialité, puis Umami sur le VPS, puis l'écran
  « Comptes ».

## 30-09-2026

**22:20** · **[page] Mentions légales et confidentialité**

L'utilisateur a tranché quatre points : l'éditeur est Tom Oger, à titre de particulier, en nom
seul comme le permet la LCEN ; toutes les demandes passent par le formulaire de contact ; les trois
prestataires techniques sont nommés ; Umami, sans cookie, est installé au premier lot. Les raisons
sociales et adresses de Hetzner Online GmbH, CHISELSTRIKE INC. (la société de Turso) et Cloudflare,
Inc. ont été relevées sur leurs propres pages, pas écrites de mémoire.

La politique est rangée par situation du visiteur (s'il écrit, s'il est joueur, s'il gère le site)
plutôt que par article du RGPD. Chaque durée qu'elle annonce est tenue par le code, et la liste de
ces durées est en tête du fichier : c'est au texte de suivre le code. Une phrase que je n'avais pas
vérifiée, sur les garanties contractuelles des prestataires américains, a été remplacée par un
constat factuel avant le commit.

Point à garder en tête : l'anonymat de la LCEN suppose que l'hébergeur connaisse l'identité de
l'éditeur. Ici, celui qui héberge en pratique est l'utilisateur, sur un serveur loué chez Hetzner ;
le texte le dit ainsi (« la personne qui assure l'hébergement »), sans le nommer.

- Portée : `src/app/mentions-legales/`, `src/app/confidentialite/`,
  `components/public/page-juridique.tsx`, `pied-de-page.tsx`, `lib/site.ts` (`EDITEUR`),
  `globals.css` (listes et intertitres de `.texte-article`), `fiches/juridique.md`, ROADMAP.
- Vérifié : `tsc`, lint ; les deux pages en 390 et 1440 px, statut 200, aucun débordement.
- Suite : Umami sur le VPS (le code du site, puis l'installation Coolify avec l'utilisateur), et la
  politique mise à jour dans le même commit ; puis l'écran « Comptes ».

**22:40** · **[fonction] La mesure d'audience Umami, côté site**

L'utilisateur ne se souvenait plus du nom de l'outil retenu au cadrage : un compteur de visites
sans cookie, libre, installé sur son propre serveur. Expliqué, puis validé.

Côté site, le script se charge seulement si ses deux variables d'exécution existent, posées dans
Coolify sans reconstruire. Il respecte « Do Not Track », ignore les paramètres d'adresse, et ne
compte ni l'administration ni les pages de travail. Première version cassée : l'expression
régulière du filtre perdait ses barres obliques dans le HTML, et React signalait la balise brute.
Réécrit avec `next/script` et une simple liste de segments, partagée avec la fonction testée.

La politique de confidentialité décrit Umami dans le même commit, comme la fiche l'exige.

L'installation sur le VPS reste à faire par l'utilisateur : elle demande un nom DNS chez
Cloudflare et un service de plus dans Coolify, deux gestes sur sa production.

- Portée : `src/lib/mesure-audience.ts` et son test, `src/components/mesure-audience.tsx`,
  `src/app/layout.tsx`, `src/app/confidentialite/page.tsx`, `.env.example`, codex, ROADMAP.
- Vérifié : 97 tests, `tsc`, lint ; avec une configuration factice en local (retirée ensuite), le
  script est rendu, le filtre écarte `/administration` et `/planche`, garde `/`, `/matchs` et
  `/administrations-locales`, et survit à une navigation interne.
- Suite : l'utilisateur installe Umami dans Coolify ; puis l'écran « Comptes ».
