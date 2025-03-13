# Image de base Node.js 18 Alpine (légère)
FROM node:18.16.0-alpine

# Définition du répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Copie uniquement des fichiers de dépendances pour optimiser le cache Docker
COPY package*.json ./

# Installation des dépendances
RUN npm install 

# Copie du reste des fichiers source de l'application
COPY . .

# Création d'un répertoire pour la base de données et des PDFs avec permissions étendues
RUN mkdir -p database && chmod -R 777 database && mkdir -p pdfs && chmod -R 777 pdfs

# Définition du port exposé par le conteneur
EXPOSE 5050

# Commande de démarrage du serveur
CMD ["node", "src/server.js"]
