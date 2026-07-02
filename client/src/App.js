import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Search from './pages/Search';
import MovieDetail from './pages/MovieDetail';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Dashboard from './pages/Dashboard';
import UserProfile from './pages/UserProfile';

function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#0a0a0a' }}>
        <Toaster position="top-right" />
        <Navbar />
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/movie/:imdbId" element={<MovieDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/user/:username" element={<UserProfile />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;