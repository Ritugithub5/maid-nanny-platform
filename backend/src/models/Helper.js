const mongoose = require('mongoose');

const helperSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  fullName: {
    type: String,
    required: true
  },
  profilePic: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    maxlength: 500,
    default: ''
  },
  serviceType: {
    type: [String],
    enum: ['maid', 'babysitter', 'nanny'],
    default: []
  },
  yearsOfExperience: {
    type: Number,
    min: 0,
    default: 0
  },
  skills: {
    type: [String],
    default: []
  },
  languages: {
    type: [String],
    default: []
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  
  // ============ DOCUMENT UPLOAD FIELDS ============
  verificationDocuments: {
    // Document URLs (stored as strings)
    idProof: { 
      type: String, 
      default: '' 
    },
    addressProof: { 
      type: String, 
      default: '' 
    },
    backgroundCheck: { 
      type: String, 
      default: '' 
    },
    certificates: { 
      type: [String], 
      default: [] 
    },
    
    // Document status tracking
    idProofStatus: { 
      type: String, 
      enum: ['pending', 'uploaded', 'verified', 'rejected'],
      default: 'pending' 
    },
    addressProofStatus: { 
      type: String, 
      enum: ['pending', 'uploaded', 'verified', 'rejected'],
      default: 'pending' 
    },
    backgroundCheckStatus: { 
      type: String, 
      enum: ['pending', 'uploaded', 'verified', 'rejected'],
      default: 'pending' 
    },
    
    // Upload timestamps
    idProofUploadedAt: { 
      type: Date 
    },
    addressProofUploadedAt: { 
      type: Date 
    },
    backgroundCheckUploadedAt: { 
      type: Date 
    },
    
    // Verification timestamps
    idProofVerifiedAt: { 
      type: Date 
    },
    addressProofVerifiedAt: { 
      type: Date 
    },
    backgroundCheckVerifiedAt: { 
      type: Date 
    },
    
    // Rejection reasons
    idProofRejectionReason: { 
      type: String, 
      default: '' 
    },
    addressProofRejectionReason: { 
      type: String, 
      default: '' 
    },
    backgroundCheckRejectionReason: { 
      type: String, 
      default: '' 
    }
  },
  
  // ============ AVAILABILITY ============
  availability: {
    isAvailable: { 
      type: Boolean, 
      default: true 
    },
    workingDays: {
      type: [String],
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    workingHours: {
      start: { 
        type: String, 
        default: '09:00' 
      },
      end: { 
        type: String, 
        default: '18:00' 
      }
    }
  },
  
  // ============ RATINGS ============
  rating: {
    average: { 
      type: Number, 
      default: 0, 
      min: 0, 
      max: 5 
    },
    count: { 
      type: Number, 
      default: 0 
    },
    // Individual rating breakdowns (calculated from reviews)
    punctuality: { 
      type: Number, 
      default: 0, 
      min: 0, 
      max: 5 
    },
    professionalism: { 
      type: Number, 
      default: 0, 
      min: 0, 
      max: 5 
    },
    skills: { 
      type: Number, 
      default: 0, 
      min: 0, 
      max: 5 
    },
    communication: { 
      type: Number, 
      default: 0, 
      min: 0, 
      max: 5 
    }
  },
  
  // ============ STATS ============
  totalJobsCompleted: {
    type: Number,
    default: 0
  },
  totalEarnings: {
    type: Number,
    default: 0
  },
  reliabilityScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  responseTime: {
    type: Number, // in minutes
    default: 0
  },
  
  // ============ LOCATION ============
  preferredCities: {
    type: [String],
    default: []
  },
  currentCity: {
    type: String,
    default: ''
  },
  
  // ============ STATUS ============
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  joinedDate: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// ============ INDEXES FOR PERFORMANCE ============
helperSchema.index({ serviceType: 1, 'availability.isAvailable': 1 });
helperSchema.index({ rating: -1 });
helperSchema.index({ verificationStatus: 1 });
helperSchema.index({ isActive: 1 });
helperSchema.index({ 'verificationDocuments.idProofStatus': 1 });
helperSchema.index({ fullName: 'text', skills: 'text', bio: 'text' });

// ============ VIRTUAL FIELDS ============
helperSchema.virtual('isDocumentComplete').get(function() {
  return this.verificationDocuments.idProofStatus === 'verified' &&
         this.verificationDocuments.addressProofStatus === 'verified' &&
         this.verificationDocuments.backgroundCheckStatus === 'verified';
});

helperSchema.virtual('documentProgress').get(function() {
  const total = 3;
  let completed = 0;
  if (this.verificationDocuments.idProofStatus === 'verified') completed++;
  if (this.verificationDocuments.addressProofStatus === 'verified') completed++;
  if (this.verificationDocuments.backgroundCheckStatus === 'verified') completed++;
  return Math.round((completed / total) * 100);
});

// ============ METHODS ============
helperSchema.methods.updateRating = async function() {
  const Review = mongoose.model('Review');
  const reviews = await Review.find({ 
    helperId: this._id, 
    isVisible: true 
  });
  
  if (reviews.length === 0) {
    this.rating.average = 0;
    this.rating.count = 0;
    this.rating.punctuality = 0;
    this.rating.professionalism = 0;
    this.rating.skills = 0;
    this.rating.communication = 0;
  } else {
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    this.rating.average = totalRating / reviews.length;
    this.rating.count = reviews.length;
    
    // Calculate category averages
    const categories = ['punctuality', 'professionalism', 'skills', 'communication'];
    categories.forEach(cat => {
      const sum = reviews.reduce((s, r) => s + (r.categories?.[cat] || 0), 0);
      this.rating[cat] = sum / reviews.length;
    });
  }
  
  await this.save();
  return this;
};

helperSchema.methods.updateReliabilityScore = async function() {
  // Calculate based on completed jobs, cancellations, and response time
  const Booking = mongoose.model('Booking');
  const totalBookings = await Booking.countDocuments({ helperId: this._id });
  const completedBookings = await Booking.countDocuments({ 
    helperId: this._id, 
    status: 'completed' 
  });
  const cancelledBookings = await Booking.countDocuments({ 
    helperId: this._id, 
    status: 'cancelled' 
  });
  const rejectedBookings = await Booking.countDocuments({ 
    helperId: this._id, 
    status: 'rejected' 
  });
  
  let score = 100;
  if (totalBookings > 0) {
    // Completion rate
    const completionRate = completedBookings / totalBookings;
    score = completionRate * 100;
    
    // Penalty for cancellations
    score -= (cancelledBookings / totalBookings) * 20;
    score -= (rejectedBookings / totalBookings) * 15;
  }
  
  this.reliabilityScore = Math.max(0, Math.min(100, Math.round(score)));
  await this.save();
  return this;
};

// ============ TO JSON ============
helperSchema.set('toJSON', { virtuals: true });
helperSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Helper', helperSchema);