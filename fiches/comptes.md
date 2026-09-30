# Fiche d'écran : Comptes et Mon compte (30-09-2026)

Écrans d'administration : pas de veille ni de mouvement, la priorité est qu'on ne puisse ni
s'enfermer dehors ni laisser une porte ouverte.

## Parcours

- **Aucun e-mail ne part du site.** Un compte naît avec un mot de passe provisoire (quatre groupes
  de quatre caractères, sans 0/O ni 1/l/I), affiché une seule fois à l'administrateur, qui le
  transmet de vive voix ou par message privé. La personne le remplace dans « Mon compte ».
- Comptes (droit `gererComptes`) : liste, actifs d'abord ; créer ; passer rédacteur ou
  administrateur ; désactiver ou réactiver ; nouveau mot de passe provisoire.
- Mon compte (tout compte connecté, lien sur le nom dans l'en-tête) : changer son mot de passe,
  l'actuel exigé.

## Garde-fous

- On ne change ni son propre rôle ni son propre état, et il reste toujours un administrateur actif
  (contrôle refait après l'écriture, contre deux retrogradations simultanées).
- Désactiver ou réinitialiser ferme toutes les sessions du compte ; changer son mot de passe ferme
  les autres appareils et rouvre la session en cours.
- La vérification du mot de passe actuel passe par le compteur de tentatives de la connexion.
- Rien ne s'efface : un compte se désactive.
- Next ne journalise plus les actions serveur (`logging.serverFunctions: false`) : sans cela, le
  mot de passe provisoire finissait en clair dans `.next/dev/logs`.
