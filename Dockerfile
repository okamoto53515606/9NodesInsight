# ---- Stage 1: Dependencies ----
# Node 24 系。マイナー / パッチは固定せず、ビルド時に最新の 24.x を取得する
# （2026-11-11 のセキュリティ修正版 24.22.3 以降が必要。`--pull` 併用で最新化）
FROM node:24-slim AS deps
WORKDIR /app
# lockfile を含めてコピーし、npm ci で固定されたバージョンを再現性高くインストールする
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# ---- Stage 2: Build ----
FROM node:24-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* 系はビルド時に埋め込まれる（現状不要だが将来用にプレースホルダー）
ARG NEXT_PUBLIC_GOOGLE_GENAI_API_KEY

RUN npm run build

# ---- Stage 3: Runner ----
FROM node:24-slim AS runner
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
