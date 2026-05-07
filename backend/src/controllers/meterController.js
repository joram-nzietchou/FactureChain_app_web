const MeterReading = require('../models/MeterReading');
const blockchainService = require('../services/blockchainService');

// Obtenir le dernier index de l'utilisateur
exports.getLastIndex = async (req, res) => {
  try {
    const { subscriberNumber } = req.user;
    
    const lastReading = await MeterReading.findOne({ subscriberNumber })
      .sort({ readingDate: -1 });
    
    res.json({ 
      success: true, 
      lastIndex: lastReading ? lastReading.currentIndex : 0 
    });
  } catch (error) {
    console.error('Erreur getLastIndex:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Enregistrer un relevé
exports.storeReading = async (req, res) => {
  try {
    const { subscriberNumber, previousIndex, currentIndex } = req.body;
    
    if (!subscriberNumber) {
      return res.status(400).json({ success: false, error: 'Numéro abonné requis' });
    }
    if (currentIndex <= previousIndex) {
      return res.status(400).json({ success: false, error: 'L\'index actuel doit être supérieur' });
    }
    
    // Calculer la consommation
    const consumption = currentIndex - previousIndex;
    
    // Calculer le prix (tarifs ENEO)
    let price = 0;
    let remaining = consumption;
    if (remaining <= 110) price = remaining * 110;
    else if (remaining <= 220) price = (110 * 110) + (remaining - 110) * 115;
    else price = (110 * 110) + (110 * 115) + (remaining - 220) * 120;
    
    const tva = price * 0.1925;
    const totalAmount = Math.round(price + tva);
    
    // Enregistrer sur la blockchain
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
    
    // Sauvegarder en base de données
    const reading = await MeterReading.create({
      subscriberNumber,
      readingDate: new Date(),
      month: new Date().toLocaleString('fr-FR', { month: 'long' }),
      year: new Date().getFullYear(),
      previousIndex,
      currentIndex,
      consumption,
      calculatedAmount: totalAmount,
      blockchainHash: blockchainResult.transactionHash,
      blockchainReadingId: blockchainResult.readingId
    });
    
    res.status(201).json({
      success: true,
      message: 'Relevé enregistré sur la blockchain',
      data: {
        reading,
        blockchain: {
          transactionHash: blockchainResult.transactionHash,
          readingId: blockchainResult.readingId,
          blockNumber: blockchainResult.blockNumber
        }
      }
    });
    
  } catch (error) {
    console.error('Erreur storeReading:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Obtenir l'historique des relevés
exports.getHistory = async (req, res) => {
  try {
    const { subscriberNumber } = req.user;
    
    const readings = await MeterReading.find({ subscriberNumber })
      .sort({ readingDate: -1 })
      .limit(12);
    
    res.json({ success: true, data: readings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};