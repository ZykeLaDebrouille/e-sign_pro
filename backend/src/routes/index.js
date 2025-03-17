const express = require('express');
const router = express.Router();
const userRoutes = require('./userRoutes');
const conventionsRoutes = require('./conventionsRoutes');

// Routes
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
