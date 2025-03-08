const express = require('express');
const router = express.Router();
const userRoutes = require('./userRoutes');
const conventionsRoutes = require('./conventionsRoutes');


// Route de base pour vérifier que l'API fonctionne
router.get('/', (req, res) => {
  res.json({ message: 'Bienvenue sur l\'API de signature électronique' });
});

// Routes utilisateur
router.use('/users', userRoutes);
router.use('/conventions', conventionsRoutes);


// Gestion des routes non trouvées
router.use('*', (req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: 'Route non trouvée'
  });
});

module.exports = router;
