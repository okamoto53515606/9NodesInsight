# ---- Stage 1: Dependencies ----
FROM node:22-slim AS deps
WORKDIR /app
# lockfile を含めてコピーし、npm ci で固定されたバージョンを再現性高くインストールする
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# ---- Stage 2: Build ----
FROM node:22-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* 系はビルド時に埋め込まれる（現状不要だが将来用にプレースホルダー）
ARG NEXT_PUBLIC_GOOGLE_GENAI_API_KEY

RUN npm run build

# ---- Stage 3: Runner ----
FROM node:22-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# standalone 出力をコピー
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

USER nextjs

EXPOSE 8080

CMD ["node", "server.js"]
