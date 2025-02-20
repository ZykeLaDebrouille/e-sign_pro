const { body } = require('express-validator');
const { roles } = require('../config/constants');

const registrationRules = [
  body('email')
    .isEmail().withMessage('Format email invalide')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 12 }).withMessage('12 caractères minimum')
    .matches(/[A-Z]/).withMessage('Doit contenir une majuscule')
    .matches(/[0-9]/).withMessage('Doit contenir un chiffre'),
  
  body('role')
    .optional()
    .isIn(roles).withMessage(`Rôle invalide. Choix possibles: ${roles.join(', ')}`)
];

module.exports = { registrationRules };