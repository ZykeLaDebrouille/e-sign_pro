// Avant
const JWT_SECRET = process.env.JWT_SECRET || 'votre_secret_jwt';

// Après
const { verifyAccessToken } = require('../utils/tokenUtils'); // Centralisation de la logique
const { logger } = require('../config/logger'); // Logging structuré

const authMiddleware = async (req, res, next) => {
  const token = req.cookies?.accessToken || req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    logger.warn('Tentative d\'accès non autorisé sans token', { ip: req.ip });
    return res.status(401).json({ code: 'UNAUTHORIZED', message: "Authentification requise" });
  }

  try {
    const decoded = await verifyAccessToken(token); // Vérification asynchrone avec blacklist
    req.user = decoded;
    
    // Audit de sécurité : log du contexte utilisateur
    logger.info(`Accès autorisé à ${req.user.email}`, { 
      route: req.path,
      role: req.user.role 
    });
    
    next();
  } catch (error) {
    logger.error('Échec de l\'authentification JWT', { 
      error: error.message,
      token: token.substring(0, 10) // Log partiel pour sécurité
    });
    
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ 
        code: 'TOKEN_EXPIRED', 
        message: "Session expirée, veuillez vous reconnecter"
      });
    }
    res.status(403).json({ code: 'INVALID_TOKEN', message: "Token invalide" });
  }
};