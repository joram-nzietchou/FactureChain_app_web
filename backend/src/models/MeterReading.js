const mongoose = require('mongoose');

const meterReadingSchema = new mongoose.Schema({
  subscriberNumber: {
    type: String,
    required: true,
    index: true
  },
  readingDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  month: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  previousIndex: {
    type: Number,
    required: true
  },
  currentIndex: {
    type: Number,
    required: true
  },
  consumption: {
    type: Number,
    required: true
  },
  calculatedAmount: {
    type: Number,
    required: true
  },
  blockchainHash: {
    type: String,
    default: null
  },
  blockchainReadingId: {
    type: String,
    default: null
  },
  isVerified: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('MeterReading', meterReadingSchema);