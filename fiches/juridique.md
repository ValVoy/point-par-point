# Fiche de page : Mentions légales et confidentialité (30-09-2026)

## 1. Direction artistique

Deux pages de lecture, pas de vitrine : le titre d'affiche garde l'identité, puis la colonne
`.texte-article` des actualités. Aucun mouvement. Le ton est celui du reste du site, direct et en
phrases courtes : on dit ce qu'on garde et pourquoi, sans jargon juridique quand il n'est pas exigé.

## 2. UX et UI

- On arrive ici pour vérifier une chose précise : intertitres nets, une idée par section.
- Confidentialité organisée par situation du visiteur (« si vous nous écrivez », « si vous êtes
  joueur », « si vous gérez le site »), pas par article du RGPD.
- Toutes les demandes passent par le formulaire de contact (choix du 30-09-2026) : aucune adresse
  e-mail publiée.
- Liens depuis le pied de page, et depuis la phrase de confidentialité du formulaire.

## 3. Fullstack et contenu

- Éditeur : Tom Oger, particulier, nom seul (LCEN art. 6, III, 2), constante `EDITEUR`.
- Hébergement nommé (choix du 30-09-2026), raisons sociales relevées sur leurs pages le 30-09-2026 :
  Hetzner Online GmbH, CHISELSTRIKE INC. (Turso, région aws-eu-west-1), Cloudflare, Inc. (R2).
- Règle : chaque durée annoncée est tenue par le code (liste en tête de `confidentialite/page.tsx`).
  Toute nouvelle collecte, Umami compris, met la page à jour dans le même commit.
