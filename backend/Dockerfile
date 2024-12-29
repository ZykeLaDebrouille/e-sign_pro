FROM node:18.16.0-alpine

# Créer le dossier de l'application
WORKDIR /usr/src/app

# Copier les fichiers de l'application
COPY package*.json ./

# Installer les dépendances npm ci au lieu de npm install assure une installation plus cohérente des dépendances.
RUN npm install --production

# Copier le reste du code source
COPY . .

# Exposer le port
EXPOSE 5000

# Démarrer le serveur
CMD ["node", "app.js"]
