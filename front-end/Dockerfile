# Étape 1 : Build de l'application
FROM node:18-alpine AS build
WORKDIR /app
# Copier les fichiers de dépendances et installer
COPY package*.json ./
RUN npm install
# Copier le reste de l'application et builder
COPY . .
RUN npm run build

# Étape 2 : Serveur de production avec Nginx
FROM nginx:alpine
# Copier le build dans le dossier servi par Nginx
COPY --from=build /app/build /usr/share/nginx/html
# Exposer le port 80 (pense à mapper ce port dans ton docker-compose, par exemple "3000:80" si tu veux accéder via le port 3000)
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
