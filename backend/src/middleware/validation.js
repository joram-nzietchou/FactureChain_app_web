const { body, param, query, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      errors: errors.array() 
    });
  }
  next();
};

// Validation inscriptions
const registerValidation = [
  body('fullName').notEmpty().withMessage('Nom requis'),
  body('email').isEmail().withMessage('Email invalide'),
  body('subscriberNumber')
    .matches(/^ENEO\d{9}$/).withMessage('Numéro ENEO invalide (ex: ENEO123456789)'),
  body('phone').matches(/^[0-9]{9}$/).withMessage('Téléphone invalide (9 chiffres)'),
  body('password').isLength({ min: 6 }).withMessage('Mot de passe minimum 6 caractères'),
  body('city').optional(),
  body('district').optional(),
  validate
];

// Validation connexion
const loginValidation = [
  body('email').isEmail().withMessage('Email invalide'),
  body('password').notEmpty().withMessage('Mot de passe requis'),
  validate
];

// Validation réclamation
const claimValidation = [
  body('subscriberNumber').notEmpty().withMessage('Numéro abonné requis'),
  body('month').notEmpty().withMessage('Mois requis'),
  body('year').isInt({ min: 2020, max: 2030 }).withMessage('Année invalide'),
  body('blockchainConsumption').isFloat({ min: 0 }).withMessage('Consommation invalide'),
  body('eneoAmount').isFloat({ min: 0 }).withMessage('Montant invalide'),
  body('description').notEmpty().withMessage('Description requise'),
  validate
];

module.exports = {
  registerValidation,
  loginValidation,
  claimValidation
};