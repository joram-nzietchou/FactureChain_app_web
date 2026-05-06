const express = require('express');
const router = express.Router();
const blockchainController = require('../controllers/blockchainController');
const { authMiddleware } = require('../middleware/auth');

// Toutes les routes nécessitent authentification
router.use(authMiddleware);

// Routes pour l'historique blockchain
router.get('/history', blockchainController.getBlockchainHistory);
router.get('/reading/:id', blockchainController.getBlockchainReadingById);
router.get('/last-reading', blockchainController.getLastBlockchainReading);

// Route pour le prochain ID
router.get('/prochain-id', async (req, res) => {
  const blockchainService = require('../services/blockchainService');
  const result = await blockchainService.getProchainId();
  res.json(result);
});

module.exports = router;