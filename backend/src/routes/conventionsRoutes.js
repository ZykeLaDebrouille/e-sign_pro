// /src/routes/conventionsRoutes.js
const express = require('express');
const router = express.Router();
const conventionController = require('../controllers/conventionController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/generate', 
  authMiddleware.authenticate, 
  conventionController.generateConvention
);

module.exports = router;
