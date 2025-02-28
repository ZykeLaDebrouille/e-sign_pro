const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const database = require('./config/database');

const app = express();

// Middleware de sécurité avec Helmet pour sécuriser les headers HTTP
app.use(helmet());

// Configuration de CORS pour autoriser le front-end à accéder aux ressources
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true, // Permet l'envoi de cookies, headers d'authentification, etc.
}));

// Middleware pour parser les corps de requêtes et les cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging en mode développement
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Connexion à la base de données
database.connect()
  .then(() => console.log('Base de données connectée'))
  .catch(err => {
    console.error('Erreur de connexion à la base de données:', err);
    process.exit(1);
  });

// Montage des routes sous le préfixe /api
app.use('/api', routes);

// Middleware de gestion des erreurs (centralise le traitement des erreurs)
app.use(errorHandler);

// Gestion des promesses non attrapées
process.on('unhandledRejection', (err) => {
  console.error('Erreur non gérée:', err);
  process.exit(1);
});

// Optionnel : Gestion des exceptions non interceptées
process.on('uncaughtException', (err) => {
  console.error('Exception non interceptée:', err);
  process.exit(1);
});

module.exports = app;
