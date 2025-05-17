import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCurrentUser, getChannelStats, getUserChannelProfile } from '../services/apiService';
import '../styles/UserProfile.css';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const [userData, statsData] = await Promise.all([
          getCurrentUser(),
          getChannelStats()
        ]);

        // If we have a username, get the channel profile as well
        let channelData = {};
        if (userData.data?.username) {
          const channelResponse = await getUserChannelProfile(userData.data.username);
          channelData = channelResponse.data;
        }

        setUser({
          ...userData.data,
          ...channelData,
          avatar: userData.data?.avatar || '/default-avatar.png',
          coverImage: channelData?.coverImage || '/default-cover.jpg'
        });
        setStats(statsData.data);
      } catch (err) {
        setError('Failed to load profile data');
        console.error('Error loading profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="error-state">
        <p>User not found</p>
        <Link to="/" className="home-link">
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="user-profile">
      <div className="profile-header">
        <div className="cover-image">
          <img src={user.coverImage} alt="Profile cover" />
        </div>
        <div className="profile-info">
          <div className="profile-avatar">
            <img src={user.avatar} alt={user.fullName || user.username} />
          </div>
          <div className="profile-details">
            <div className="profile-text">
              <h1 className="profile-name">
                {user.fullName || user.username}
                {user.isVerified && <span className="verified-badge">✓</span>}
              </h1>
              <h2 className="profile-username">@{user.username}</h2>
              <p className="profile-bio">{user.bio || 'No bio yet'}</p>
            </div>
            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-value">{formatNumber(stats?.subscribersCount)}</span>
                <span className="stat-label">Subscribers</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{formatNumber(stats?.videoCount)}</span>
                <span className="stat-label">Videos</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{formatNumber(stats?.totalViews)}</span>
                <span className="stat-label">Views</span>
              </div>
            </div>
          </div>
          <div className="profile-actions">
            <button className="edit-profile-button">Edit Profile</button>
            <button className="share-button">Share</button>
          </div>
        </div>
      </div>

      <div className="profile-content">
        {user.badges && user.badges.length > 0 && (
          <div className="profile-badges">
            {user.badges.map(badge => (
              <div key={badge.id} className="badge-item">
                <span className="badge-icon">{badge.icon}</span>
                <span className="badge-label">{badge.label}</span>
              </div>
            ))}
          </div>
        )}

        {user.socialLinks && (
          <div className="profile-links">
            {user.socialLinks.website && (
              <a href={user.socialLinks.website} target="_blank" rel="noopener noreferrer" className="social-link">
                🌐 Website
              </a>
            )}
            {user.socialLinks.twitter && (
              <a href={`https://twitter.com/${user.socialLinks.twitter}`} target="_blank" rel="noopener noreferrer" className="social-link">
                🐦 Twitter
              </a>
            )}
            {user.socialLinks.github && (
              <a href={`https://github.com/${user.socialLinks.github}`} target="_blank" rel="noopener noreferrer" className="social-link">
                💻 GitHub
              </a>
            )}
          </div>
        )}

        <nav className="profile-nav">
          <Link to="videos" className="nav-link active">Videos</Link>
          <Link to="playlists" className="nav-link">Playlists</Link>
          <Link to="about" className="nav-link">About</Link>
        </nav>
      </div>
    </div>
  );
};

export default UserProfile; 