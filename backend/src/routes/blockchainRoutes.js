const express = require('express');
const router = express.Router();
const blockchainService = require('../services/blockchainService');
const { authMiddleware } = require('../middleware/auth');

// Route publique pour tester
router.get('/prochain-id', async (req, res) => {
  try {
    const result = await blockchainService.getProchainId();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Routes protégées
router.use(authMiddleware);

router.get('/history', async (req, res) => {
  try {
    const { subscriberNumber } = req.user;
    console.log('📋 Récupération historique pour:', subscriberNumber);
    
    // Récupérer depuis la base de données locale d'abord
    const MeterReading = require('../models/MeterReading');
    const localReadings = await MeterReading.find({ subscriberNumber })
      .sort({ createdAt: -1 });
    
    // Essayer de récupérer depuis la blockchain
    let blockchainReadings = [];
    try {
      const result = await blockchainService.getSubscriberReadings(subscriberNumber);
      if (result.success && result.readings) {
        blockchainReadings = result.readings;
      }
    } catch (error) {
      console.log('⚠️ Blockchain non disponible, utilisation des données locales');
    }
    
    // Fusionner les données (blockchain d'abord, puis local)
    const allReadings = [...blockchainReadings, ...localReadings];
    
    // Dédupliquer par ID
    const uniqueReadings = [];
    const ids = new Set();
    for (const reading of allReadings) {
      if (!ids.has(reading.id)) {
        ids.add(reading.id);
        uniqueReadings.push(reading);
      }
    }
    
    res.json({
      success: true,
      data: {
        readings: uniqueReadings,
        count: uniqueReadings.length,
        source: 'combined'
      }
    });
  } catch (error) {
    console.error('Erreur history:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;