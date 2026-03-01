const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const Review = require('../models/Review');
const protect = require('../middleware/protect');

// ─────────────────────────────────────────
// TRENDING — GET /api/recommendations/trending
// Most reviewed movies in last 7 days
// No login needed
// ─────────────────────────────────────────
router.get('/trending', async (req, res) => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    // Find reviews from last 7 days and group by movie
    const trending = await Review.aggregate([
      { 
        $match: { 
          createdAt: { $gte: sevenDaysAgo },
          isHidden: false
        } 
      },
      { 
        $group: { 
          _id: '$movie',           // group by movie ID
          reviewCount: { $sum: 1 }, // count reviews per movie
          avgRating: { $avg: '$rating' }
        } 
      },
      { $sort: { reviewCount: -1 } }, // most reviewed first
      { $limit: 10 },
      {
        $lookup: {                  // like a JOIN — get movie details
          from: 'movies',
          localField: '_id',
          foreignField: '_id',
          as: 'movieDetails'
        }
      },
      { $unwind: '$movieDetails' } // flatten the array
    ]);

    res.json({
      message: 'Trending this week',
      movies: trending.map(t => ({
        ...t.movieDetails,
        weeklyReviews: t.reviewCount,
        weeklyAvgRating: t.avgRating.toFixed(1)
      }))
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ─────────────────────────────────────────
// GENRE BASED — GET /api/recommendations/genre/:imdbId
// "More like this movie"
// No login needed
// ─────────────────────────────────────────
router.get('/genre/:imdbId', async (req, res) => {
  try {
    const { imdbId } = req.params;

    // Find the source movie
    const sourceMovie = await Movie.findOne({ tmdbId: imdbId });
    if (!sourceMovie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Find movies that share at least one genre
    // $in means "where genre is IN this array"
    const similar = await Movie.find({
      tmdbId: { $ne: imdbId },        // exclude the source movie itself
      genre: { $in: sourceMovie.genre }, // must share at least one genre
      averageRating: { $gte: 3 },     // only decent rated movies
      isFlaggedForBombing: false       // exclude flagged movies
    })
    .sort({ averageRating: -1 })      // highest rated first
    .limit(10);

    res.json({
      basedOn: sourceMovie.title,
      genres: sourceMovie.genre,
      recommendations: similar
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ─────────────────────────────────────────
// PERSONALIZED — GET /api/recommendations/foryou
// Based on user's own rating history
// Login required
// ─────────────────────────────────────────
router.get('/foryou', protect, async (req, res) => {
  try {
    // Find movies this user rated 4 or 5 stars
    const highRatedReviews = await Review.find({
      user: req.user._id,
      rating: { $gte: 4 }
    }).populate('movie');

    if (highRatedReviews.length === 0) {
      // New user with no history — return top rated movies instead
      const topMovies = await Movie.find({
        averageRating: { $gte: 3 },
        isFlaggedForBombing: false
      })
      .sort({ averageRating: -1 })
      .limit(10);

      return res.json({
        message: 'Top rated movies (rate more movies for personalized picks!)',
        recommendations: topMovies
      });
    }

    // Build user taste profile — count genre appearances
    const genreCount = {};
    highRatedReviews.forEach(review => {
      if (review.movie && review.movie.genre) {
        review.movie.genre.forEach(g => {
          genreCount[g] = (genreCount[g] || 0) + 1;
        });
      }
    });

    // Sort genres by how much user likes them
    const favouriteGenres = Object.entries(genreCount)
      .sort((a, b) => b[1] - a[1])  // most frequent first
      .slice(0, 3)                    // top 3 genres
      .map(entry => entry[0]);        // just the genre name

    // Get IDs of movies user already reviewed
    const reviewedMovieIds = highRatedReviews.map(r => r.movie._id);

    // Find movies matching favourite genres that user hasn't reviewed yet
    const recommendations = await Movie.find({
      _id: { $nin: reviewedMovieIds },      // not already reviewed
      genre: { $in: favouriteGenres },       // matches their taste
      averageRating: { $gte: 3 },            // decent rating
      isFlaggedForBombing: false
    })
    .sort({ averageRating: -1 })
    .limit(10);

    res.json({
      message: 'Picked for you',
      favouriteGenres,
      recommendations
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ─────────────────────────────────────────
// TOP RATED — GET /api/recommendations/toprated
// All time highest rated movies in our DB
// No login needed
// ─────────────────────────────────────────
router.get('/toprated', async (req, res) => {
  try {
    const topRated = await Movie.find({
      totalRatings: { $gte: 1 },        // must have at least 1 rating
      isFlaggedForBombing: false
    })
    .sort({ averageRating: -1 })
    .limit(10);

    res.json({
      message: 'All time top rated',
      movies: topRated
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;