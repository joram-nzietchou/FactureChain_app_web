const Claim = require('../models/Claim');
const { generateClaimNumber } = require('../utils/generateId');
const blockchainService = require('../services/blockchainService');

// Créer une réclamation
exports.createClaim = async (req, res) => {
  try {
    const {
      subscriberNumber,
      month,
      year,
      blockchainConsumption,
      eneoAmount,
      description
    } = req.body;

    const difference = eneoAmount - (blockchainConsumption * 1.2);
    const anomalyPercentage = (difference / eneoAmount * 100).toFixed(1);
    const claimNumber = generateClaimNumber();
    
    // 🔗 Enregistrer la preuve sur la blockchain
    const cidPreuve = `claim_${Date.now()}_${subscriberNumber}`;
    const montantConteste = Math.abs(Math.round(difference));
    
    // Utiliser storeReading au lieu de creerReclamation
    const blockchainResult = await blockchainService.storeReading(
      subscriberNumber,
      0,  // previousIndex (non utilisé pour les réclamations)
      montantConteste  // currentIndex (utilisé comme montant)
    );
    
    if (!blockchainResult.success) {
      return res.status(500).json({
        success: false,
        error: `Erreur blockchain: ${blockchainResult.error}`
      });
    }
    
    const claim = await Claim.create({
      claimNumber,
      subscriberNumber,
      month,
      year,
      blockchainConsumption,
      eneoAmount,
      difference,
      anomalyPercentage,
      description,
      blockchainHash: blockchainResult.transactionHash,
      blockchainClaimId: blockchainResult.readingId,
      status: 'submitted',
      timeline: [{
        step: 'Soumis',
        description: `Réclamation enregistrée sur la blockchain - Hash: ${blockchainResult.transactionHash.substring(0, 16)}...`,
        date: new Date(),
        isCompleted: true,
        transactionHash: blockchainResult.transactionHash
      }]
    });

    res.status(201).json({
      success: true,
      data: {
        claim,
        blockchain: {
          transactionHash: blockchainResult.transactionHash,
          claimId: blockchainResult.readingId,
          blockNumber: blockchainResult.blockNumber
        }
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Récupérer toutes les réclamations d'un utilisateur
exports.getUserClaims = async (req, res) => {
  try {
    const { subscriberNumber } = req.user;
    const { page = 1, limit = 10, status } = req.query;
    
    const query = { subscriberNumber };
    if (status) query.status = status;
    
    const claims = await Claim.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Claim.countDocuments(query);
    
    res.json({
      success: true,
      data: {
        claims,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });
    
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Récupérer une réclamation par ID
exports.getClaimById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const claim = await Claim.findOne({ claimNumber: id });
    if (!claim) {
      return res.status(404).json({ 
        success: false, 
        error: 'Réclamation non trouvée' 
      });
    }
    
    res.json({
      success: true,
      data: claim
    });
    
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Mettre à jour le statut d'une réclamation (admin)
exports.updateClaimStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, resolutionNote } = req.body;
    
    const claim = await Claim.findOne({ claimNumber: id });
    if (!claim) {
      return res.status(404).json({ 
        success: false, 
        error: 'Réclamation non trouvée' 
      });
    }
    
    claim.status = status;
    if (resolutionNote) claim.resolutionNote = resolutionNote;
    if (status === 'resolved') claim.resolvedAt = new Date();
    
    claim.timeline.push({
      step: status,
      description: getStatusDescription(status),
      date: new Date(),
      isCompleted: status === 'resolved'
    });
    
    await claim.save();
    
    res.json({
      success: true,
      data: claim
    });
    
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Statistiques des réclamations
exports.getClaimStats = async (req, res) => {
  try {
    const { subscriberNumber } = req.user;
    
    const total = await Claim.countDocuments({ subscriberNumber });
    const resolved = await Claim.countDocuments({ 
      subscriberNumber, 
      status: 'resolved' 
    });
    const pending = await Claim.countDocuments({ 
      subscriberNumber, 
      status: { $nin: ['resolved', 'rejected'] } 
    });
    
    res.json({
      success: true,
      data: {
        total,
        resolved,
        pending,
        rate: total > 0 ? (resolved / total * 100).toFixed(1) : 0
      }
    });
    
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

function getStatusDescription(status) {
  const descriptions = {
    transmitted: 'Transmise à ENEO',
    investigating: 'En cours d\'investigation',
    resolved: 'Réclamation résolue',
    rejected: 'Réclamation rejetée'
  };
  return descriptions[status] || 'Statut mis à jour';
}