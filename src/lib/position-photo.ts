/**
 * L'`object-position` d'une photo de joueur : le point de visage s'il est place
 * (fiche fiches/fiche-joueur.md), sinon le haut, centre. Module a part : il sert
 * aussi dans le navigateur, sans embarquer la validation de la fiche.
 */
export function positionPhoto(visage: { x: number | null; y: number | null }): string {
  return visage.x !== null && visage.y !== null ? `${visage.x}% ${visage.y}%` : "50% 0%";
}
