// src/routes/conventionRoutes.js
const express = require('express');
const router = express.Router();
const conventionController = require('../controllers/conventionController');
const auth = require('../middleware/auth');

router.post('/create', auth, conventionController.createConvention);
router.put('/:id', auth, conventionController.updateConvention);
router.get('/:id', auth, conventionController.getConvention);
router.get('/:id/pdf', auth, conventionController.generatePDF);

module.exports = router;
