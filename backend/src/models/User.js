const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
    minlength: 6
    // REMOVED: select: false - this was hiding the password
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

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash if password is modified
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    // Ensure both are strings
    const candidate = String(candidatePassword);
    const hashed = String(this.password);
    return await bcrypt.compare(candidate, hashed);
  } catch (error) {
    console.error('Password comparison error:', error);
    return false;
  }
};

module.exports = mongoose.model('User', userSchema);