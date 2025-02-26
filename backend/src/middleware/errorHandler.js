const ApiError = require('../utils/ApiError');

const errorHandler = (err, req, res, next) => {
  let error = err;

  // Si l'erreur n'est pas une instance de ApiError, on la convertit
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Une erreur est survenue';
    error = new ApiError(statusCode, message, false, err.stack);
  }

  // Réponse d'erreur
  const response = {
    status: error.status,
    message: error.message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: error.stack,
    }),
  };

  res.status(error.statusCode).json(response);
};

module.exports = errorHandler;
