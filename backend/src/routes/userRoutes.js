const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); // Assure-toi que ce chemin est correct
const { auth } = require('../middleware/auth'); // Middleware d'authentification

// Routes publiques
router.post('/register', (req, res, next) => userController.register(req, res, next));
router.post('/login', (req, res, next) => userController.login(req, res, next));
router.post('/refresh-token', (req, res, next) => userController.refreshToken(req, res, next));

// Routes protégées
router.get('/check-auth', auth, (req, res, next) => userController.checkAuth(req, res, next));
router.get('/profile', auth, (req, res, next) => userController.getProfile(req, res, next));
router.put('/profile', auth, (req, res, next) => userController.updateProfile(req, res, next));
router.post('/change-password', auth, (req, res, next) => userController.changePassword(req, res, next));
router.post('/logout', auth, (req, res, next) => userController.logout(req, res, next));

module.exports = router;
