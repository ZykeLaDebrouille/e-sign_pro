// Fichier: src/routes/conventionsRoutes.js
const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const conventionController = require('../controllers/conventionController');

router.post('/conventions/create', 
  auth, 
  checkRole(['ADMIN', 'TEACHER']), 
  conventionController.create
);

module.exports = router;
