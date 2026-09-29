import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

// Depuis Next 16, eslint-config-next fournit directement une configuration
// plate : plus besoin de passer par FlatCompat.
const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTypescript,
  // next-env.d.ts est genere par Next et gitignore : le linter n'a pas a
  // se prononcer sur un fichier que personne n'ecrit.
  globalIgnores([".next/**", "node_modules/**", "drizzle/**", "next-env.d.ts"]),
]);

export default eslintConfig;
