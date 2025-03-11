/**
 * Point d'entrée principal du serveur
 * Initialise l'application et lance le serveur HTTP
 */
const path = require('path');
// Chargement des variables d'environnement depuis le fichier .env
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Logs de débogage pour vérifier la configuration
console.log('Current directory:', __dirname);
console.log('Environment variables:', {
  JWT_SECRET: process.env.JWT_SECRET ? '[SECRET PRÉSENT]' : '[MANQUANT]',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET ? '[SECRET PRÉSENT]' : '[MANQUANT]',
  NODE_ENV: process.env.NODE_ENV
});

// Import de l'application Express configurée et de la connexion BDD
const app = require('./app');
const database = require('./config/database');

// Port d'écoute du serveur (5050 par défaut)
const PORT = process.env.PORT || 5050;

/**
 * Fonction asynchrone pour démarrer le serveur
 * - Connecte d'abord la base de données
 * - Puis démarre le serveur HTTP
 */
async function startServer() {
  try {
    await database.connect();
    app.listen(PORT, () => {
      console.log(`Serveur démarré sur le port ${PORT}`);
    });
  } catch (error) {
    console.error('Erreur au démarrage du serveur:', error);
    process.exit(1); // Arrêt du processus en cas d'erreur critique
  }
}

startServer();
