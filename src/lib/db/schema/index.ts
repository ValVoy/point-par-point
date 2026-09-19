/**
 * Schema complet, reexporte d'un seul endroit. Drizzle Kit lit ce fichier
 * (cf. drizzle.config.ts), et le reste du code importe toujours depuis
 * "@/lib/db/schema", jamais depuis un fichier de domaine.
 */
export * from "./colonnes";
export * from "./sportif";
export * from "./editorial";
export * from "./exploitation";
