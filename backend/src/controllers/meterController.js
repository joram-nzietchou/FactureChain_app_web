const MeterReading = require('../models/MeterReading');
const blockchainService = require('../services/blockchainService');

// Enregistrement SIMPLIFIÉ - uniquement dans la blockchain
exports.storeReading = async (req, res) => {
  try {
    const { subscriberNumber, previousIndex, currentIndex } = req.body;
    
    // Validation simple
    if (!subscriberNumber) {
      return res.status(400).json({ success: false, error: 'Numéro abonné requis' });
    }
    if (currentIndex <= previousIndex) {
      return res.status(400).json({ success: false, error: 'L\'index actuel doit être supérieur' });
    }
    
    console.log(`📝 Enregistrement relevé: ${subscriberNumber} - ${previousIndex} → ${currentIndex}`);
    
    // Enregistrer dans la blockchain
    const blockchainResult = await blockchainService.storeReading(
      subscriberNumber,
      previousIndex,
      currentIndex
    );
    
    if (!blockchainResult.success) {
      return res.status(500).json({
        success: false,
        error: `Erreur blockchain: ${blockchainResult.error}`
      });
    }
    
    // Sauvegarde locale optionnelle
    const reading = await MeterReading.create({
      subscriberNumber,
      readingDate: new Date(),
      month: new Date().toLocaleString('fr-FR', { month: 'long' }),
      year: new Date().getFullYear(),
      previousIndex,
      currentIndex,
      consumption: currentIndex - previousIndex,
      blockchainHash: blockchainResult.transactionHash,
      blockchainReadingId: blockchainResult.readingId
    });
    
    res.status(201).json({
      success: true,
      message: 'Relevé enregistré sur la blockchain',
      data: {
        blockchain: {
          transactionHash: blockchainResult.transactionHash,
          readingId: blockchainResult.readingId,
          blockNumber: blockchainResult.blockNumber
        },
        local: reading
      }
    });
    
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Récupérer l'historique blockchain
exports.getBlockchainHistory = async (req, res) => {
  try {
    const { subscriberNumber } = req.user;
    const result = await blockchainService.getReadings(subscriberNumber);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};