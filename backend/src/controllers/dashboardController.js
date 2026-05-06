const Consumption = require('../models/Consumption');
const Claim = require('../models/Claim');

// Obtenir les données du dashboard
exports.getDashboardData = async (req, res) => {
  try {
    const { subscriberNumber } = req.user;
    
    // Dernière consommation
    const lastConsumption = await Consumption.findOne({ subscriberNumber })
      .sort({ date: -1 });
    
    // Historique des consommations
    const history = await Consumption.find({ subscriberNumber })
      .sort({ date: -1 })
      .limit(12);
    
    // Dernière réclamation
    const lastClaim = await Claim.findOne({ subscriberNumber })
      .sort({ createdAt: -1 });
    
    // Anomalies détectées
    const anomalies = await Consumption.countDocuments({ 
      subscriberNumber, 
      status: 'anomaly' 
    });
    
    // Réclamations actives
    const activeClaims = await Claim.countDocuments({ 
      subscriberNumber, 
      status: { $nin: ['resolved', 'rejected'] } 
    });
    
    // Statistiques zone (à adapter selon vos données)
    const zoneStats = await getZoneStats(subscriberNumber);
    
    res.json({
      success: true,
      data: {
        currentConsumption: lastConsumption,
        history,
        lastClaim,
        stats: {
          anomalies,
          activeClaims
        },
        zoneStats
      }
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
};

// Obtenir les statistiques de zone
async function getZoneStats(subscriberNumber) {
  // Simulation de données par zone
  return {
    activeClaims: 47,
    overcharges: 28,
    readingErrors: 12,
    resolutions: 35
  };
}

// Obtenir l'historique des consommations
exports.getConsumptionHistory = async (req, res) => {
  try {
    const { subscriberNumber } = req.user;
    const { startDate, endDate, limit = 12 } = req.query;
    
    let query = { subscriberNumber };
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    const history = await Consumption.find(query)
      .sort({ date: -1 })
      .limit(parseInt(limit));
    
    res.json({
      success: true,
      data: history
    });
    
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
};

// Vérifier une facture
exports.verifyBill = async (req, res) => {
  try {
    const { subscriberNumber } = req.user;
    const { month, year, eneoAmount } = req.body;
    
    // Trouver la consommation blockchain correspondante
    const consumption = await Consumption.findOne({
      subscriberNumber,
      date: {
        $gte: new Date(year, getMonthNumber(month) - 1, 1),
        $lt: new Date(year, getMonthNumber(month), 1)
      }
    });
    
    if (!consumption) {
      return res.status(404).json({
        success: false,
        error: 'Aucune donnée blockchain trouvée pour cette période'
      });
    }
    
    const expectedAmount = consumption.consumptionKwh * 1.2; // Tarif estimé
    const difference = eneoAmount - expectedAmount;
    const anomalyPercentage = (difference / eneoAmount) * 100;
    const isAnomaly = anomalyPercentage > 10;
    
    res.json({
      success: true,
      data: {
        blockchainConsumption: consumption.consumptionKwh,
        blockchainAmount: expectedAmount,
        eneoAmount,
        difference,
        anomalyPercentage: anomalyPercentage.toFixed(1),
        isAnomaly,
        status: isAnomaly ? 'anomaly' : 'normal'
      }
    });
    
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
};

function getMonthNumber(monthName) {
  const months = {
    'janvier': 1, 'février': 2, 'mars': 3, 'avril': 4,
    'mai': 5, 'juin': 6, 'juillet': 7, 'août': 8,
    'septembre': 9, 'octobre': 10, 'novembre': 11, 'décembre': 12
  };
  return months[monthName.toLowerCase()] || 1;
}