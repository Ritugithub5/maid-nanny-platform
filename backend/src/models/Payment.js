const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: false,
    default: null
  },
  householdUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    default: null
  },
  helperId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Helper',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'INR'
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'upi', 'netbanking', 'wallet', 'cash', 'bank_transfer'],
    default: 'card'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  transactionId: {
    type: String,
    default: ''
  },
  orderId: {
    type: String,
    default: ''
  },
  paymentId: {
    type: String,
    default: ''
  },
  signature: {
    type: String,
    default: ''
  },
  razorpay: {
    orderId: { type: String, default: '' },
    paymentId: { type: String, default: '' },
    signature: { type: String, default: '' }
  },
  isSalaryPayment: {
    type: Boolean,
    default: false
  },
  salaryPeriod: {
    type: String,
    enum: ['weekly', 'biweekly', 'monthly'],
    default: 'monthly'
  },
  salaryMonth: {
    type: String,
    default: ''
  },
  salaryYear: {
    type: String,
    default: ''
  },
  helperEarnings: {
    amount: { type: Number, default: 0 },
    platformFee: { type: Number, default: 0 },
    netAmount: { type: Number, default: 0 }
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  refund: {
    amount: { type: Number, default: 0 },
    reason: { type: String, default: '' },
    refundId: { type: String, default: '' },
    refundedAt: { type: Date }
  },
  paidAt: {
    type: Date
  },
  receipt: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

paymentSchema.index({ bookingId: 1 });
paymentSchema.index({ householdUserId: 1 });
paymentSchema.index({ helperId: 1 });
paymentSchema.index({ paymentStatus: 1 });
paymentSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Payment', paymentSchema);