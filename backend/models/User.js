const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    lowercase: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
    match: [/^[a-z0-9_-]+$/, 'Username can only contain lowercase letters, numbers, hyphens and underscores']
  },
  password: {
    type: String,
    minlength: [6, 'Password must be at least 6 characters']
  },
  name: {
    type: String,
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  bio: {
    type: String,
    trim: true,
    maxlength: [200, 'Bio cannot exceed 200 characters']
  },
  profilePicture: {
    type: String,
    default: ''
  },
  themeColor: {
    type: String,
    default: '#6B46C1',
    match: [/^#[0-9A-Fa-f]{6}$/, 'Please provide a valid hex color']
  },
  oauthProvider: {
    type: String,
    enum: ['local', 'google', 'microsoft'],
    default: 'local'
  },
  oauthId: {
    type: String,
    sparse: true
  },
  failedLoginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ oauthId: 1 });

// Virtual for checking if account is locked
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

module.exports = mongoose.model('User', userSchema);
