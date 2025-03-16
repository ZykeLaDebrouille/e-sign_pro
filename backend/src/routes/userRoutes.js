// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth } = require('../middleware/auth');
const jwt = require('jsonwebtoken');
 // Import direct sans destructuration

// Routes publiques
router.post('/register', userController.register.bind(userController));
router.post('/login', userController.login.bind(userController));
router.post('/refresh-token', userController.refreshToken.bind(userController));

// Routes protégées
router.get('/check-auth', auth, userController.checkAuth.bind(userController));
router.get('/profile', auth, userController.getProfile.bind(userController));
router.put('/profile', auth, userController.updateProfile.bind(userController));
router.post('/change-password', auth, userController.changePassword.bind(userController));
router.post('/logout', auth, userController.logout.bind(userController));

module.exports = router;
