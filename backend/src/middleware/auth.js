/**
 * Middleware d'authentification et d'autorisation
 * Vérifie les tokens JWT et les permissions utilisateur
 */
const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const User = require('../models/User');
const { hasPermission } = require('../config/roles');

/**
 * Middleware principal d'authentification
 * Vérifie le token JWT et ajoute l'utilisateur à la requête
 * 
 * @param {Request} req - Objet requête Express
 * @param {Response} res - Objet réponse Express
 * @param {Function} next - Fonction de passage au middleware suivant
 */
const auth = async (req, res, next) => {
  try {
    // Récupère le token depuis les cookies ou l'en-tête Authorization
    const token = req.cookies.accessToken || 
                  (req.headers.authorization && req.headers.authorization.split(' ')[1]);

    if (!token) {
      throw new ApiError(401, 'Authentification requise');
    }

    // Vérifie et décode le token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Récupère l'utilisateur depuis la base de données
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new ApiError(401, 'Utilisateur non trouvé');
    }

    // Ajoute l'utilisateur à l'objet requête pour les handlers suivants
    req.user = user;
    next();
  } catch (error) {
    // Gestion spécifique des erreurs JWT
    if (error.name === 'JsonWebTokenError') {
      next(new ApiError(401, 'Token invalide'));
    } else if (error.name === 'TokenExpiredError') {
      next(new ApiError(401, 'Token expiré'));
    } else {
      next(error);
    }
  }
};

/**
 * Middleware de vérification des rôles
 * À utiliser après le middleware auth
 * 
 * @param {Array} roles - Liste des rôles autorisés
 * @returns {Function} Middleware de vérification
 */
const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Non authentifié' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Accès refusé : rôle non autorisé' });
    }
    
    next();
  };
};

// Vérification des permissions basée sur le rôle
/**
 * Middleware qui vérifie si l'utilisateur possède la permission requise selon son rôle.
 * 
 * @param {string} permission - La permission requise pour accéder à la route
 * @returns {Function} Middleware Express qui vérifie les permissions de l'utilisateur
 * @throws {Object} Renvoie un statut 401 si l'utilisateur n'est pas authentifié
 * @throws {Object} Renvoie un statut 403 si l'utilisateur n'a pas la permission requise
 */
const checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Non authentifié' });
    }
    
    if (!hasPermission(req.user.role, permission)) {
      return res.status(403).json({ message: 'Accès refusé : permission non accordée' });
    }
    
    next();
  };
};

module.exports = { auth, checkRole, checkPermission };