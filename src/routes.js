import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VideoPlaybackPage from './pages/VideoPlaybackPage';
import UserProfilePage from './pages/UserProfilePage';
import VideoDetailsPage from './pages/VideoDetailsPage';
import UserPlaylistsPage from './pages/UserPlaylistsPage';
import PlaylistDetailsPage from './pages/PlaylistDetailsPage';
import UserTweetsPage from './pages/UserTweetsPage';
import CreateTweetPage from './pages/CreateTweetPage';
import SubscribedChannelsPage from './pages/SubscribedChannelsPage';
import ChannelSubscribersPage from './pages/ChannelSubscribersPage';
import SearchResultsPage from './pages/SearchResultsPage';
import DashboardPage from './pages/DashboardPage';

// Components
import VideoUpload from './components/VideoUpload';
import VideoList from './components/VideoList';
import VideoPlayer from './components/VideoPlayer';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/watch/:videoId" element={<VideoPlaybackPage />} />
            <Route path="/profile/:username" element={<UserProfilePage />} />
            <Route path="/video/:videoId" element={<VideoDetailsPage />} />
            <Route path="/search" element={<SearchResultsPage />} />

            {/* Video Routes */}
            <Route path="/videos" element={<VideoList />} />
            <Route path="/upload" element={<VideoUpload />} />
            <Route path="/play/:videoId" element={<VideoPlayer />} />

            {/* Playlist Routes */}
            <Route path="/my-playlists" element={<UserPlaylistsPage />} />
            <Route path="/playlists/:playlistId" element={<PlaylistDetailsPage />} />
            <Route path="/playlists" element={<UserPlaylistsPage />} />

            {/* Social Routes */}
            <Route path="/users/:userId/tweets" element={<UserTweetsPage />} />
            <Route path="/create-tweet" element={<CreateTweetPage />} />
            <Route path="/subscribed-channels" element={<SubscribedChannelsPage />} />
            <Route path="/channel-subscribers/:userId" element={<ChannelSubscribersPage />} />

            {/* Navigation Routes */}
            <Route path="/trending" element={<div>Trending Page</div>} />
            <Route path="/subscriptions" element={<div>Subscriptions Page</div>} />
            <Route path="/library" element={<div>Library Page</div>} />
            <Route path="/history" element={<div>History Page</div>} />
            <Route path="/liked" element={<div>Liked Videos Page</div>} />

            {/* Dashboard Routes */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/dashboard/videos" element={<div>Your Videos Page</div>} />
            <Route path="/dashboard/analytics" element={<div>Analytics Page</div>} />
            <Route path="/dashboard/comments" element={<div>Comments Page</div>} />
            <Route path="/dashboard/customization" element={<div>Customization Page</div>} />

            {/* Settings Routes */}
            <Route path="/settings" element={<div>Settings Page</div>} />
            <Route path="/help" element={<div>Help Page</div>} />

            {/* Footer Routes */}
            <Route path="/about" element={<div>About Page</div>} />
            <Route path="/press" element={<div>Press Page</div>} />
            <Route path="/copyright" element={<div>Copyright Page</div>} />
            <Route path="/contact" element={<div>Contact Page</div>} />
            <Route path="/creators" element={<div>Creators Page</div>} />
            <Route path="/advertise" element={<div>Advertise Page</div>} />
            <Route path="/developers" element={<div>Developers Page</div>} />
            <Route path="/terms" element={<div>Terms Page</div>} />
            <Route path="/privacy" element={<div>Privacy Page</div>} />
            <Route path="/policy" element={<div>Policy Page</div>} />
            <Route path="/how-it-works" element={<div>How It Works Page</div>} />
            <Route path="/beta" element={<div>Beta Features Page</div>} />

            {/* 404 Route */}
            <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
    );
};

export default AppRoutes; 