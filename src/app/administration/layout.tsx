import type { Metadata } from "next";

export const metadata: Metadata = {
  // L'administration n'a rien a faire dans un moteur de recherche. Pose ici,
  // la consigne couvre la connexion comme le reste de l'espace.
  robots: { index: false, follow: false },
};

/**
 * Ce layout ne fait que porter la consigne d'indexation. La coquille visuelle
 * et la garde d'acces vivent dans le groupe `(interieur)`, ce qui laisse la
 * page de connexion en dehors : elle garde son adresse `/administration/
 * connexion` mais n'herite ni de la navigation ni de l'exigence d'etre
 * connecte, ce qui serait evidemment circulaire.
 */
export default function AdministrationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
