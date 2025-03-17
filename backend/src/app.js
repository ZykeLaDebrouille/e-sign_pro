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

const corsOptions = {
  origin: function(origin, callback) {
    const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost,http://localhost:3000').split(',');
    // Permettre les requêtes sans origine (comme les applications mobiles ou postman)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Non autorisé par CORS'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging des requêtes en développement
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api', routes);
app.use(errorHandler);

// Gestion des promesses non capturées
process.on('unhandledRejection', (err) => {
  console.error('Erreur non gérée:', err);
  process.exit(1);
});

console.log('Endpoints de l\'app :', listEndpoints(app));

module.exports = app;
