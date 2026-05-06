const blockchainService = require('../services/blockchainService');

exports.getBlockchainHistory = async (req, res) => {
  try {
    const { subscriberNumber } = req.user;
    console.log(`📋 Récupération historique blockchain pour: ${subscriberNumber}`);
    
    const result = await blockchainService.getSubscriberReadings(subscriberNumber);
    
    if (result.success) {
      res.json({
        success: true,
        data: {
          readings: result.readings,
          count: result.readings.length,
          source: 'blockchain'
        }
      });
    } else {
      res.status(500).json({ success: false, error: result.error });
    }
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getBlockchainReadingById = async (req, res) => {
  try {
    const { id } = req.params;
    const contract = blockchainService.contract;
    
    if (!contract) {
      return res.status(500).json({ success: false, error: 'Blockchain non disponible' });
    }
    
    const reading = await contract.getReading(id);
    
    res.json({
      success: true,
      data: {
        id: reading.id.toString(),
        abonne: reading.owner,
        subscriberNumber: reading.subscriberNumber,
        previousIndex: reading.previousIndex.toString(),
        currentIndex: reading.currentIndex.toString(),
        timestamp: new Date(parseInt(reading.timestamp) * 1000).toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getLastBlockchainReading = async (req, res) => {
  try {
    const { subscriberNumber } = req.user;
    const result = await blockchainService.getSubscriberReadings(subscriberNumber);
    
    if (result.success && result.readings.length > 0) {
      const lastReading = result.readings[result.readings.length - 1];
      res.json({
        success: true,
        lastIndex: parseInt(lastReading.currentIndex),
        lastReading: lastReading
      });
    } else {
      res.json({ success: true, lastIndex: 0 });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};