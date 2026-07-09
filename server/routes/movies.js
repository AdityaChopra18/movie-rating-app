const express = require('express');
const router = express.Router();
const axios = require('axios');
const Movie = require('../models/Movie');
const protect = require('../middleware/protect');

// ─────────────────────────────────────────
// SEARCH MOVIES — GET /api/movies/search?title=inception
// ─────────────────────────────────────────
router.get('/search', async (req, res) => {
  try {
    const { title, year, type } = req.query;

    if (!title) {
      return res.status(400).json({ message: 'Please provide a title to search' });
    }

    const params = {
      apikey: process.env.OMDB_API_KEY,
      s: title
    };
    
    if (year) params.y = year;
    if (type) params.type = type;

    // Fetch from OMDB API
    const response = await axios.get(`http://www.omdbapi.com/`, { params });

    if (response.data.Response === 'False') {
      return res.status(404).json({ message: 'No movies found' });
    }

    res.json({
      movies: response.data.Search,
      totalResults: response.data.totalResults
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ─────────────────────────────────────────
// EXPLORE LOCAL MOVIES — GET /api/movies/explore
// ─────────────────────────────────────────
router.get('/explore', async (req, res) => {
  try {
    const { genre, sort } = req.query;
    
    let query = {};
    if (genre && genre !== 'All') {
      query.genre = { $regex: new RegExp(genre, 'i') };
    }
    
    let sortObj = { averageRating: -1 }; 
    if (sort === 'most_reviewed') sortObj = { totalRatings: -1 };
    else if (sort === 'newest') sortObj = { releaseYear: -1 };
    
    const movies = await Movie.find(query).sort(sortObj).limit(24);
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ─────────────────────────────────────────
// GET MOVIES RATED COUNT — GET /api/movies/stats/count
// ─────────────────────────────────────────
router.get('/stats/count', async (req, res) => {
  try {
    const count = await Movie.countDocuments({ totalRatings: { $gt: 0 } });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ─────────────────────────────────────────
// GET SINGLE MOVIE DETAILS — GET /api/movies/:imdbId
// ─────────────────────────────────────────
router.get('/:imdbId', async (req, res) => {
  try {
    const { imdbId } = req.params;

    // First check if we already have it in our database
    let movie = await Movie.findOne({ tmdbId: imdbId });

    if (movie) {
      return res.json(movie); // return from our DB directly
    }

    // If not in DB, fetch from OMDB
    const response = await axios.get(`http://www.omdbapi.com/`, {
      params: {
        apikey: process.env.OMDB_API_KEY,
        i: imdbId,       // i = search by IMDB ID
        plot: 'full'
      }
    });

    if (response.data.Response === 'False') {
      return res.status(404).json({ message: 'Movie not found' });
    }

    const omdbMovie = response.data;

    // Save to our database for future requests
    movie = new Movie({
      title: omdbMovie.Title,
      description: omdbMovie.Plot,
      genre: omdbMovie.Genre.split(', '),
      releaseYear: parseInt(omdbMovie.Year),
      director: omdbMovie.Director,
      posterUrl: omdbMovie.Poster,
      tmdbId: omdbMovie.imdbID,   // we use tmdbId field to store imdbID
    });

    await movie.save();

    res.json(movie);

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ─────────────────────────────────────────
// GET ALL MOVIES IN OUR DB — GET /api/movies
// ─────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find()
      .sort({ averageRating: -1 }) // highest rated first
      .limit(20);

    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;