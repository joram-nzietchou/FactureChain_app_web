const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const connectDB = require('./config/database');
const blockchainService = require('./services/blockchainService');
const authRoutes = require('./routes/authRoutes');
const claimRoutes = require('./routes/claimRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const errorHandler = require('./middleware/errorHandler');
const blockchainRoutes = require('./routes/blockchainRoutes');
const profileRoutes = require('./routes/profileRoutes');
const meterRoutes = require('./routes/meterRoutes');
const app = express();

// Connexion base de données
connectDB();

// Initialisation blockchain
blockchainService.init().then(success => {
  if (success) {
    console.log('🔗 Blockchain prête');
  } else {
    console.warn('⚠️ Blockchain non disponible (mode dégradé)');
  }
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Trop de requêtes, veuillez réessayer plus tard.'
});
app.use('/api', limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/claims', claimRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/blockchain', blockchainRoutes);
app.use('/api/meter', meterRoutes);
app.use('/api/profile', profileRoutes);
// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handler
app.use(errorHandler);

module.exports = app;