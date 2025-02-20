const { logger } = require('../config/logger');
const { 
  ValidationError,
  AuthenticationError,
  DatabaseError
} = require('../errors/customErrors');

const errorHandler = (err, req, res, next) => {
  let statusCode = 500;
  let errorCode = 'INTERNAL_ERROR';
  let message = 'Erreur serveur';

  // Gestion des erreurs métier
  if (err instanceof ValidationError) {
    statusCode = 400;
    errorCode = 'VALIDATION_ERROR';
    message = err.message;
  } else if (err instanceof AuthenticationError) {
    statusCode = 401;
    errorCode = 'AUTH_ERROR';
    message = 'Problème d\'authentification';
  }

  // Logging contextuel
  logger.error(err.message, {
    path: req.path,
    method: req.method,
    user: req.user?.id,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });

  res.status(statusCode).json({
    success: false,
    error: errorCode,
    message,
    details: process.env.NODE_ENV === 'development' ? err.details : undefined
  });
};