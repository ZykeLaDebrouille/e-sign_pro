const path = require('path');

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

const PORT = process.env.PORT || 5050;



process.on('uncaughtException', (err) => {
  console.error('ERREUR NON GÉRÉE:', err);
  // Ne pas quitter immédiatement pour permettre l'écriture des logs
  setTimeout(() => process.exit(1), 1000);
});

async function startServer() {
  try {
    console.log('Tentative de connexion à la base de données...');
    const db = await database.connect();
    console.log('Connexion à la base de données réussie');
    
    // Initialiser les tables restantes après le démarrage du serveur
    setTimeout(async () => {
      try {
        await database.initializeTables();
      } catch (error) {
        console.error('Erreur lors de l\'initialisation complète des tables:', error);
      }
    }, 2000);
    
    app.listen(PORT, () => {
      console.log(`Serveur démarré sur le port ${PORT}`);
    });
  } catch (error) {
    console.error('Erreur fatale au démarrage du serveur:', error);
    process.exit(1);
  }
}

startServer();
