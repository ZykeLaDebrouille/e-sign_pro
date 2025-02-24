const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const routes = require('..');
const errorHandler = require('./middleware/errorHandler');
const database = require('./config/database');

const app = express();

// Middleware de sécurité
app.use(helmet());

// Configuration CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Parsing du body et des cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Connection à la base de données
database.connect()
  .then(() => console.log('Base de données connectée'))
  .catch(err => console.error('Erreur de connexion à la base de données:', err));

// Routes
app.use('/api', routes);

// Gestion des erreurs
app.use(errorHandler);

// Gestion des erreurs non attrapées
process.on('unhandledRejection', (err) => {
  console.error('Erreur non gérée:', err);
  process.exit(1);
});

module.exports = app;
