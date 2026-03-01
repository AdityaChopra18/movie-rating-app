const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  genre: [{
    type: String     // array because a movie can have multiple genres
  }],
  releaseYear: {
    type: Number
  },
  director: {
    type: String
  },
  posterUrl: {
    type: String     // image link from TMDB API later
  },
  tmdbId: {
    type: String,
    unique: true     // ID from The Movie Database API
  },
  averageRating: {
    type: Number,
    default: 0
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  ratingDistribution: {
    1: { type: Number, default: 0 },
    2: { type: Number, default: 0 },
    3: { type: Number, default: 0 },
    4: { type: Number, default: 0 },
    5: { type: Number, default: 0 }
  },
  isFlaggedForBombing: {
    type: Boolean,
    default: false    // gets set to true if bombing is detected
  },
  contentType: {
  type: String,
  enum: ['movie', 'series', 'anime', 'documentary', 'short'],
  default: 'movie'
},
}, { timestamps: true }); // auto adds createdAt and updatedAt

module.exports = mongoose.model('Movie', movieSchema);