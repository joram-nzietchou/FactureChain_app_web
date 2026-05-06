const mongoose = require('mongoose');

const consumptionSchema = new mongoose.Schema({
  subscriberNumber: {
    type: String,
    required: true,
    index: true
  },
  date: {
    type: Date,
    required: true
  },
  consumptionKwh: {
    type: Number,
    required: true
  },
  eneoAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['normal', 'anomaly', 'disputed', 'resolved'],
    default: 'normal'
  },
  transactionHash: {
    type: String,
    default: null
  },
  isVerified: {
    type: Boolean,
    default: false
  }
});

consumptionSchema.index({ subscriberNumber: 1, date: -1 });

module.exports = mongoose.model('Consumption', consumptionSchema);