// backend/src/controllers/profileController.js
const User = require('../models/User');
const MeterReading = require('../models/MeterReading');
const Claim = require('../models/Claim');

// Obtenir le profil utilisateur
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'Utilisateur non trouvé' });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Mettre à jour le profil utilisateur
exports.updateProfile = async (req, res) => {
  try {
    const { fullName, phone, city, district } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      { fullName, phone, city, district },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'Utilisateur non trouvé' });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Changer le mot de passe
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'Utilisateur non trouvé' });
    }
    
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Mot de passe actuel incorrect' });
    }
    
    user.password = newPassword;
    await user.save();
    
    res.json({ success: true, message: 'Mot de passe modifié avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Obtenir les statistiques utilisateur (VRAIES DONNÉES)
exports.getUserStats = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'Utilisateur non trouvé' });
    }
    
    // Récupérer tous les relevés de l'utilisateur
    const readings = await MeterReading.find({ subscriberNumber: user.subscriberNumber });
    const claims = await Claim.find({ subscriberNumber: user.subscriberNumber });
    
    // Calculer les vraies statistiques
    const totalReadings = readings.length;
    const totalClaims = claims.length;
    
    // Consommation totale
    const totalConsumption = readings.reduce((sum, r) => sum + (r.consumption || 0), 0);
    
    // Montant total des factures
    const totalAmount = readings.reduce((sum, r) => sum + (r.calculatedAmount || 0), 0);
    
    // Compter les anomalies (différence > 500 FCFA)
    let anomalyCount = 0;
    for (const reading of readings) {
      const expectedAmount = (reading.consumption || 0) * 1.2;
      if ((reading.calculatedAmount || 0) - expectedAmount > 500) {
        anomalyCount++;
      }
    }
    
    // Réclamations résolues
    const resolvedClaims = claims.filter(c => c.status === 'resolved').length;
    
    // Moyennes
    const averageConsumption = totalReadings > 0 ? Math.round(totalConsumption / totalReadings) : 0;
    const averageBill = totalReadings > 0 ? Math.round(totalAmount / totalReadings) : 0;
    
    // Taux de résolution des réclamations
    const resolutionRate = totalClaims > 0 ? Math.round((resolvedClaims / totalClaims) * 100) : 0;
    
    // Dernier relevé
    const lastReading = readings.length > 0 ? readings[readings.length - 1] : null;
    
    res.json({
      success: true,
      data: {
        memberSince: user.createdAt,
        totalReadings,
        totalClaims,
        totalConsumption,
        totalAmount,
        anomalyCount,
        averageConsumption,
        averageBill,
        resolvedClaims,
        resolutionRate,
        lastReading: lastReading ? {
          date: lastReading.readingDate,
          consumption: lastReading.consumption,
          amount: lastReading.calculatedAmount,
          month: lastReading.month,
          year: lastReading.year
        } : null
      }
    });
  } catch (error) {
    console.error('Erreur getUserStats:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};