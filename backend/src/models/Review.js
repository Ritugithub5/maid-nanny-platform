const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
    unique: true
  },
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
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    maxlength: 500
  },
  categories: {
    punctuality: { type: Number, min: 1, max: 5, default: 0 },
    professionalism: { type: Number, min: 1, max: 5, default: 0 },
    skills: { type: Number, min: 1, max: 5, default: 0 },
    communication: { type: Number, min: 1, max: 5, default: 0 }
  },
  isVisible: {
    type: Boolean,
    default: true
  },
  response: {
    type: String,
    maxlength: 500,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Review', reviewSchema);