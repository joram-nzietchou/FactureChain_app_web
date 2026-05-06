const express = require('express');
const router = express.Router();
const meterController = require('../controllers/meterController');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

// Route UNIQUE : enregistrer un relevé
router.post('/store', meterController.storeReading);

// Route : récupérer l'historique blockchain
router.get('/history', meterController.getBlockchainHistory);

module.exports = router;