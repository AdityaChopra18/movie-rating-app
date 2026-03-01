const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false      // becomes true after OTP verification
  },
  otp: {
    code: String,       // the 6-digit OTP
    expiresAt: Date     // OTP expires after 10 minutes
  },
  createdAt: {
    type: Date,
    default: Date.now   // we use this for anti-bombing (account age check)
  },
  reviewCount: {
    type: Number,
    default: 0          // track how many reviews they've posted today
  },
  lastReviewDate: {
    type: Date          // used to reset daily review count
  }
});

module.exports = mongoose.model('User', userSchema);