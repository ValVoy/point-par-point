# syntax=docker/dockerfile:1

# Image pour Coolify. Next.js en sortie autonome (output: "standalone"),
# donc l'etage d'execution ne porte ni node_modules complet ni sources.

FROM node:24-alpine AS base

# --- Dependances -----------------------------------------------------------
FROM base AS dependances
WORKDIR /app
COPY package.json package-lock.json ./
# npm ci et non npm install : le verrou fait foi, c'est lui qui protege des
# versions publiees entre-temps. --ignore-scripts refuse aux paquets tiers
# d'executer quoi que ce soit pendant l'installation.
RUN npm ci --ignore-scripts

# --- Compilation -----------------------------------------------------------
FROM base AS compilation
WORKDIR /app
COPY --from=dependances /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# Aucune variable de base n'est necessaire ici : le client Turso est instancie
# paresseusement, le build ne s'y connecte jamais. Deux variables, en
# revanche, sont lues a la compilation (audit F5) : le domaine public R2, qui
# autorise les photos dans next/image, et l'adresse publique du site, figee
# dans les metadonnees et les fichiers d'agenda. A poser dans Coolify en
# variables de build.
# UMAMI_URL aussi : la politique de securite du contenu (next.config.ts)
# autorise son script et ses envois, et se fige a la compilation.
ARG R2_DOMAINE_PUBLIC
ARG NEXT_PUBLIC_SITE_URL
ARG UMAMI_URL
ENV R2_DOMAINE_PUBLIC=$R2_DOMAINE_PUBLIC
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV UMAMI_URL=$UMAMI_URL
RUN npm run build

# --- Execution -------------------------------------------------------------
FROM base AS execution
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

COPY --from=compilation /app/public ./public
COPY --from=compilation --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=compilation --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

# Sante (audit F7) : serveur et base, pour que Coolify ne bascule pas vers un
# conteneur qui ne repond pas. wget est fourni par l'image alpine.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3   CMD wget -q -O /dev/null http://127.0.0.1:3000/sante || exit 1

CMD ["node", "server.js"]
