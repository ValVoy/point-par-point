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
