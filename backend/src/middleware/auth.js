// backend/src/middleware/auth.js
const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const User = require('../models/User');
const { hasPermission } = require('../config/roles');

const auth = async (req, res, next) => {
  try {
    // Vérifier le token dans les cookies ou dans le header Authorization
    const token = req.cookies.accessToken || 
                  (req.headers.authorization && req.headers.authorization.split(' ')[1]);

    if (!token) {
      throw new ApiError(401, 'Authentification requise');
    }

    // Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Récupérer l'utilisateur
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new ApiError(401, 'Utilisateur non trouvé');
    }

    // Ajouter l'utilisateur à la requête
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(new ApiError(401, 'Token invalide'));
    } else if (error.name === 'TokenExpiredError') {
      next(new ApiError(401, 'Token expiré'));
    } else {
      next(error);
    }
  }
};

const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Non authentifié' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Accès refusé: rôle non autorisé' });
    }
    
    next();
  };
};

const checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Non authentifié' });
    }
    
    if (!hasPermission(req.user.role, permission)) {
      return res.status(403).json({ message: 'Accès refusé: permission non accordée' });
    }
    
    next();
  };
};

module.exports = { auth, checkRole, checkPermission };
