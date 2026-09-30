# Fiche technique : l'envoi des photos (01-10-2026)

## Ce que vit l'ami

Il choisit une photo depuis son téléphone ou son ordinateur, telle quelle : pas de recadrage, pas
de conversion à faire avant. Le site s'occupe du reste. Il voit la photo actuelle, peut la
remplacer ou la retirer. Une photo trop lourde ou dans un format inconnu est refusée avec une
phrase qui dit quoi faire.

## Ce que fait le serveur

- **Formats acceptés** : JPEG, PNG, WebP, AVIF. Refusés : SVG (un SVG peut porter du script),
  GIF, HEIC (les téléphones le convertissent en JPEG à l'envoi depuis un navigateur).
- **Le format se lit dans le fichier**, jamais dans son nom ni dans le type annoncé par le
  navigateur : `sharp` décode l'image, un fichier qui n'en est pas une est refusé.
- **Limites** : 12 Mo par fichier, 40 millions de pixels (contre les « bombes » de
  décompression), plafond de corps des actions serveur relevé en conséquence.
- **Traitement** : rotation selon l'orientation de l'appareil, puis redimension sans
  agrandissement (photos 1600 px, logos 800 px, illustrations 2000 px), sortie WebP.
  **Toutes les métadonnées sont retirées**, dont la position GPS qu'un téléphone inscrit dans
  chaque photo.
- **Nom de l'objet** tiré au hasard côté serveur (`joueurs/<uuid>.webp`) : le nom du fichier
  envoyé n'est jamais utilisé.
- **Remplacement et retrait** : l'ancien objet est effacé du bucket après l'enregistrement. Une
  photo retirée d'un joueur ne reste pas en ligne à une adresse oubliée.

## Où sont les fichiers

- Production : Cloudflare R2, servi par son domaine public (`R2_DOMAINE_PUBLIC`).
- Développement sans identifiants R2 : dossier local `.stockage-local/` (jamais commité), servi
  par une route réservée au développement. En production, sans R2, l'envoi est refusé avec un
  message clair plutôt que d'écrire sur le disque du conteneur, qui s'efface à chaque déploiement.
