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
# paresseusement, le build ne s'y connecte jamais.
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

CMD ["node", "server.js"]
