// Fichier: src/routes/conventionsRoutes.js
const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const conventionController = require('../controllers/conventionController');

router.post('/conventions/create', 
  auth, 
  checkRole(['ADMIN', 'PROFESSEUR']), 
  conventionController.generateConvention
);

module.exports = router;
