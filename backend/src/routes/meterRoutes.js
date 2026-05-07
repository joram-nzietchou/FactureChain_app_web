const express = require('express');
const router = express.Router();
const meterController = require('../controllers/meterController');
const { authMiddleware } = require('../middleware/auth');

// Toutes les routes nécessitent authentification
router.use(authMiddleware);

// Routes
router.get('/last-index', meterController.getLastIndex);
router.post('/store', meterController.storeReading);
router.get('/history', meterController.getHistory);

module.exports = router;