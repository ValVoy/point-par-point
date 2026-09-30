# Fiche de page : Contact (30-09-2026)

## 1. Direction artistique

Intention : une page calme, la seule du site où le visiteur écrit au lieu de regarder. Pas de
mouvement ici, pas même sur le titre : un formulaire qui bouge est un formulaire qui inquiète.
Le titre d'affiche garde l'identité, le reste est sobre, lisible, grand.

Références (veille.md, sections formulaires) : les pages contact des clubs pro qui routent par
sujet (partenariat, presse, billetterie) plutôt qu'une adresse unique ; la sobriété des formulaires
éditoriaux (un champ par ligne, libellés au-dessus, jamais de placeholder qui remplace le libellé).

## 2. UX et UI

- Parcours : on arrive souvent d'un bouton précis (« Devenir partenaire » donne `?sujet=partenariat`),
  le sujet est donc pré-choisi, modifiable.
- Ordre : sujet, nom, e-mail, message. Quatre champs, pas un de plus. Pas de téléphone.
- Erreur : un message en tête du formulaire, annoncé (`role="alert"`), la saisie est conservée.
- Succès : le formulaire est remplacé par une confirmation, focus déplacé dessus, avec un lien de
  retour et la promesse honnête : « on répond par e-mail, sans délai garanti ».
- Anti-robot : champ piège hors écran et hors tabulation (`tabIndex -1`, `aria-hidden`), jamais de
  captcha. Limite par adresse réseau (3 par heure) et globale (30 par heure).
- RGPD : une phrase sous le bouton, ce qu'on garde, pourquoi, combien de temps, qui le lit.
- Mobile d'abord : champs pleine largeur, 48 px de haut, `autocomplete` renseigné, clavier e-mail.

## 3. Fullstack

- Action serveur, validation zod bornée (`src/lib/contact.ts`, testée), message rangé en base,
  aucun e-mail envoyé au premier lot.
- Table `envois_contact` : adresse réseau et date seules, purgée après 24 h, jamais reliée au message.
- Administration `/administration/messages` (droit `lireMessages`) : non lus d'abord, marquer lu,
  répondre par lien `mailto:`, corbeille restaurable. Le message s'affiche en texte brut (React
  échappe), jamais en HTML.
