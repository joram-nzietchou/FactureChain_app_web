const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const emailService = require('../services/emailService');
const { getRedis } = require('../config/redis');
require('dotenv').config();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Inscription
exports.register = async (req, res) => {
  try {
    const { fullName, email, password, subscriberNumber, phone, city, district } = req.body;
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ $or: [{ email }, { subscriberNumber }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Email ou numéro abonné déjà utilisé'
      });
    }
    
    // Créer l'utilisateur
    const user = await User.create({
      fullName,
      email,
      password,
      subscriberNumber,
      phone,
      city: city || 'Yaoundé',
      district: district || 'Mvog-Mbi',
      verificationToken: crypto.randomBytes(32).toString('hex')
    });
    
    // Envoyer email de vérification
    await emailService.sendVerificationEmail(email, user.verificationToken);
    
    const token = generateToken(user._id);
    
    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          subscriberNumber: user.subscriberNumber,
          role: user.role,
          city: user.city,
          district: user.district
        }
      }
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
};

// Connexion
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        error: 'Email ou mot de passe incorrect' 
      });
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        error: 'Email ou mot de passe incorrect' 
      });
    }
    
    // Mettre à jour dernière connexion
    user.lastLogin = new Date();
    await user.save();
    
    const token = generateToken(user._id);
    
    // Mettre en cache Redis
    const redis = getRedis();
    if (redis) {
      await redis.setex(`user:${user._id}`, 3600, JSON.stringify({
        id: user._id,
        email: user.email,
        role: user.role
      }));
    }
    
    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          subscriberNumber: user.subscriberNumber,
          role: user.role,
          city: user.city,
          district: user.district,
          isVerified: user.isVerified
        }
      }
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
};

// Vérification email
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        error: 'Token invalide ou expiré' 
      });
    }
    
    user.isVerified = true;
    user.verificationToken = null;
    await user.save();
    
    res.json({ success: true, message: 'Email vérifié avec succès' });
    
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
};

// Mot de passe oublié
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'Utilisateur non trouvé' 
      });
    }
    
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 heure
    await user.save();
    
    await emailService.sendResetPasswordEmail(email, resetToken);
    
    res.json({ success: true, message: 'Email de réinitialisation envoyé' });
    
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
};

// Réinitialisation mot de passe
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        error: 'Token invalide ou expiré' 
      });
    }
    
    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();
    
    res.json({ success: true, message: 'Mot de passe réinitialisé avec succès' });
    
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
};

// Obtenir profil
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    
    res.json({
      success: true,
      data: user
    });
    
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
};

// Mettre à jour profil
exports.updateProfile = async (req, res) => {
  try {
    const { fullName, phone, city, district } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      { fullName, phone, city, district },
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json({
      success: true,
      data: user
    });
    
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
};

// Déconnexion
exports.logout = async (req, res) => {
  try {
    const redis = getRedis();
    if (redis) {
      await redis.del(`user:${req.userId}`);
    }
    
    res.json({ success: true, message: 'Déconnecté avec succès' });
    
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
};