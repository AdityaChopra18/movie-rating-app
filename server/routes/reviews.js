const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Movie = require('../models/Movie');
const User = require('../models/User');
const protect = require('../middleware/protect');

// ─────────────────────────────────────────
// Helper — recalculate movie average rating
// ─────────────────────────────────────────
const updateMovieRating = async (movieId) => {
  const reviews = await Review.find({ 
    movie: movieId, 
    isHidden: false 
  });

  if (reviews.length === 0) {
    await Movie.findByIdAndUpdate(movieId, {
      averageRating: 0,
      totalRatings: 0
    });
    return;
  }

  const total = reviews.reduce((sum, r) => sum + r.rating, 0);
  const average = (total / reviews.length).toFixed(1);

  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  reviews.forEach(r => distribution[r.rating]++);

  await Movie.findByIdAndUpdate(movieId, {
    averageRating: average,
    totalRatings: reviews.length,
    ratingDistribution: distribution
  });
};

// ─────────────────────────────────────────
// Anti-bombing check
// ─────────────────────────────────────────
const checkReviewBombing = async (movieId) => {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

  const recentReviews = await Review.find({
    movie: movieId,
    createdAt: { $gte: oneHourAgo }
  });

  if (recentReviews.length >= 20) {
    const avgRecent = recentReviews.reduce((sum, r) => sum + r.rating, 0) / recentReviews.length;
    
    if (avgRecent < 1.5) {
      await Movie.findByIdAndUpdate(movieId, { isFlaggedForBombing: true });
      
      await Review.updateMany(
        { movie: movieId, createdAt: { $gte: oneHourAgo } },
        { isHidden: true, flagReason: 'Suspected review bombing' }
      );

      return true;
    }
  }
  return false;
};

// ─────────────────────────────────────────
// POST REVIEW — POST /api/reviews/:imdbId
// ─────────────────────────────────────────
router.post('/:imdbId', protect, async (req, res) => {
  try {
    const { rating, reviewText } = req.body;
    const { imdbId } = req.params;

    // ── Anti-bombing Check 1: Account age (1 hour) ──
    // const accountAge = Date.now() - new Date(req.user.createdAt).getTime();
    // const hoursOld = accountAge / (1000 * 60 * 60);
    
    // if (hoursOld < 1) {
    //   return res.status(403).json({ 
    //     message: 'Your account must be at least 1 hour old to post reviews' 
    //   });
    // }

    // ── Anti-bombing Check 2: Daily review limit (10/day) ──
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const reviewsToday = await Review.countDocuments({
      user: req.user._id,
      createdAt: { $gte: today }
    });

    if (reviewsToday >= 10) {
      return res.status(403).json({ 
        message: 'You can only post 10 reviews per day' 
      });
    }

    // Find the movie in our DB
    const movie = await Movie.findOne({ tmdbId: imdbId });
    if (!movie) {
      return res.status(404).json({ 
        message: 'Movie not found. Fetch it first via /api/movies/:imdbId' 
      });
    }

    // Check if user already reviewed this movie
    const existingReview = await Review.findOne({
      movie: movie._id,
      user: req.user._id
    });

    if (existingReview) {
      return res.status(400).json({ 
        message: 'You have already reviewed this movie' 
      });
    }

    // Create review
    const review = new Review({
      movie: movie._id,
      user: req.user._id,
      rating,
      reviewText
    });

    await review.save();

    // Recalculate movie average
    await updateMovieRating(movie._id);

    // Check for review bombing
    const bombingDetected = await checkReviewBombing(movie._id);

    res.status(201).json({
      message: bombingDetected 
        ? 'Review submitted but is under review due to unusual activity' 
        : 'Review posted successfully!',
      review
    });

  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'You already reviewed this movie' });
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ─────────────────────────────────────────
// GET REVIEWS — GET /api/reviews/:imdbId
// No login needed
// ─────────────────────────────────────────
router.get('/:imdbId', async (req, res) => {
  try {
    const { imdbId } = req.params;

    const movie = await Movie.findOne({ tmdbId: imdbId });
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    const reviews = await Review.find({ 
      movie: movie._id,
      isHidden: false
    })
    .populate('user', 'username')
    .sort({ createdAt: -1 });

    res.json({
      movie: movie.title,
      averageRating: movie.averageRating,
      totalRatings: movie.totalRatings,
      isFlagged: movie.isFlaggedForBombing,
      reviews
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ─────────────────────────────────────────
// DELETE REVIEW — DELETE /api/reviews/:id
// ─────────────────────────────────────────
router.delete('/:id', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await review.deleteOne();
    await updateMovieRating(review.movie);

    res.json({ message: 'Review deleted successfully' });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;