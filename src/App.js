import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import VideoUpload from './components/VideoUpload'; // Adjust path as needed
import VideoList from './components/VideoList'; // Adjust path as needed
import VideoPlayer from './components/VideoPlayer'; // Adjust path as needed

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import VideoPlaybackPage from './pages/VideoPlaybackPage';
import UserProfilePage from './pages/UserProfilePage';
import VideoDetailsPage from './pages/VideoDetailsPage';
import DummyVideoDetailsPage from './pages/DummyVideoDetailsPage';
import RegisterPage from './pages/RegisterPage';
import PlaylistDetailsPage from './pages/PlaylistDetailsPage';
import UserPlaylistsPage from './pages/UserPlaylistsPage';
import UserTweetsPage from './pages/UserTweetsPage';
import CreateTweetPage from './pages/CreateTweetPage';
import SubscribedChannelsPage from './pages/SubscribedChannelsPage';
import DashboardPage from './pages/DashboardPage';
import ChannelSubscribersPage from './pages/ChannelSubscribersPage';
import SearchResultsPage from './pages/SearchResultsPage';

import Header from './components/Header';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import ProtectedRoute from './components/ProtectedRoute';

import './styles/App.css';
import './styles/TopNav.css'; // Import the TopNav styles

const AnimatedRoutes = () => {
  const location = useLocation();

    return (
        <SwitchTransition>
            <CSSTransition key={location.pathname} classNames="page-transition" timeout={300}>
                <Routes location={location}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/watch/:videoId" element={<VideoPlaybackPage />} />
                    <Route path="/profile/:username" element={<UserProfilePage />} />
                    <Route path="/dashboard" element={<ProtectedRoute element={<DashboardPage />} />} />
                    <Route path="/video/:videoId" element={<DummyVideoDetailsPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/my-playlists" element={<ProtectedRoute element={<UserPlaylistsPage />} />} />
                    <Route path="/playlists/:playlistId" element={<PlaylistDetailsPage />} />
                    <Route path="/users/:userId/tweets" element={<UserTweetsPage />} />
                    <Route path="/subscribed-channels" element={<ProtectedRoute element={<SubscribedChannelsPage />} />} />
                    <Route path="/channel-subscribers/:userId" element={<ProtectedRoute element={<ChannelSubscribersPage />} />} />
                    <Route path="/create-tweet" element={<ProtectedRoute element={<CreateTweetPage />} />} />
                    <Route path="/search" element={<SearchResultsPage />} />
                    {/* Keep these routes if they are still necessary */}
                    <Route path="/videos" element={<VideoList />} />
                    <Route path="/upload" element={<VideoUpload />} />
                    <Route path="/play/:videoId" element={<VideoPlayer />} />
                </Routes>
            </CSSTransition>
        </SwitchTransition>
    );
};

const App = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  return (
      <div className="App">
        <Header />

        {/* Add a simple navigation bar */}
        <nav className="main-nav">
          <ul className="main-nav-list">
            <li className="main-nav-item"><Link to="/videos">Video List</Link></li>
            <li className="main-nav-item"><Link to="/upload">Upload Video</Link></li>
            {/* You can add more navigation links here */}
          </ul>
        </nav>

        <main>
          <AnimatedRoutes />
        </main>
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
          {isChatbotOpen && <Chatbot />}
          <button onClick={() => setIsChatbotOpen(prev => !prev)}>
            {isChatbotOpen ? 'Close Chat' : 'Open Chat'}
          </button>
        </div>
        <Footer />
      </div>
  );
};

export default App;
