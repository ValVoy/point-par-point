# Audit du groupe, Point Par Point, 01-10-2026

Premier passage des huit regards (`/audit-groupe tous`), sur le dépôt au commit `9deea6a`, avant
toute mise en ligne. Aucun audit précédent : ce rapport sert de référence au prochain.

Méthode : quatre relectures à froid en parallèle (`secu` ; `dev` et `test` ; `rgpd` et
`fiabilite` ; `graphisme`, `ux` et `redaction`), en lecture seule, sondes jetables supprimées,
rien envoyé ni écrit en base. Chaque constat élevé a été revérifié à la main avant correction.
Corrections en trois lots : `324c333` (sécurité), `6bd129f` (fiabilité et intégrité), `576031b`
(accessibilité, graphisme, rédaction). Aucun constat retiré.

Statuts : CORRIGÉ, PARTIEL, À ARBITRER (question posée à l'utilisateur), À VÉRIFIER (démarche de
l'utilisateur ou de Tom), ACCEPTÉ (connu, sans suite pour l'instant). Vérification : PROUVÉ,
RELU, PLAUSIBLE.

## Synthèse

| Gravité | Nombre | Corrigés en séance |
|---|---|---|
| Critique | 0 | 0 |
| Élevée | 15 | 11 (dont F2 partiel) ; 4 restent (R1, R2, F3, F4) |
| Moyenne | 37 | 24 |
| Faible | 35 | 23 |
| Amélioration | 10 | 8 |
| **Total** | **97** | **66** |

Les quatre élevés restants ne sont pas du code sûr à corriger seul : l'effacement définitif
(R1, R2) est une fonction à trancher, les sauvegardes de la base et des photos (F3, F4) sont des
réglages de l'utilisateur sur son serveur, **à faire avant la mise en ligne**.

## `secu`, DevSecOps

Recension : 13 fichiers d'actions serveur, 47 fonctions, 44 d'administration toutes gardées,
3 publiques par nature. Contrôle d'origine de Next vérifié (500 depuis une autre origine).

| Id | Gravité | Constat | Statut | Vérif. |
|---|---|---|---|---|
| S1 | moyenne, conséquence élevée | Texte léger : 20 000 caractères piégés bloquaient le serveur 40 s (motifs non bornés) | CORRIGÉ : analyse linéaire, motifs bornés, test de performance | PROUVÉ (2 s à 8 000 car. avant, < 0,5 s à 20 000 après) |
| S2 | moyenne | Une seule adresse pouvait fermer le contact à tous (plafond global) | CORRIGÉ : les refus par adresse ne comptent plus (migration 0008) | RELU |
| S3 | moyenne | Plafond et purge du contact en balayage complet | CORRIGÉ : index sur la date (0008) | PROUVÉ (plan de requête) |
| S4 | moyenne | Blocage à distance du compte par 5 essais | CORRIGÉ : 5 par couple adresse et réseau, 30 par adresse, 50 par réseau | PROUVÉ (bloqué depuis l'attaquant, connexion d'ailleurs réussie) |
| S5 | faible | Rafale simultanée avant le premier échec noté | CORRIGÉ : tentative réservée avant bcrypt | RELU |
| S6 | faible | Confiance dans `X-Forwarded-For` selon l'infrastructure | À VÉRIFIER au déploiement (port non exposé hors Traefik) | PLAUSIBLE |
| S7 | faible | Corps de 13 Mo accepté par toutes les actions | À ARBITRER (limite Traefik) | RELU |
| S8 | faible | Pas de CSP, `X-Powered-By` exposé | PARTIEL : en-tête retiré ; CSP À ARBITRER | PROUVÉ |
| S9 | faible | Script Umami exécuté dans l'administration | CORRIGÉ : porté par le pied de page public | PROUVÉ |
| S10 | faible | Next 16.3.5 visé par un avis (`next/og`, non utilisé) | À ARBITRER : 16.3.6 éligible le 07-10 | RELU |
| S11 | faible | Clé de stockage : `.` non échappé | CORRIGÉ, test ajouté | PROUVÉ |
| S12 | faible | Sessions expirées jamais purgées, pas d'échéance absolue | CORRIGÉ : purge commune, 90 jours absolus | PROUVÉ |
| S13 | amélioration | bcrypt tronque à 72 octets sans le dire | CORRIGÉ | RELU |
| S14 | amélioration | Page « La salle » sans garde propre | CORRIGÉ | RELU |
| S15 | amélioration | `changerRole` valide avant la garde | CORRIGÉ | PROUVÉ |
| S16 | amélioration | Dépendances en `^` | CORRIGÉ : versions exactes, verrou inchangé | RELU |
| S17 | amélioration | `.dockerignore` sans photos locales | CORRIGÉ | RELU |
| S18 | amélioration | iframe sans `referrerPolicy`, nom de base dans `.env.example`, HSTS `preload` | PARTIEL : deux premiers corrigés ; `preload` À ARBITRER | RELU |

## `dev`, développeur senior

| Id | Gravité | Constat | Statut | Vérif. |
|---|---|---|---|---|
| D1 | élevée | Adresses trop longues ou vides : contenu listé mais 404 ; « Łukasz » devenait « ukasz » | CORRIGÉ : 100 caractères sur limite de mot, translittération, secours, une seule `FORME_SLUG` | PROUVÉ |
| D2 | élevée | Bascules non idempotentes (double clic, deux onglets) | CORRIGÉ : l'état voulu part du formulaire | RELU |
| D3 | moyenne | Match à égalité de sets enregistré, compté en défaite | CORRIGÉ : erreur à la saisie, écarté du bilan | PROUVÉ |
| D4 | moyenne | Saison courante sans contrôle ni lot ; score sur un match à la corbeille | CORRIGÉ (joueur et effectif hors lot : ACCEPTÉ) | RELU |
| D5 | moyenne | Ajout de joueur sans bornes, utilitaires recopiés | CORRIGÉ : même validation que la fiche | PROUVÉ |
| D6 | moyenne | Aucune page d'erreur ni introuvable | CORRIGÉ (voir F1) | PROUVÉ |
| D7 | moyenne | Code mort, droits jamais branchés, filtre d'audience non testé | CORRIGÉ : 5 exports retirés, filtre testé ; droits `viderCorbeille` et `purgerDemo` liés à R1 | PROUVÉ |
| D8 | faible | Relectures de tables pour les adresses, session lue deux fois, pages sans cache | PARTIEL : session et saison en cache par requête ; le reste ACCEPTÉ | RELU |
| D9 | faible | Quelques conversions de type évitables | ACCEPTÉ | RELU |
| D10 | faible | `@types/node` 20 pour Node 24 | ACCEPTÉ | RELU |
| D11 | faible | Tiret cadratin dans `AGENTS.md`, écrit par `next dev` | ACCEPTÉ (hors de notre main) | PROUVÉ |

## `test`, testeur exploratoire

| Id | Gravité | Constat | Statut | Vérif. |
|---|---|---|---|---|
| T1 | élevée | Suite de D1 : page 404 pour un nom non latin ou un titre long | CORRIGÉ | PROUVÉ |
| T2 | élevée | Suite de D2 : publication défaite par un double clic | CORRIGÉ | RELU |
| T3 | moyenne | Aucune saison passée, aucun match annulé dans la démonstration | À FAIRE (données de démonstration) | PROUVÉ |
| T4 | moyenne | Lien d'évitement mort dans l'administration, tableau de bord sans titre | CORRIGÉ | PROUVÉ |
| T5 | moyenne | Limite de connexion contournable en parallèle, durée annoncée fixe | CORRIGÉ (S5), durée réelle restante | PLAUSIBLE |
| T6 | faible | Agenda pointant vers l'accueil ; paramètres de saison tolérés | PARTIEL : agenda corrigé ; paramètres ACCEPTÉ | PROUVÉ |
| T7 | faible | Âge au fuseau du serveur | CORRIGÉ, testé | PROUVÉ |
| T8 | faible | Ni `robots.txt` ni plan du site | CORRIGÉ | PROUVÉ |

## `rgpd`, juriste

| Id | Gravité | Constat | Statut | Vérif. |
|---|---|---|---|---|
| R1 | élevée | Effacement promis, impossible depuis l'administration | À ARBITRER | PROUVÉ |
| R2 | élevée | Photo d'un élément à la corbeille toujours en ligne sur R2 | À ARBITRER (avec R1) | RELU |
| R3 | moyenne | Durées tenues seulement si un événement suit | CORRIGÉ au passage (`purges.ts`) ; tâche nocturne À ARBITRER | PROUVÉ |
| R4 | faible | Sessions expirées accumulées | CORRIGÉ | PROUVÉ |
| R5 | moyenne | Sauvegarde décrite au présent, survie dans les sauvegardes non dite | PARTIEL : phrase ajoutée ; sauvegarde À VÉRIFIER avant la mise en ligne | RELU |
| R6 | moyenne | Aucune durée pour Umami | À VÉRIFIER (purge à 25 mois sur le serveur, puis la page) | RELU |
| R7 | moyenne | L'hébergeur nommé ne connaît pas l'éditeur ; article 6 à revérifier (loi SREN) | À VÉRIFIER (Valentin et Tom) | PLAUSIBLE |
| R8 | moyenne | Sous-traitance Tom-Valentin non écrite, DPA et transferts non vérifiés | À VÉRIFIER | RELU |
| R9 | moyenne | Consentement des joueurs non démontrable, mineurs | À VÉRIFIER (accords écrits) ; champs dans le code À ARBITRER | RELU |
| R10 | faible | Pas de registre, portabilité à la main | À VÉRIFIER (Tom) | RELU |
| R11 | faible | Rien ne dit que le clic charge YouTube | CORRIGÉ | RELU |
| R12 | amélioration | Pas de sujet « Mes données » | CORRIGÉ | RELU |
| R13 | faible | Champs libres pouvant nommer des tiers | ACCEPTÉ | PLAUSIBLE |

## `fiabilite`, SRE

| Id | Gravité | Constat | Statut | Vérif. |
|---|---|---|---|---|
| F1 | élevée | Pages d'erreur par défaut, en anglais | CORRIGÉ : `not-found`, `error`, `global-error`, erreur d'administration | PROUVÉ |
| F2 | élevée | Tout le site dépend de Turso, pages juridiques comprises | PARTIEL : pied de page tolérant ; délai d'expiration et pages statiques ACCEPTÉ pour l'instant | RELU |
| F3 | élevée | Photos R2 sans sauvegarde | À VÉRIFIER (Valentin, avant la mise en ligne) | RELU |
| F4 | élevée | Sauvegarde de la base absente, clé `age` en une seule copie | À VÉRIFIER (Valentin, avant la mise en ligne) | RELU |
| F5 | moyenne | Variables de compilation absentes du Dockerfile | CORRIGÉ (`ARG`) | RELU |
| F6 | moyenne | Une purge ratée faisait échouer l'action | CORRIGÉ | RELU |
| F7 | moyenne | Pas de sonde de santé | CORRIGÉ : `/sante` et `HEALTHCHECK` ; réglage Coolify À VÉRIFIER | PROUVÉ |
| F8 | moyenne | Journaux rares, aucune alerte | PARTIEL : purges, santé, erreurs de page journalisées ; alertes À VÉRIFIER | RELU |
| F9 | moyenne | Pics de mémoire au traitement des photos | CORRIGÉ (`sharp` une image à la fois, sans cache) ; mesure en production À VÉRIFIER | PLAUSIBLE |
| F10 | faible | Migrations de production à la main | À VÉRIFIER (procédure : migrer avant de déployer) | RELU |
| F11 | faible | Requêtes en cascade | PARTIEL (cache par requête) | RELU |
| F12 | faible | Points uniques de défaillance, Tom sans recours | À VÉRIFIER (fiche « que faire si ») | RELU |

## `graphisme`

| Id | Gravité | Constat | Statut | Vérif. |
|---|---|---|---|---|
| G1 | élevée | Bords de champ à 1,39:1 | CORRIGÉ : `nuit-bord` (3,5:1) partout | PROUVÉ |
| G2 | moyenne | Mode de saisie du score actif invisible | CORRIGÉ | PROUVÉ |
| G3 | moyenne | Focus des champs d'administration réduit à un bord | CORRIGÉ : anneau du site rendu | PROUVÉ |
| G4 | faible | Halo des LED défini deux fois | À FAIRE | PROUVÉ |
| G5 | faible | « 2E » au lieu de « 2e » | CORRIGÉ | PROUVÉ |
| G6 | faible | Saison coupée au trait d'union | CORRIGÉ | PROUVÉ |
| G7 | faible | Séparateurs de score différents | CORRIGÉ (trait d'union partout) | PROUVÉ |
| G8 | faible | Onglets du projet sur deux lignes, 36 px | CORRIGÉ | PROUVÉ |
| G9 | amélioration, composition | Six espacements de capitales, cinq rayons | À ARBITRER | RELU |
| G10 | amélioration, composition | Aides en 12 px | À ARBITRER | RELU |

## `ux`

| Id | Gravité | Constat | Statut | Vérif. |
|---|---|---|---|---|
| U1 | élevée | Identifiants en double : 20, 12 et 9 champs sans étiquette | CORRIGÉ : 0 et 0 doublon, mesuré | PROUVÉ |
| U2 | élevée | Page introuvable par défaut | CORRIGÉ | PROUVÉ |
| U3 | élevée | Navigation d'administration au téléphone | CORRIGÉ : 44 px, rubrique courante, passage à la ligne | PROUVÉ |
| U4 | moyenne | Cibles sous 44 px | PARTIEL : éditeur, classement, score, retours publics ; grilles du calendrier et de l'effectif À FAIRE | PROUVÉ |
| U5 | moyenne | Zoom iOS sur l'éditeur et le calendrier | CORRIGÉ (16 px) | PROUVÉ |
| U6 | moyenne | Tableau de bord aveugle au classement et aux messages | CORRIGÉ | PROUVÉ |
| U7 | moyenne | Saisie perdue en quittant | PARTIEL : classement et actualités ; calendrier et effectif À FAIRE | RELU |
| U8 | moyenne | Aides non reliées, « Compétitionfacultatif » | CORRIGÉ | PROUVÉ |
| U9 | moyenne | Aucune description d'image possible | À ARBITRER | PROUVÉ |
| U10 | faible | « ... » pendant l'envoi | CORRIGÉ | PROUVÉ |
| U11 | faible | Boutons corbeille indistincts | CORRIGÉ | RELU |
| U12 | faible | Navigations sans nom, même h1 sur trois pages | PARTIEL : noms posés ; h1 À ARBITRER | PROUVÉ |
| U13 | moyenne, composition | Vitrine absente de l'en-tête en grand écran | À ARBITRER | RELU |
| U14 | moyenne, composition | Le staff se modifie loin de l'effectif | À ARBITRER | RELU |
| U15 | amélioration, composition | Classement caché derrière un bouton secondaire | CORRIGÉ par U6 (carte du tableau de bord) | RELU |

## `redaction`

| Id | Gravité | Constat | Statut | Vérif. |
|---|---|---|---|---|
| W1 | élevée | Aide fausse : « les photos arriveront » | CORRIGÉ | PROUVÉ |
| W2 | moyenne | « Épisode 3 : Épisode 3 : » | CORRIGÉ à l'affichage, testé | PROUVÉ |
| W3 | moyenne | « facultatif sauf le nom » alors que le prénom est obligatoire | CORRIGÉ | PROUVÉ |
| W4 | moyenne | Messages d'erreur possibles en anglais | CORRIGÉ : messages sur chaque borne, longueurs dans les zones de texte | RELU |
| W5 | moyenne | Vocabulaire changeant | PARTIEL : rôle en toutes lettres ; glossaire À FAIRE | PROUVÉ |
| W6 | faible | « 1 août » dans les dates courtes | CORRIGÉ | PROUVÉ |
| W7 | faible | Date lue deux fois, minuscule en tête | CORRIGÉ | PROUVÉ |
| W8 | faible | Commande technique dans le bandeau | CORRIGÉ | PROUVÉ |
| W9 | faible | Tournures impersonnelles, « ... », « N° », « au survol » | CORRIGÉ | PROUVÉ |
| W10 | faible | Page 404 en anglais | CORRIGÉ (U2) | PROUVÉ |

## Avant la mise en ligne, de votre côté

1. Sauvegarde nocturne de la base, rétention prouvée à 30 jours, restauration réelle testée,
   seconde copie de la clé `age` vérifiée (F4, R5).
2. Copie des photos R2, restauration testée **avec** la base (F3).
3. Umami : purge au-delà de 25 mois, puis la durée ajoutée à la politique (R6).
4. Mentions légales : coordonnées de Tom remises à l'hébergeur réel, référence de l'article 6
   revérifiée sur Légifrance (R7) ; note de sous-traitance d'une page, DPA Turso et Cloudflare
   (R8) ; registre des traitements (R10).
5. Accords écrits des joueurs couvrant le site, accord parental des mineurs (R9).
6. Coolify : vérification de santé sur `/sante`, variables de build `R2_DOMAINE_PUBLIC` et
   `NEXT_PUBLIC_SITE_URL`, migrations 0002 à 0008 **avant** le déploiement (F5, F7, F10).
7. Une fiche « que faire si » de dix lignes pour Tom (F12).

## Pour le prochain passage

À recompter :

- actions serveur gardées sur le total (47 sur 47 au 01-10) ;
- champs sans étiquette sur les écrans du projet (20, 12, 9 avant ; 0 après) ;
- cibles sous 44 px en tête d'administration à 390 px (12 avant ; 0 après) ;
- bords de champ (1,39:1 avant ; 3,5:1 après) ;
- temps d'analyse de 20 000 caractères piégés (40 s avant ; < 0,5 s après) ;
- pages d'erreur personnalisées (0 avant ; 4 après) ;
- tests (129 avant ; 143 après), modules de `src/lib` sans test (27 sur 44 avant) ;
- exports morts (6 avant ; 0 après), `console.*` (4 avant) ;
- temps avant premier octet en production depuis le VPS, mémoire pendant un envoi de photo ;
- restauration base et photos réellement faite, avec sa date.
