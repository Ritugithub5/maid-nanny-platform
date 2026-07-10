const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
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
  type: {
    type: String,
    enum: ['sick', 'casual', 'annual', 'emergency', 'other'],
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled'],
    default: 'pending'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  approvedAt: {
    type: Date,
    default: null
  },
  rejectionReason: {
    type: String,
    default: ''
  },
  documents: {
    type: [String],
    default: []
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

leaveSchema.index({ helperId: 1, startDate: 1, endDate: 1 });
leaveSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('Leave', leaveSchema);