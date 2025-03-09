# Étape de build
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Étape de production avec Nginx
FROM nginx:alpine

# Copier les fichiers statiques générés par React
COPY --from=build /app/build /usr/share/nginx/html

# Copier la configuration nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port 3000
EXPOSE 3000

# Démarrer nginx
CMD ["nginx", "-g", "daemon off;"]
