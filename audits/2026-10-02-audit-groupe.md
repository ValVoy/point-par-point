# Audit du groupe, Point Par Point, 02-10-2026

Deuxième passage des huit regards (`/audit-groupe tous`), sur le dépôt au commit `c61bd48`, le
lendemain du premier (`audits/2026-10-01-audit-groupe.md`). Priorité absolue demandée par
l'utilisateur : **la lenteur ressentie en production**, mesurée page par page, puis tout ce qui
empêche le site d'être carré.

Méthode : mesures de production en lecture seule (derrière la barrière), mesures sur un build de
production local branché sur la base de développement (variables forcées dans l'environnement pour
ne jamais lire `.env.production.local`), puis quatre relectures à froid en parallèle sur le delta
`9deea6a..c61bd48` (`secu` ; `dev` et `test` ; `graphisme`, `ux` et `redaction` ; `rgpd` et
`fiabilite`), en lecture seule. Sondes jetables dans le dossier temporaire de la séance, supprimées.

Statuts : CORRIGÉ, PARTIEL, À ARBITRER (question posée à l'utilisateur), À VÉRIFIER (démarche de
l'utilisateur ou de Tom), À FAIRE (dette listée, sans décision), ACCEPTÉ. Vérification : PROUVÉ,
RELU, PLAUSIBLE.

## Synthèse

| Gravité | Nombre | Corrigés en séance |
|---|---|---|
| Critique | 0 | 0 |
| Élevée | 2 | 2 |
| Moyenne | 22 | 8, plus 2 partiels |
| Faible | 31 | 9, plus 2 partiels |
| Amélioration | 9 | 2, plus 1 partiel |
| **Total** | **64** | **21, plus 5 partiels** |

**La lenteur avait une cause unique et mesurable : l'attente de la base.** Chaque aller-retour vers
Turso (Irlande) coûte 100 à 130 ms depuis le VPS (Falkenstein), et les pages publiques en
enchaînaient une à quatre vagues ; le rendu lui-même ne coûte que quelques millisecondes. Un cache
des lectures, vidé à chaque écriture, ramène l'accueil de 165 à 16 ms côté serveur en local, et la
modification faite dans l'administration reste visible immédiatement (prouvé dans les deux sens).

Deux constats retirés, dits ici : une « vidéo de démonstration en production » (le fichier analysé
avait été réécrit depuis le serveur local par une relecture parallèle ; la production n'en contient
aucune) ; la cause de U16, qui venait de deux semis de démonstration lancés pendant cette séance en
base de développement (le défaut de fond, lui, est réel : T9).

## Mesures de la lenteur

### En production, derrière la barrière, avant correctif

Temps avant premier octet, cinq passages par page, depuis le poste :

| Page | Premier octet | Poids HTML (gzip) |
|---|---|---|
| `/` | 500 à 725 ms | 226 Ko (32 Ko) |
| `/matchs` | 470 à 580 ms | 130 Ko |
| `/effectif` | 335 à 445 ms | 27 Ko |
| `/ou-nous-voir` | 270 à 395 ms | 52 Ko |
| `/serie`, `/actualites`, `/le-projet`, `/partenaires`, `/contact` | 230 à 355 ms | 28 à 58 Ko |
| `/mentions-legales` (aucune donnée) | 235 à 255 ms | 32 Ko |
| `/sante` (`select 1`) | 250 à 280 ms | 11 octets |

Décomposition, sur une connexion réutilisée :

- réseau du poste au VPS : environ 30 ms (401 sans identifiants en 32 ms) ;
- **barrière Basic Auth : environ 70 ms par requête**, fichiers statiques compris (`/icon.svg` en
  105 ms avec identifiants contre 32 ms sans) ;
- **un aller-retour Turso depuis le VPS : 100 à 130 ms** (`/sante` 200 à 270 ms contre 105 ms pour
  un statique), contre 35 ms depuis le poste. La distance n'explique pas l'écart (25 ms environ de
  Falkenstein à Dublin) : avec peu de visites, la connexion se ferme entre deux pages et chaque
  visite paie une reconnexion (sonde locale : 355 ms pour la première requête, 35 ms ensuite) ;
- toutes les pages étaient rendues à chaque visite, y compris les juridiques : le pied de page
  appelle `connection()` et lit la saison en base.

Nombre de requêtes par page (sonde sur la base de développement) : accueil 12 en 4 vagues, matchs
6, effectif 3, où nous voir 3, les autres 1. Le transport (WebSocket ou HTTP) ne change rien :
sept requêtes en parallèle coûtent 117 ms en WebSocket, 37 ms en HTTP, mais les vagues sont
séquentielles et le temps total par page est le même.

### Côté navigateur

JavaScript par page : 179 à 248 Ko compressés, dont environ 180 Ko de socle Next et React commun
et mis en cache (`immutable`), plus 45 Ko de GSAP sur les pages animées. Une seule police
variable de 90 Ko, préchargée. Aucune tâche longue, aucun décalage de mise en page, aucune erreur
console (relecture `dev`). Ce n'était pas la cause de la lenteur ressentie.

### Après correctif, build de production local, base de développement

| Page | Avant (à froid) | Après (en cache) |
|---|---|---|
| `/` | 165 ms | 16 ms |
| `/matchs` | 110 ms | 9 ms |
| `/effectif`, `/ou-nous-voir` | 70 à 80 ms | 5 à 6 ms |
| `/serie`, `/actualites`, `/partenaires`, `/contact` | 38 à 45 ms | 4 à 5 ms |
| `/mentions-legales` | 38 ms | 4 ms |

En production, un aller-retour Turso pèse trois fois plus qu'ici : le gain attendu par page est de
100 à 450 ms. Restent, en production, le réseau et la barrière (environ 100 ms), qui disparaît au
lancement public.

## Performance (regards `dev` et `fiabilite`)

| Id | Gravité | Constat | Statut | Vérif. |
|---|---|---|---|---|
| D19 | élevée | Chaque page publique enchaînait 1 à 4 vagues de lectures Turso à 100-130 ms chacune, à chaque visite | CORRIGÉ : `src/lib/db/cache-lectures.ts`, posé sur le client, lectures gardées en mémoire, vidées après chaque écriture, servies puis rafraîchies en coulisse passé 5 minutes, tables sensibles jamais gardées, 300 entrées au plus, 15 tests | PROUVÉ (165 → 16 ms ; enregistrement et retour au départ du manifeste visibles aussitôt sur l'accueil mis en cache) |
| D20 | moyenne | Le pied de page (`connection()` et saison en base) rendait toutes les pages dynamiques et leur imposait un aller-retour | CORRIGÉ par D19 : la lecture de saison est en cache ; le rendu dynamique reste, il coûte 4 ms | PROUVÉ (mentions 38 → 4 ms) |
| D21 | moyenne | La purge, une écriture vers Turso, était attendue avant chaque page de l'administration, la connexion et l'envoi de contact | CORRIGÉ : `after()`, après la réponse | RELU |
| D22 | faible | HTML de l'accueil à 226 Ko, dont 74 Ko de tracés SVG et leur double dans la charge React | ACCEPTÉ : 32 Ko compressés | PROUVÉ |
| F23 | moyenne | La barrière Basic Auth coûte environ 70 ms à chaque requête, fichiers statiques compris | À ARBITRER (temporaire, disparaît au lancement) | PROUVÉ |
| F24 | faible | La connexion à Turso se ferme entre deux visites espacées | ACCEPTÉ : le cache sert l'ancien et rafraîchit en coulisse ; à remesurer en production | PLAUSIBLE |

Administration, mesurée en local après correctif : 90 à 100 ms par page, soit deux allers-retours
non mis en cache par choix (la session et le compteur de messages, tables sensibles).

## `secu`, DevSecOps

Recension : 48 actions d'administration sur 48 gardées en tête de fonction, plus 3 publiques par
nature, 51 dans 13 fichiers. Routes nouvelles vérifiées : `/planche`, `/prototype/*` et
`/fichiers-locaux/*` en 404 en production, `/taches/purge` en 404 sans jeton et comparaison en
temps constant, `/_next/image` refuse `127.0.0.1`, contrôle d'origine tenu, aucun secret dans le
delta. Régressions des correctifs d'hier : S4 partielle (S19), rien d'autre.

| Id | Gravité | Constat | Statut | Vérif. |
|---|---|---|---|---|
| S19 | moyenne | Une tentative refusée restait notée comme un échec : depuis une seule adresse réseau, 31 envois bloquaient le compte du vrai titulaire (régression partielle de S4) | CORRIGÉ : la réservation refusée est effacée, seuls les vrais essais de mot de passe comptent | PROUVÉ (35 essais d'une adresse puis le titulaire d'ailleurs : bloqué avant, autorisé après) |
| S20 | faible | Le sujet du contact acceptait `constructor`, `__proto__`, `toString` (`in` sur un objet) | CORRIGÉ : `Object.hasOwn`, test ajouté | PROUVÉ |
| S21 | amélioration | `/sitemap.xml` public lançait 4 lectures par appel | CORRIGÉ par D19 | RELU |
| S22 | amélioration | `npm audit` classe Next 16.3.5 en critique (`next/og`, non utilisé ici) | À FAIRE le 07-10 : la dernière 16.3.x de plus de 15 jours (ROADMAP) | PROUVÉ (non exposé) |

## `dev`, développeur senior

| Id | Gravité | Constat | Statut | Vérif. |
|---|---|---|---|---|
| D12 | moyenne | Le bandeau LED de l'intro tournait en boucle hors écran (723 appels d'animation en 3 s au repos) | CORRIGÉ : en pause hors de l'écran (`ScrollTrigger`, `toggleActions`) | PROUVÉ (bouge visible, figé hors écran, repart au retour) |
| D13 | moyenne | MorphSVG partait sur toutes les pages animées (10 Ko compressés) | CORRIGÉ : `src/lib/gsap-morph.ts`, importé par l'intro seule | PROUVÉ (absent de `/matchs`, intro intacte, 0 erreur) |
| D14 | faible | `/contact` charge 277 Ko de JavaScript sans animation | À FAIRE : passer l'analyseur de paquets | PLAUSIBLE |
| D15 | faible | Trois assertions forcées dans le delta | PARTIEL : `ligne-calendrier.tsx` corrigé ; `projet/actions.ts:363` et `mouvements-porte-entree.tsx:173` À FAIRE | PROUVÉ |
| D16 | faible | Code mort : `MarqueNouveau`, `EtatPublication`, `EtatSoutien`, et 51 exports utilisés dans leur seul fichier | PARTIEL : `MarqueNouveau` supprimé | PROUVÉ |
| D17 | faible | Duplications : trois branches de `effacement.ts`, le motif « focus révèle le geste » copié 4 fois | À FAIRE | RELU |
| D18 | amélioration | `effacement.ts`, `purges.ts`, `tentatives.ts` sans test | PARTIEL : le cache a 15 tests ; S19 prouvé par sonde, pas encore en test | PROUVÉ |

## `test`, testeur exploratoire

| Id | Gravité | Constat | Statut | Vérif. |
|---|---|---|---|---|
| T9 | moyenne | Deux saisons pouvaient porter le même libellé, la seconde devenant inatteignable sur le site (adresse par libellé) ; dates invalides ramenées à vide, début après fin accepté | PARTIEL : libellé déjà pris refusé à la création et à la modification ; la restauration depuis la corbeille et la validation des dates À FAIRE ; le semis de démonstration refuse désormais un second passage | RELU |
| T10 | faible | Au-delà de 99 jours, le compte à rebours affiche et annonce « 99 jours » | À FAIRE | PROUVÉ |
| T11 | faible | Le filet « Aujourd'hui » de `/matchs` ignore `heureConnue` et l'état du match | À FAIRE | RELU |
| T12 | faible | `extraitEtape` coupait un emoji en deux | CORRIGÉ, test ajouté | PROUVÉ |
| T13 | faible | `titreSansNumero` laisse passer « Episode 3 » seul et « #3 - x » | À FAIRE | PROUVÉ |
| T14 | moyenne | La saisie du calendrier complet ne détecte pas les doublons et n'est pas bornée | À FAIRE | PLAUSIBLE |
| T15 | faible | Heure ambiguë du 25-10-2026 tranchée sans test qui fige le choix | À FAIRE | PROUVÉ |
| T16 | faible | L'avertissement avant de quitter n'existe que sur 2 formulaires | À FAIRE | RELU |
| T17 | amélioration | Animations, compte à rebours et filet non couverts par les tests automatisés ; aucune anomalie trouvée par sonde | ACCEPTÉ | PROUVÉ |

## `graphisme`

Contraste calculé sur tous les couples réellement affichés, 16 pages, deux largeurs : aucun sous
4,5:1. Décalage des pages non refondues (accueil hors Série, effectif, fiche joueur, actualités,
le projet, où nous voir, partenaires, contact, juridiques, 404) : titres à 96 px au lieu de
l'échelle, étiquettes à 12 px, pas de `chapitre`. C'est le chantier « refonte, suite » de la
ROADMAP, pas un défaut nouveau.

| Id | Gravité | Constat | Statut | Vérif. |
|---|---|---|---|---|
| G11 | moyenne | Tableau du match raconté hors échelle : étiquettes à 12 px, « Set 1 » à 10,4 px au téléphone, pastille à 9 px | CORRIGÉ : `etiquette` partout, pastille à 13 px au moins | PROUVÉ (0 texte sous 13 px de 360 à 1440 px, capture à 390 px) |
| G12 | faible | « Lecture via YouTube », « Match en cours » à 12 px ; `MarqueNouveau` mort | CORRIGÉ | RELU |
| G13 | faible | Sur-titre « Prochain match à domicile » à 12 px | Rattaché à la refonte de `/ou-nous-voir` (la capture était mal nommée) | PROUVÉ |
| G14 | faible | G4, halo des LED défini deux fois | À FAIRE | RELU |
| G15 | moyenne, composition | Le bouton de lecture et le titre en surimpression heurtent le texte propre aux miniatures YouTube (« 4K ») | À ARBITRER | PROUVÉ |
| G16 | amélioration, composition | Page d'épisode en grand écran : tableau en demi-largeur, filet latéral jaune abandonné ailleurs | À ARBITRER | PROUVÉ |
| G17 | amélioration, composition | Apostrophe droite partout, titres d'affiche compris | À ARBITRER (avec W11) | PROUVÉ |

## `ux`

Focus visible sur tout le parcours clavier, `prefers-reduced-motion` respecté par toutes les
animations, un seul h1 par page, lien d'évitement, aucun débordement horizontal.

| Id | Gravité | Constat | Statut | Vérif. |
|---|---|---|---|---|
| U16 | élevée | `/matchs` et `/effectif` vides avec trois onglets « 2026-2027 » | CORRIGÉ : cause en base de développement (deux semis de cette séance), base remise d'aplomb ; le défaut de fond est traité par T9 | PROUVÉ |
| U17 | moyenne | Sur l'accueil, le prochain et le dernier match ne mènent pas à la page du match | À ARBITRER | PROUVÉ |
| U18 | moyenne | Une vingtaine de boutons d'action de l'administration sans état d'envoi | À FAIRE (`BoutonEnvoi` ou `useFormStatus`) | RELU |
| U19 | faible | « L'ajouter directement » et « Confidentialité » sous 44 px ; nouvel onglet non annoncé | CORRIGÉ | RELU |
| U20 | faible | U4 et U7 partiels (grilles du calendrier et de l'effectif) | À FAIRE | RELU |
| U21 | moyenne, composition | Pas d'en-tête sur l'accueil : au téléphone, le premier lien vers l'effectif est à 5 827 px | À ARBITRER | PROUVÉ |
| U22 | faible, composition | Au téléphone, Le projet, Où nous voir et Contact ne sont que dans le pied de page | ACCEPTÉ (choix de `vitrine.md`) | PROUVÉ |

## `redaction`

Vouvoiement tenu partout, public comme administration.

| Id | Gravité | Constat | Statut | Vérif. |
|---|---|---|---|---|
| W11 | moyenne | Aucune espace insécable avant `: ? !` ni dans les guillemets | À FAIRE : une fonction `typo()` appliquée aux constantes et au texte léger, avec la refonte des pages | PROUVÉ |
| W12 | moyenne | Ligne d'effectif : « Saisie invalide. » au lieu du message précis | CORRIGÉ | RELU |
| W13 | faible | Deux formats de date et une redite sur la page d'un match | À FAIRE | PROUVÉ |
| W14 | faible | « Corbeille » au lieu de « Mettre à la corbeille » dans les saisons | CORRIGÉ | RELU |
| W15 | faible | La voix hésite entre « nous » et « on » | À ARBITRER (glossaire, suite de W5) | PROUVÉ |
| W16 | amélioration, composition | Trois appels d'abonnement, deux libellés | À ARBITRER | PROUVÉ |

## `rgpd`

Sain : miniatures servies par le site (aucune requête du navigateur vers YouTube), lecteur sans
cookie chargé au clic, aucun cookie hors session d'administration, Umami absent sans ses variables,
purge de 02:41 avant la sauvegarde de 03:17.

| Id | Gravité | Constat | Statut | Vérif. |
|---|---|---|---|---|
| R14 | moyenne | Une photo effacée restait servie jusqu'à un an par l'optimiseur d'images (dépôt `immutable` un an), la politique dit 24 heures | CORRIGÉ : dépôt en `public, max-age=86400` (bucket vide, rien à reprendre) | RELU |
| R15 | moyenne | Une demande d'exercice des droits arrive sans notification | À ARBITRER | RELU |
| R16 | faible | L'adresse réseau du contact peut rester près de 48 h sans trafic (purge de nuit seule) | À ARBITRER | RELU |
| R17 | faible | La politique ne disait pas que les photos sont copiées chaque nuit, 30 jours | CORRIGÉ | RELU |
| R18 | faible | Umami décrit « sur notre propre serveur » | CORRIGÉ : « sur le serveur qui héberge le site, en Allemagne » | RELU |
| R19 | faible | Localisation du bucket `projet-volley` jamais relevée | À VÉRIFIER (utilisateur) | PLAUSIBLE |
| R20 | faible | Date de mise à jour de la politique fausse | CORRIGÉ : 2 octobre 2026 | PROUVÉ |
| R21 | amélioration | Calendrier fédéral repris sans vérifier les conditions de réutilisation du portail | À VÉRIFIER (avant le lancement public) | PLAUSIBLE |

## `fiabilite`

Acquis depuis hier : sauvegarde de la base et restauration prouvées, clé `age` vérifiée,
battement Healthchecks sur la sauvegarde.

| Id | Gravité | Constat | Statut | Vérif. |
|---|---|---|---|---|
| F13 | moyenne | Les accès Turso de production sont dans `.env.production.local`, que `next build` et `next start` chargent en premier : un build local lit la base de Tom | À ARBITRER (le poste Coolify lit aussi ce fichier) ; contourné dans cette séance en forçant les variables | PROUVÉ |
| F14 | moyenne | La purge nocturne répondait 204 même en échec | PARTIEL : 500 en cas d'échec ; battement Healthchecks derrière la commande à poser (ROADMAP) | RELU |
| F15 | moyenne | Rien ne prévient si le site tombe, alors que c'est déjà l'instance de production | À ARBITRER | PROUVÉ |
| F16 | moyenne | La santé du conteneur dépend de Turso : une panne de Turso retire le conteneur et tout le site répond un 404 brut | À ARBITRER | PLAUSIBLE |
| F17 | moyenne | Un push sur `main` part en production sans aucun test dans l'image ; retour arrière jamais essayé | À ARBITRER (tests passés en UTC et en heure du Pacifique, mais pas de Docker sur le poste pour éprouver l'image) | RELU |
| F18 | faible | Le plan Umami se contredisait (build ou exécution) | CORRIGÉ : ROADMAP, `UMAMI_URL` en build et exécution | PROUVÉ |
| F19 | faible | Les journaux d'un conteneur disparaissent à chaque déploiement | À VÉRIFIER | PLAUSIBLE |
| F20 | faible | L'optimiseur accepte n'importe quelle miniature `i.ytimg.com` en toutes tailles | À FAIRE | PLAUSIBLE |
| F21 | faible | Le geste de restauration en production n'est écrit nulle part | À FAIRE (fiche F12) | RELU |
| F22 | amélioration | La section « Avant la mise en ligne » de la ROADMAP était périmée | CORRIGÉ | PROUVÉ |

## Vérifications de la séance

- 187 tests (171 avant, 16 ajoutés), `tsc`, lint de tout le dépôt, et les tests aussi en `TZ=UTC`
  et `TZ=America/Los_Angeles`.
- Build de production local, mesures avant et après, parcours de l'administration de bout en bout
  avec un compte jetable supprimé ensuite.
- Écran : tableau de résultat à 360, 390 et 1440 px ; bandeau LED en pause hors écran ; intro
  rejouée dans un onglet neuf, 0 erreur console.
- Base de développement : données de démonstration purgées puis ressemées une fois (une saison) ;
  aucune opération sur la base de production.

## Pour le prochain passage

À recompter :

- **premier octet en production page par page**, derrière la barrière puis sans elle (référence du
  02-10 : accueil 500 à 725 ms, mentions 235 à 255 ms, `/sante` 250 à 280 ms) ;
- allers-retours Turso par page à froid (accueil 12 en 4 vagues, matchs 6) et part servie par le
  cache ;
- temps d'une page d'administration (90 à 100 ms en local) ;
- JavaScript par page (179 à 248 Ko compressés), et `/contact` en particulier (D14) ;
- actions serveur gardées (48 sur 48 plus 3 publiques) ;
- tests (187), modules de `src/lib` sans test (35 sur 55 avant cette séance) ;
- textes sous 13 px sur les pages refondues (0 au 02-10) ;
- espaces insécables avant `: ? !` (0 au 02-10, W11) ;
- restauration d'une photo réelle, avec sa date.
