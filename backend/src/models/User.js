const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['household', 'helper', 'admin'],
    default: 'household'
  },
  phone: {
    type: String,
    required: [true, 'Please provide a phone number']
  },
  profilePicture: {
    type: String,
    default: 'default-avatar.png'
  },
  
  // ============ HOUSEHOLD PROFILE FIELDS ============
  householdProfile: {
    familyName: { type: String, default: '' },
    familyMembers: { type: Number, default: 0 },
    children: { type: Number, default: 0 },
    childrenAges: { type: [Number], default: [] },
    pets: { type: Boolean, default: false },
    petDetails: { type: String, default: '' },
    specialRequirements: { type: String, default: '' },
    preferredLanguage: { type: String, default: 'English' },
    aboutFamily: { type: String, default: '' }
  },
  
  address: {
    street: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    pincode: { type: String, default: '' },
    country: { type: String, default: 'India' },
    landmark: { type: String, default: '' }
  },
  
  // Household preferences
  preferences: {
    preferredServiceType: { type: [String], default: [] },
    preferredLanguage: { type: String, default: '' },
    budgetRange: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 0 }
    },
    preferredDays: { type: [String], default: [] },
    preferredTiming: { type: String, default: '' }
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  isProfileComplete: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);