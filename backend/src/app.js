/**
 * Configuration principale de l'application Express
 * Définit les middlewares, la gestion CORS, et le montage des routes
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const routes = require('./routes');
const listEndpoints = require('express-list-endpoints');
const errorHandler = require('./middleware/errorHandler');
const database = require('./config/database');

const app = express();

// Sécurisation des en-têtes HTTP avec Helmet
app.use(helmet());

// Configuration CORS pour permettre l'accès depuis le frontend
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true, // Autorise l'envoi de cookies et tokens d'authentification
}));

// Middlewares pour parser les requêtes et cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging des requêtes en développement
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

// Middleware centralisé de gestion d'erreurs
app.use(errorHandler);

// Gestion des promesses non capturées
process.on('unhandledRejection', (err) => {
  console.error('Erreur non gérée:', err);
  process.exit(1);
});

// Affichage des routes disponibles (utile pour le débogage)
console.log('Endpoints de l\'app :', listEndpoints(app));

module.exports = app;
