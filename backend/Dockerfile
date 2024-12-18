FROM node:16

# Créer le dossier de l'application
WORKDIR /usr/src/app

# Copier les fichiers de l'application
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le code source
COPY . .

# Exposer le port
EXPOSE 5000

# Démarrer le serveur
CMD ["node", "app.js"]
