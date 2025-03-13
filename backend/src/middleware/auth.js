// middleware/auth.js
const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const User = require('../models/User');
const { hasPermission } = require('../config/roles');

// Middleware d'authentification principal
const auth = async (req, res, next) => {
  try {
    // Vérifier le token dans les headers Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new ApiError(401, 'Authentification requise'));
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return next(new ApiError(401, 'Authentification requise'));
    }

    // Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Récupérer l'utilisateur
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new ApiError(401, 'Utilisateur non trouvé'));
    }

    // Ajouter l'utilisateur à la requête
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new ApiError(401, 'Token invalide'));
    } else if (error.name === 'TokenExpiredError') {
      return next(new ApiError(401, 'Token expiré'));
    } else {
      return next(error);
    }
  }
};

// Middleware pour vérifier les rôles
const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Non authentifié'));
    }
    
    const roleArray = Array.isArray(roles) ? roles : [roles];
    
    if (!roleArray.includes(req.user.role)) {
      return next(new ApiError(403, 'Accès refusé: rôle non autorisé'));
    }
    
    next();
  };
};

// Middleware pour vérifier les permissions
const checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Non authentifié'));
    }
    
    if (!hasPermission(req.user.role, permission)) {
      return next(new ApiError(403, 'Accès refusé: permission non accordée'));
    }
    
    next();
  };
};

// Exporter correctement les fonctions
module.exports = { auth, checkRole, checkPermission };
