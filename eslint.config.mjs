import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  // next-env.d.ts est genere par Next et gitignore : le linter n'a pas a
  // se prononcer sur un fichier que personne n'ecrit.
  { ignores: [".next/**", "node_modules/**", "drizzle/**", "next-env.d.ts"] },
];

export default eslintConfig;
