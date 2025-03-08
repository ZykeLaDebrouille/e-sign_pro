const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const conventionController = require('../controllers/conventionController');

// Route pour créer une nouvelle convention
router.post(
  '/',
  auth,
  checkRole(['ADMIN', 'PROFESSEUR', 'ELEVE']),
  conventionController.generateConventionPDF
);

// Route pour tester l'endpoint
router.get('/test',(req, res,) =>
  res.send('test')
);

// Route pour récupérer une convention par son ID
router.get(
  '/:id',
  auth,
  conventionController.getConventionById
);

// Route pour mettre à jour une convention existante
router.put(
  '/:id',
  auth,
  checkRole(['ADMIN', 'PROFESSEUR']),
  conventionController.updateConvention
);

// Route pour effectuer une suppression logique (soft delete) d'une convention
router.delete(
  '/:id',
  auth,
  checkRole(['ADMIN', 'PROFESSEUR']),
  conventionController.softDeleteConvention
);

// Route pour générer et télécharger le PDF d'une convention
router.get(
  '/:id/pdf',
  auth,
  checkRole(['ADMIN', 'PROFESSEUR']),
  conventionController.generateConventionPDF
);

module.exports = router;
