const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  householdUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  helperId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Helper',
    required: true
  },
  servicePlanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServicePlan',
    required: false
  },
  serviceType: {
    type: String,
    enum: ['maid', 'babysitter', 'nanny'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'in_progress', 'completed', 'cancelled', 'rejected'],
    default: 'pending'
  },
  serviceDate: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0
  },
  specialInstructions: {
    type: String,
    maxlength: 500,
    default: ''
  },
  address: {
    street: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    pincode: { type: String, default: '' },
    landmark: { type: String, default: '' }
  },
  cancellationReason: {
    type: String,
    default: ''
  },
  cancelledBy: {
    type: String,
    enum: ['household', 'helper', 'admin', ''],
    default: ''
  },
  householdFeedback: {
    rating: { type: Number, min: 0, max: 5, default: 0 },
    comment: { type: String, default: '' }
  },
  helperFeedback: {
    rating: { type: Number, min: 0, max: 5, default: 0 },
    comment: { type: String, default: '' }
  }
}, {
  timestamps: true
});

bookingSchema.index({ householdUserId: 1, status: 1 });
bookingSchema.index({ helperId: 1, status: 1 });
bookingSchema.index({ serviceDate: 1 });

module.exports = mongoose.model('Booking', bookingSchema);