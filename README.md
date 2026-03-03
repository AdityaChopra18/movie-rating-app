# 🎬 MovieRater

A full-stack movie rating platform built with the MERN stack. Honest ratings by real people — no ads, no paid promotions, and protected against review bombing.

![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)

---

## ✨ Features

- 🔍 **Search** movies, TV shows, anime, and documentaries via OMDB API
- ⭐ **Rate & Review** any title (1–5 stars + text review)
- 🔐 **Secure signup** — instant registration with bcrypt password hashing and JWT authentication
- 🛡️ **Anti-review bombing protection** — rate limiting, anomaly detection
- 🎯 **Recommendation system** — personalized picks, trending, genre-based, and top rated
- 👁️ **Public viewing** — anyone can browse and read reviews without an account

---

## 🛡️ Anti-Bombing System

| Protection | Details |
|---|---|
| Account age | Account must be at least 1 hour old to post reviews |
| Daily limit | Max 10 reviews per user per day |
| Anomaly detection | 20+ reviews in 1 hour with avg rating below 1.5 triggers auto-flag |
| Auto-hide | Suspicious reviews are hidden and flagged for review |

---

## 🧠 Recommendation Engine

- **Trending** — most reviewed titles in the last 7 days
- **Top Rated** — all-time highest rated in the database
- **Genre Based** — "More like this" using shared genres
- **For You** — personalized picks based on your rating history (top 3 favourite genres)

---

## 🗂️ Project Structure

```
movie-rating-app/
├── client/                  # React frontend
│   └── src/
│       ├── components/      # Navbar, MovieCard, StarRating
│       ├── context/         # AuthContext (global auth state)
│       ├── pages/           # Home, Search, MovieDetail, Login, Signup
│       └── utils/           # Axios API instance
│
└── server/                  # Node + Express backend
    ├── models/              # User, Movie, Review (Mongoose schemas)
    ├── routes/              # auth, movies, reviews, recommendations
    ├── middleware/          # JWT protect middleware
    └── utils/               # sendEmail (Nodemailer + Gmail)
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free)
- OMDB API key (free) — https://www.omdbapi.com
- Gmail account with App Password enabled

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/movie-rating-app.git
cd movie-rating-app
```

### 2. Setup the backend

```bash
cd server
npm install
```

Create a `.env` file inside `server/`:

```
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secret_key
EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=your_gmail_app_password
OMDB_API_KEY=your_omdb_key
```

Start the backend:

```bash
npm run dev
```

### 3. Setup the frontend

```bash
cd client
npm install
npm start
```

The app will open at `http://localhost:3000`

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register instantly, returns JWT token |
| POST | `/api/auth/login` | Login, returns JWT token |

### Movies
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/movies/search?title=` | Search via OMDB API |
| GET | `/api/movies/:imdbId` | Get movie details, auto-saves to DB |
| GET | `/api/movies` | Get all movies in database |

### Reviews
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/reviews/:imdbId` | ✅ Required | Post a review |
| GET | `/api/reviews/:imdbId` | ❌ Public | Get all reviews for a movie |
| DELETE | `/api/reviews/:id` | ✅ Required | Delete your own review |

### Recommendations
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/recommendations/trending` | ❌ Public | Trending this week |
| GET | `/api/recommendations/toprated` | ❌ Public | All time top rated |
| GET | `/api/recommendations/genre/:imdbId` | ❌ Public | Similar movies |
| GET | `/api/recommendations/foryou` | ✅ Required | Personalized picks |

---

## 🧰 Tech Stack

### Backend
- **Node.js** + **Express.js** — server and routing
- **MongoDB** + **Mongoose** — database and schemas
- **JWT** — authentication tokens
- **bcryptjs** — password hashing
- **Nodemailer** — OTP email delivery
- **express-rate-limit** — request limiting
- **axios** — OMDB API calls

### Frontend
- **React** — UI framework
- **React Router** — client-side navigation
- **Context API** — global auth state
- **axios** — API calls
- **react-hot-toast** — notifications

### External APIs
- **OMDB API** — movie data, posters, descriptions

---

## 📸 Pages

| Page | Route | Auth Required |
|---|---|---|
| Home | `/` | No |
| Search | `/search` | No |
| Movie Detail | `/movie/:imdbId` | No (read) / Yes (review) |
| Login | `/login` | No |
| Signup | `/signup` | No |

---

## 🌐 Live Demo

- **Frontend** — https://movie-rating-app-pied.vercel.app
- **Backend API** — https://movie-rating-app-q5k2.onrender.com

---

## 🌐 Deployment

- **Backend** — [Render](https://render.com) (free tier)
- **Frontend** — [Vercel](https://vercel.com) (free tier)
- **Database** — [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier)


---

Built with ❤️ as a MERN stack learning project.