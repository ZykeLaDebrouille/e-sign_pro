// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth } = require('../middleware/auth');

// Routes publiques
router.post('/register', userController.register.bind(userController));
router.post('/login', userController.login.bind(userController));
router.post('/refresh-token', userController.refreshToken.bind(userController));

// Routes protégées
router.use(auth);

router.get('/profile', userController.getProfile.bind(userController));
router.put('/profile', userController.updateProfile.bind(userController));
router.post('/change-password', userController.changePassword.bind(userController));
router.post('/logout', userController.logout.bind(userController));

module.exports = router;
