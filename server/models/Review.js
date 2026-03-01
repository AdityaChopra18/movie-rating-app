const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  movie: {
    type: mongoose.Schema.Types.ObjectId,  // links to a Movie document
    ref: 'Movie',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,  // links to a User document
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  reviewText: {
    type: String,
    maxlength: 1000
  },
  isHidden: {
    type: Boolean,
    default: false    // hidden reviews don't count toward average
  },
  flagReason: {
    type: String      // why it was flagged e.g. "bombing detected"
  }
}, { timestamps: true });

// One user can only review a movie once
reviewSchema.index({ movie: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);