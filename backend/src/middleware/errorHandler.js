const ApiError = require('../utils/ApiError');

/**
 * Intercepte toutes les erreurs et les transforme en réponses JSON structurées
 * 
 * @param {Error} err - L'erreur interceptée
 * @param {Request} req - Objet requête Express
 * @param {Response} res - Objet réponse Express
 * @param {Function} next - Fonction suivante (non utilisée ici)
 */
const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Une erreur est survenue';
    error = new ApiError(statusCode, message, false, err.stack);
  }

  // Construction de la réponse d'erreur
  const response = {
    status: error.status,
    message: error.message,
    // Inclut la stack trace uniquement en développement
    ...(process.env.NODE_ENV === 'development' && {
      stack: error.stack,
    }),
  };

  res.status(error.statusCode).json(response);
};

module.exports = errorHandler;
