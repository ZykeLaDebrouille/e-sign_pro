# Image de base Node.js 18 Alpine (légère)
FROM node:18.16.0-alpine

# Définition du répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Création d'un répertoire pour la base de données
RUN mkdir -p database

# Copie uniquement des fichiers de dépendances pour optimiser le cache Docker
COPY package*.json ./

# Installation des dépendances en mode production
# npm install est utilisé car plus flexible que npm ci quand il n'y a pas de package-lock.json
RUN npm install --production

# Copie du reste des fichiers source de l'application
COPY . .

# Définition du port exposé par le conteneur
EXPOSE 5050

# Commande de démarrage du serveur
CMD ["node", "src/server.js"]
