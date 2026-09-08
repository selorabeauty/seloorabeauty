FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

COPY . .

ARG NEXT_PUBLIC_API_URL=https://api.seloorabeauty.shop
ARG NEXT_PUBLIC_TIKTOK_PIXEL_ID
ARG NEXT_PUBLIC_SNAPCHAT_PIXEL_ID
ARG NEXT_PUBLIC_SITE_URL=https://seloorabeauty.shop
ARG NEXT_PUBLIC_ORDER_WEBHOOK_URL=https://hook.eu1.make.com/1m9u54euj472x06lfpfyuln4k81xf6wj

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_TIKTOK_PIXEL_ID=$NEXT_PUBLIC_TIKTOK_PIXEL_ID
ENV NEXT_PUBLIC_SNAPCHAT_PIXEL_ID=$NEXT_PUBLIC_SNAPCHAT_PIXEL_ID
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_ORDER_WEBHOOK_URL=$NEXT_PUBLIC_ORDER_WEBHOOK_URL

RUN npm run build

# Production runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0

RUN mkdir -p ./public
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Install socat to forward port 80 → 3000 (EasyPanel sets proxy to 80)
RUN apk add --no-cache socat

EXPOSE 80
EXPOSE 3000
CMD ["sh", "-c", "PORT=3000 node server.js & sleep 2 && socat TCP-LISTEN:80,fork,reuseaddr TCP:127.0.0.1:3000 & wait"]
