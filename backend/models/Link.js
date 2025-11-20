const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: [true, 'Link title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  url: {
    type: String,
    required: [true, 'URL is required'],
    trim: true,
    validate: {
      validator: function(v) {
        // Basic URL validation
        try {
          new URL(v);
          return true;
        } catch (e) {
          return false;
        }
      },
      message: 'Please provide a valid URL'
    }
  },
  position: {
    type: Number,
    required: true,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  clicks: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

// Compound index for efficient querying
linkSchema.index({ userId: 1, position: 1 });

module.exports = mongoose.model('Link', linkSchema);
