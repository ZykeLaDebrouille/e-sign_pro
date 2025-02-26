const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

console.log('Current directory:', __dirname);
console.log('Environment variables:', {
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  NODE_ENV: process.env.NODE_ENV
});

const app = require('./app');
const database = require('./config/database');

const PORT = process.env.PORT || 5050;

async function startServer() {
  try {
    await database.connect();
    app.listen(PORT, () => {
      console.log(`Serveur démarré sur le port ${PORT}`);
    });
  } catch (error) {
    console.error('Erreur au démarrage du serveur:', error);
    process.exit(1);
  }
}

startServer();
