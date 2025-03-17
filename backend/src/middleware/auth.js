const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken; // Récupération depuis le cookie

    if (!token) {
      return next(new ApiError(401, 'Authentification requise'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) throw new ApiError(404, 'Utilisateur non trouvé');

    req.user = user;
    next();
  } catch (err) {
    next(new ApiError(401, 'Authentification invalide ou expirée'));
  }
};

module.exports = { auth };
