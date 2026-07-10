const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema({
  helperId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Helper',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  period: {
    type: String,
    enum: ['weekly', 'biweekly', 'monthly'],
    default: 'monthly'
  },
  month: {
    type: String,
    required: true
  },
  year: {
    type: String,
    required: true
  },
  // Earnings breakdown
  bookings: [{
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking'
    },
    amount: { type: Number, default: 0 },
    date: { type: Date },
    serviceType: { type: String }
  }],
  totalEarnings: {
    type: Number,
    default: 0
  },
  platformFee: {
    type: Number,
    default: 0
  },
  netPayable: {
    type: Number,
    default: 0
  },
  // Payment status
  status: {
    type: String,
    enum: ['pending', 'processing', 'paid', 'failed'],
    default: 'pending'
  },
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
    default: null
  },
  paidAt: {
    type: Date
  },
  notes: {
    type: String,
    default: ''
  },
  // Tax and deductions
  tax: {
    type: Number,
    default: 0
  },
  deductions: {
    type: Number,
    default: 0
  },
  bonuses: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

salarySchema.index({ userId: 1, month: 1, year: 1 });
salarySchema.index({ helperId: 1 });

module.exports = mongoose.model('Salary', salarySchema);