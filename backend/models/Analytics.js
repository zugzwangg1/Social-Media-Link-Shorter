const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  profileViews: {
    type: Number,
    default: 0,
    min: 0
  },
  lastViewedAt: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Analytics', analyticsSchema);
