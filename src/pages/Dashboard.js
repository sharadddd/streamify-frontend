import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getChannelStats, getChannelVideos, getCurrentUser } from '../services/apiService';
import * as FaIcons from 'react-icons/fa';
import * as BsIcons from 'react-icons/bs';
import '../styles/pages/Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const userStats = {
    totalViews: '1.2M',
    totalLikes: '45.6K',
    totalComments: '12.3K',
    totalShares: '8.9K',
    subscribers: '50.2K',
    uploadedVideos: 42
  };

  const recentActivity = [
    {
      type: 'comment',
      user: 'John Doe',
      action: 'commented on',
      video: 'React Hooks Tutorial',
      time: '2 hours ago'
    },
    {
      type: 'like',
      user: 'Sarah Smith',
      action: 'liked',
      video: 'Node.js Crash Course',
      time: '3 hours ago'
    },
    {
      type: 'subscribe',
      user: 'Mike Johnson',
      action: 'subscribed to your channel',
      time: '5 hours ago'
    }
  ];

  const popularVideos = [
    {
      title: 'Complete React Course 2024',
      views: '256K',
      likes: '12K',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee'
    },
    {
      title: 'TypeScript for Beginners',
      views: '128K',
      likes: '8K',
      thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6'
    },
    {
      title: 'MongoDB Tutorial',
      views: '98K',
      likes: '6K',
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c'
    }
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch user data first
        const userData = await getCurrentUser();
        setUser(userData.data);

        // Fetch channel statistics
        const statsData = await getChannelStats();
        setStats(statsData);

        // Fetch recent videos
        const videosData = await getChannelVideos();
        setVideos(videosData.videos);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'Error loading dashboard data');
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
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <h2>Error loading dashboard</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="date-filter">
          <select defaultValue="7">
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 3 months</option>
            <option value="365">Last year</option>
          </select>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <FaIcons.FaEye className="stat-icon" />
          <div className="stat-info">
            <h3>Total Views</h3>
            <p>{userStats.totalViews}</p>
          </div>
        </div>
        <div className="stat-card">
          <FaIcons.FaHeart className="stat-icon" />
          <div className="stat-info">
            <h3>Total Likes</h3>
            <p>{userStats.totalLikes}</p>
          </div>
        </div>
        <div className="stat-card">
          <FaIcons.FaComments className="stat-icon" />
          <div className="stat-info">
            <h3>Comments</h3>
            <p>{userStats.totalComments}</p>
          </div>
        </div>
        <div className="stat-card">
          <FaIcons.FaShare className="stat-icon" />
          <div className="stat-info">
            <h3>Shares</h3>
            <p>{userStats.totalShares}</p>
          </div>
        </div>
        <div className="stat-card">
          <FaIcons.FaChartLine className="stat-icon" />
          <div className="stat-info">
            <h3>Subscribers</h3>
            <p>{userStats.subscribers}</p>
          </div>
        </div>
        <div className="stat-card">
          <BsIcons.BsCollectionPlay className="stat-icon" />
          <div className="stat-info">
            <h3>Videos</h3>
            <p>{userStats.uploadedVideos}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="content-section">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            {recentActivity.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-icon">
                  {activity.type === 'comment' && <FaIcons.FaComments />}
                  {activity.type === 'like' && <FaIcons.FaHeart />}
                  {activity.type === 'subscribe' && <FaIcons.FaChartLine />}
                </div>
                <div className="activity-details">
                  <p>
                    <strong>{activity.user}</strong> {activity.action}
                    {activity.video && <span> "{activity.video}"</span>}
                  </p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="content-section">
          <h2>Popular Videos</h2>
          <div className="popular-videos">
            {popularVideos.map((video, index) => (
              <div key={index} className="video-card">
                <img src={video.thumbnail} alt={video.title} />
                <div className="video-info">
                  <h3>{video.title}</h3>
                  <div className="video-stats">
                    <span><FaIcons.FaEye /> {video.views}</span>
                    <span><FaIcons.FaHeart /> {video.likes}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export default Dashboard; 