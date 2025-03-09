const express = require('express');
const router = express.Router();
const conventionController = require('../controllers/conventionController');
const { auth, checkRole, checkPermission } = require('../middleware/auth');
const { ROLES } = require('../config/roles');

// Route pour créer une nouvelle convention
// Routes accessibles uniquement aux professeurs et entreprises
/*router.post(
  '/', 
  auth, 
  checkRole([ROLES.PROFESSEUR, ROLES.ENTREPRISE, ROLES.ADMIN]), 
  conventionController.createConvention
);*/

// Route pour tester l'endpoint
router.get('/test',(req, res,) =>
  res.send('test')
);

// Route pour récupérer une convention par son ID
router.get(
  '/:id',
  auth,
  checkRole(['ADMIN', 'PROFESSEUR']),
  conventionController.getConventionById
);

// Routes accessibles avec la permission spécifique
router.get(
  '/:id',
  auth,
  checkPermission('view_own_documents'),
  conventionController.getConventionById
);

/*  Routes de signature accessibles à tous les rôles
/ router.post(
  '/:id/sign',
  auth,
  checkPermission('sign_document'),
  conventionController.signConvention
);*/

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
