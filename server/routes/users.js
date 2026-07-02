const express = require('express');
const router = express.Router();
const protect = require('../middleware/protect');
const User = require('../models/User');
const Review = require('../models/Review');
const Movie = require('../models/Movie');

const updateMovieRating = async (movieId) => {
  const reviews = await Review.find({ movie: movieId, isHidden: false });
  if (reviews.length === 0) {
    await Movie.findByIdAndUpdate(movieId, { averageRating: 0, totalRatings: 0 });
    return;
  }
  const total = reviews.reduce((sum, r) => sum + r.rating, 0);
  const average = (total / reviews.length).toFixed(1);
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  reviews.forEach(r => distribution[r.rating]++);
  await Movie.findByIdAndUpdate(movieId, { averageRating: average, totalRatings: reviews.length, ratingDistribution: distribution });
};

// GET /api/users/me/dashboard
router.get('/me/dashboard', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('watchlist')
      .populate('favorites');
    const totalReviews = await Review.countDocuments({ user: req.user._id });
    
    const recentReviews = await Review.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('movie', 'title tmdbId');

    res.json({ user, stats: { totalReviews }, recentReviews });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/users/profile/:username
router.get('/profile/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select('-password -email -otp -isVerified')
      .populate('watchlist')
      .populate('favorites');
      
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
      
    const totalReviews = await Review.countDocuments({ user: user._id });
    
    const recentReviews = await Review.find({ user: user._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('movie', 'title tmdbId');

    res.json({ user, stats: { totalReviews }, recentReviews });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/users/me/watchlist/:movieId
router.post('/me/watchlist/:movieId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const movieId = req.params.movieId;
    
    const index = user.watchlist.indexOf(movieId);
    let isWatchlisted = false;
    if (index === -1) {
      user.watchlist.push(movieId);
      isWatchlisted = true;
    } else {
      user.watchlist.splice(index, 1);
    }
    await user.save();
    res.json({ isWatchlisted, message: isWatchlisted ? 'Added to watchlist' : 'Removed from watchlist' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/users/me/favorites/:movieId
router.post('/me/favorites/:movieId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const movieId = req.params.movieId;
    
    const index = user.favorites.indexOf(movieId);
    let isFavorited = false;
    if (index === -1) {
      user.favorites.push(movieId);
      isFavorited = true;
    } else {
      user.favorites.splice(index, 1);
    }
    await user.save();
    res.json({ isFavorited, message: isFavorited ? 'Added to favorites' : 'Removed from favorites' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/users/me
router.delete('/me', protect, async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id });
    const movieIds = [...new Set(reviews.map(r => r.movie.toString()))];
    
    await Review.deleteMany({ user: req.user._id });
    
    for (const movieId of movieIds) {
      await updateMovieRating(movieId);
    }
    
    await User.findByIdAndDelete(req.user._id);
    
    res.json({ message: 'Account and all associated data deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
