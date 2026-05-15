// backend/src/routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { authMiddleware } = require('../middleware/auth');
const { body } = require('express-validator');

router.use(authMiddleware);

// Obtenir le profil
router.get('/', profileController.getProfile);

// Obtenir les statistiques (AJOUTER CETTE ROUTE)
router.get('/stats', profileController.getUserStats);

// Mettre à jour le profil
router.put('/', [
  body('fullName').optional().notEmpty().withMessage('Nom requis'),
  body('phone').optional().matches(/^[0-9]{9}$/).withMessage('Téléphone invalide (9 chiffres)'),
  body('city').optional(),
  body('district').optional()
], profileController.updateProfile);

// Changer le mot de passe
router.post('/change-password', [
  body('currentPassword').notEmpty().withMessage('Mot de passe actuel requis'),
  body('newPassword').isLength({ min: 6 }).withMessage('Nouveau mot de passe minimum 6 caractères')
], profileController.changePassword);

module.exports = router;