import React, { useEffect, useState } from 'react';
import { getCurrentUser, getChannelStats, getWatchHistory } from '../services/apiService';
import '../styles/DashboardPage.css';

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [watchHistory, setWatchHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [userData, statsData, historyData] = await Promise.all([
          getCurrentUser(),
          getChannelStats(),
          getWatchHistory()
        ]);

        setUser(userData.data);
        setStats(statsData.data);
        setWatchHistory(historyData.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* User Profile Header */}
      <div className="dashboard-header">
        <div className="profile-section">
          <img
            src={user?.avatar}
            alt="Profile"
            className="profile-avatar"
          />
          <div className="profile-info">
            <h1>{user?.fullName}</h1>
            <p className="username">@{user?.username}</p>
            <p className="email">{user?.email}</p>
          </div>
        </div>
        <div className="header-actions">
          <button className="edit-profile-btn">Edit Profile</button>
        </div>
      </div>

      {/* Dashboard Navigation */}
      <div className="dashboard-nav">
        <button
          className={`nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`nav-btn ${activeTab === 'videos' ? 'active' : ''}`}
          onClick={() => setActiveTab('videos')}
        >
          Your Videos
        </button>
        <button
          className={`nav-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
        <button
          className={`nav-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Watch History
        </button>
      </div>

      {/* Dashboard Content */}
      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Videos</h3>
                <p className="stat-number">{stats?.videoCount || 0}</p>
              </div>
              <div className="stat-card">
                <h3>Total Views</h3>
                <p className="stat-number">{stats?.totalViews || 0}</p>
              </div>
              <div className="stat-card">
                <h3>Subscribers</h3>
                <p className="stat-number">{stats?.subscribersCount || 0}</p>
              </div>
              <div className="stat-card">
                <h3>Total Likes</h3>
                <p className="stat-number">{stats?.totalLikes || 0}</p>
              </div>
            </div>

            <div className="quick-actions">
              <h2>Quick Actions</h2>
              <div className="action-buttons">
                <button className="action-btn upload">
                  <i className="fas fa-upload"></i>
                  Upload New Video
                </button>
                <button className="action-btn create-playlist">
                  <i className="fas fa-list"></i>
                  Create Playlist
                </button>
                <button className="action-btn go-live">
                  <i className="fas fa-video"></i>
                  Go Live
                </button>
            </div>
            </div>
          </div>
        )}

        {activeTab === 'videos' && (
          <div className="videos-section">
            <h2>Your Videos</h2>
            {stats?.recentVideos?.length > 0 ? (
              <div className="videos-grid">
                {stats.recentVideos.map((video) => (
                  <div key={video._id} className="video-card">
                    <img src={video.thumbnail} alt={video.title} />
                    <h3>{video.title}</h3>
                    <p>{video.views} views • {new Date(video.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>You haven't uploaded any videos yet.</p>
                <button className="upload-btn">Upload Your First Video</button>
              </div>
            )}
        </div>
      )}

        {activeTab === 'analytics' && (
          <div className="analytics-section">
            <h2>Channel Analytics</h2>
            <div className="analytics-cards">
              <div className="analytics-card">
                <h3>Performance</h3>
                <div className="performance-stats">
                  <div className="stat">
                    <p>Views (Last 28 days)</p>
                    <h4>{stats?.viewsLast28Days || 0}</h4>
                  </div>
                  <div className="stat">
                    <p>Watch Time (Hours)</p>
                    <h4>{stats?.watchTimeHours || 0}</h4>
                  </div>
                </div>
              </div>
              <div className="analytics-card">
                <h3>Top Videos</h3>
                {stats?.topVideos?.length > 0 ? (
                  <ul className="top-videos-list">
                    {stats.topVideos.map((video) => (
                      <li key={video._id}>
                        <span>{video.title}</span>
                        <span>{video.views} views</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No video data available</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="history-section">
            <h2>Watch History</h2>
            {watchHistory.length > 0 ? (
              <div className="history-list">
                {watchHistory.map((video) => (
                  <div key={video._id} className="history-item">
                    <img src={video.thumbnail} alt={video.title} />
                    <div className="history-item-info">
                      <h3>{video.title}</h3>
                      <p>{video.owner.fullName}</p>
                      <p>Watched on {new Date(video.watchedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No watch history available.</p>
              </div>
            )}
        </div>
      )}
      </div>
    </div>
  );
};

export default DashboardPage;
