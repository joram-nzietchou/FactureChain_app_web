const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
  claimNumber: {
    type: String,
    required: true,
    unique: true
  },
  blockchainHash: {           // ← NOUVEAU
    type: String,
    default: null
  },
  blockchainClaimId: {        // ← NOUVEAU
    type: String,
    default: null
  },
  subscriberNumber: {
    type: String,
    required: true,
    index: true
  },
  month: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  blockchainConsumption: {
    type: Number,
    required: true
  },
  eneoAmount: {
    type: Number,
    required: true
  },
  difference: {
    type: Number,
    required: true
  },
  anomalyPercentage: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  blockchainHash: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['submitted', 'transmitted', 'investigating', 'resolved', 'rejected'],
    default: 'submitted'
  },
  timeline: [{
    step: String,
    description: String,
    date: Date,
    isCompleted: Boolean,
    transactionHash: String
  }],
  resolutionNote: String,
  resolvedAt: Date,
  attachments: [{
    filename: String,
    url: String,
    uploadedAt: Date
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

claimSchema.index({ subscriberNumber: 1, createdAt: -1 });
claimSchema.index({ claimNumber: 1 });
claimSchema.index({ status: 1 });

module.exports = mongoose.model('Claim', claimSchema);