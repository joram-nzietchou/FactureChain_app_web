const Consumption = require('../models/Consumption');
const MeterReading = require('../models/MeterReading');
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
    
    res.json({
      success: true,
      data: {
        currentConsumption: lastConsumption,
        history,
        zoneStats: {
          activeClaims: 47,
          overcharges: 28,
          readingErrors: 12,
          resolutions: 35
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

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
    
    res.json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Obtenir l'historique complet des factures (NOUVEAU)
exports.getBillHistory = async (req, res) => {
  try {
    const { subscriberNumber } = req.user;
    
    const readings = await MeterReading.find({ subscriberNumber })
      .sort({ readingDate: -1 });
    
    const bills = readings.map(reading => ({
      id: reading._id,
      period: `${reading.month} ${reading.year}`,
      date: reading.readingDate,
      consumption: reading.consumption,
      eneoAmount: reading.calculatedAmount,
      expectedAmount: Math.round(reading.consumption * 1.2),
      difference: Math.round(reading.calculatedAmount - (reading.consumption * 1.2)),
      isAnomaly: (reading.calculatedAmount - (reading.consumption * 1.2)) > 500,
      blockchainHash: reading.blockchainHash
    }));
    
    res.json({
      success: true,
      data: { bills, total: bills.length }
    });
  } catch (error) {
    console.error('Erreur getBillHistory:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Obtenir les statistiques des factures (NOUVEAU)
exports.getBillStats = async (req, res) => {
  try {
    const { subscriberNumber } = req.user;
    
    const readings = await MeterReading.find({ subscriberNumber });
    
    const totalBills = readings.length;
    const totalAmount = readings.reduce((sum, r) => sum + r.calculatedAmount, 0);
    const totalConsumption = readings.reduce((sum, r) => sum + r.consumption, 0);
    
    let anomalyCount = 0;
    for (const reading of readings) {
      const difference = reading.calculatedAmount - (reading.consumption * 1.2);
      if (difference > 500) anomalyCount++;
    }
    
    res.json({
      success: true,
      data: {
        totalBills,
        totalAmount,
        totalConsumption,
        anomalyCount,
        anomalyRate: totalBills > 0 ? (anomalyCount / totalBills * 100).toFixed(1) : 0,
        averageAmount: totalBills > 0 ? Math.round(totalAmount / totalBills) : 0,
        averageConsumption: totalBills > 0 ? Math.round(totalConsumption / totalBills) : 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Vérifier une facture
exports.verifyBill = async (req, res) => {
  try {
    const { subscriberNumber } = req.user;
    const { month, year, eneoAmount } = req.body;
    
    // Trouver le relevé correspondant
    const reading = await MeterReading.findOne({
      subscriberNumber,
      month,
      year
    });
    
    if (!reading) {
      return res.status(404).json({
        success: false,
        error: 'Aucun relevé trouvé pour cette période'
      });
    }
    
    const expectedAmount = reading.consumption * 1.2;
    const difference = eneoAmount - expectedAmount;
    const anomalyPercentage = (difference / eneoAmount) * 100;
    const isAnomaly = difference > 500;
    
    res.json({
      success: true,
      data: {
        blockchainConsumption: reading.consumption,
        blockchainAmount: Math.round(expectedAmount),
        eneoAmount,
        difference: Math.round(difference),
        anomalyPercentage: anomalyPercentage.toFixed(1),
        isAnomaly,
        status: isAnomaly ? 'anomaly' : 'normal'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};