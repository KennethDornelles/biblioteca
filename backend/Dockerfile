# Estágio de build
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npx prisma generate
RUN npm run build
RUN npm prune --production

# Estágio de produção
FROM node:18-alpine AS production

WORKDIR /app

RUN apk add --no-cache curl
RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001

COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/package*.json ./
COPY --from=builder --chown=nestjs:nodejs /app/prisma ./prisma

# Copy entrypoint script
COPY --chown=nestjs:nodejs entrypoint.sh .
RUN chmod +x entrypoint.sh

USER nestjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 
  CMD curl -f http://localhost:3000/ || exit 1

ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["npm", "run", "start:prod"]
