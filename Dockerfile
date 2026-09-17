FROM node:22-slim AS builder

RUN apt-get update && apt-get install -y git ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package.json package-lock.json* .npmrc* ./
COPY scripts ./scripts
RUN npm install

COPY . .
RUN npx quartz plugin install --from-config || npx quartz plugin install
RUN node scripts/patch-pt-pt.mjs
RUN npx quartz build

FROM caddy:2-alpine
COPY deploy/Caddyfile /etc/caddy/Caddyfile
COPY --from=builder /app/public /usr/share/caddy
