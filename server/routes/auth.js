const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// Helper — generate 6 digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// ─────────────────────────────────────────
// REGISTER — POST /api/auth/register
// ─────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash the password — never store plain text
    const hashedPassword = await bcrypt.hash(password, 10);
    // 10 is "salt rounds" — how many times it scrambles the password

    // Generate OTP and set expiry (10 mins from now)
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // Create user but not verified yet
    const user = new User({
      username,
      email,
      password: hashedPassword,
      isVerified: false,
      otp: {
        code: otp,
        expiresAt: otpExpiry
      }
    });

    await user.save();

    // Send OTP email
    await sendEmail(email, otp);

    res.status(201).json({
      message: 'Registration started! Check your email for OTP.',
      email // send back so frontend knows where OTP was sent
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ─────────────────────────────────────────
// VERIFY OTP — POST /api/auth/verify-otp
// ─────────────────────────────────────────
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if OTP matches
    if (user.otp.code !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Check if OTP expired
    if (user.otp.expiresAt < new Date()) {
      return res.status(400).json({ message: 'OTP expired. Please register again.' });
    }

    // Mark user as verified and clear OTP
    user.isVerified = true;
    user.otp = undefined;
    await user.save();

    // Generate JWT token so they're logged in immediately
    const token = jwt.sign(
      { userId: user._id },           // payload — what we store in token
      process.env.JWT_SECRET,          // secret key to sign it
      { expiresIn: '7d' }             // token lasts 7 days
    );

    res.json({
      message: 'Account verified successfully!',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ─────────────────────────────────────────
// LOGIN — POST /api/auth/login
// ─────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email' });
    }

    // Check if verified
    if (!user.isVerified) {
      return res.status(401).json({ message: 'Please verify your email first' });
    }

    // Compare password with hashed version
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Wrong password' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;