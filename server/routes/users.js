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
    const user = await User.findById(req.user._id).select('-password');
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
