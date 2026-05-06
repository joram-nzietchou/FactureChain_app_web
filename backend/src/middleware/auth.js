const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        error: 'Accès non autorisé. Token manquant.' 
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        error: 'Utilisateur non trouvé.' 
      });
    }
    
    req.user = user;
    req.userId = user._id;
    next();
    
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      error: 'Token invalide ou expiré.' 
    });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      error: 'Accès refusé. Droits administrateur requis.' 
    });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware };