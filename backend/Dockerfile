# Étape de construction
FROM node:18.16.0-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Étape finale
FROM node:18.16.0-alpine

WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .

# Sécurité
USER node
EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

CMD ["node", "app.js"]