# Utiliser l'image Node.js complète plutôt qu'Alpine
FROM node:18.16.0

WORKDIR /usr/src/app

# Installer des dépendances requises pour SQLite
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copier et installer les dépendances
COPY package*.json ./
RUN npm install
RUN npm rebuild sqlite3 --build-from-source

# Copier le reste des fichiers
COPY . .

# Préparation des répertoires avec permissions complètes
RUN mkdir -p /usr/src/app/database /usr/src/app/pdfs \
    && chmod -R 777 /usr/src/app/database /usr/src/app/pdfs \
    && touch /usr/src/app/database/esign.sqlite \
    && chmod 777 /usr/src/app/database/esign.sqlite

EXPOSE 5500

# Utiliser ces arguments pour activer le débogage
CMD ["node", "--trace-warnings", "--unhandled-rejections=strict", "src/server.js"]
