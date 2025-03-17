const express = require('express');
const router = express.Router();
const conventionController = require('../controllers/conventionController');
const { auth } = require('../middleware/auth');

router.get(
  '/:id',
  auth,
  conventionController.getConventionById);

router.post('/:id/sign', conventionController.signConvention);

router.put(
  '/:id',
  auth,
  conventionController.updateConvention);

router.delete(
  '/:id',
  auth,
  conventionController.softDeleteConvention);

router.get(
  '/:id/pdf',
  auth,
  conventionController.generateConventionPDF);

  module.exports = router;