const mongoose = require('mongoose');

const servicePlanSchema = new mongoose.Schema({
  helperId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Helper',
    required: true
  },
  planType: {
    type: String,
    enum: ['hourly', 'monthly', 'yearly'],
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true
  },
  features: {
    type: [String],
    default: []
  },
  isActive: {
    type: Boolean,
    default: true
  },
  city: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ServicePlan', servicePlanSchema);