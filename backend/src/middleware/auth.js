const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const User = require('../models/User');

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

module.exports = auth;
