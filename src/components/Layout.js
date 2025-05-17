import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Layout.css';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const handleToggleSidebar = (event) => {
      setIsSidebarOpen(event.detail.isOpen);
    };

    window.addEventListener('toggle-sidebar', handleToggleSidebar);
    return () => window.removeEventListener('toggle-sidebar', handleToggleSidebar);
  }, []);

  const mainSections = [
    { path: '/', icon: '🏠', label: 'Home' },
    { path: '/trending', icon: '🔥', label: 'Trending' },
    { path: '/subscriptions', icon: '📺', label: 'Subscriptions' },
  ];

  const librarySection = [
    { path: '/library', icon: '📚', label: 'Library' },
    { path: '/history', icon: '⏰', label: 'History' },
    { path: '/your-videos', icon: '🎥', label: 'Your Videos' },
    { path: '/watch-later', icon: '⌛', label: 'Watch Later' },
    { path: '/liked-videos', icon: '👍', label: 'Liked Videos' },
    { path: '/playlists', icon: '📑', label: 'Playlists' },
  ];

  const subscriptionSection = [
    // This would be populated with the user's subscriptions
    // For now, we'll add some placeholder channels
    { path: '/channel/tech', icon: '💻', label: 'Tech Channel' },
    { path: '/channel/music', icon: '🎵', label: 'Music Channel' },
    { path: '/channel/gaming', icon: '🎮', label: 'Gaming Channel' },
  ];

  const exploreSection = [
    { path: '/gaming', icon: '🎮', label: 'Gaming' },
    { path: '/live', icon: '📡', label: 'Live' },
    { path: '/sports', icon: '⚽', label: 'Sports' },
    { path: '/learning', icon: '📚', label: 'Learning' },
    { path: '/fashion', icon: '👗', label: 'Fashion & Beauty' },
  ];

  const isActiveRoute = (path) => location.pathname === path;

  const renderSection = (title, items) => (
    <div className="sidebar-section">
      {title && <h3 className="sidebar-section-title">{title}</h3>}
      {items.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`sidebar-item ${isActiveRoute(item.path) ? 'active' : ''}`}
        >
          <span className="sidebar-item-icon">{item.icon}</span>
          <span className="sidebar-item-label">{item.label}</span>
        </Link>
      ))}
    </div>
  );

  return (
    <div className="layout">
      <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        {renderSection(null, mainSections)}
        <div className="sidebar-divider" />
        {user && renderSection('Library', librarySection)}
        {user && (
          <>
            <div className="sidebar-divider" />
            {renderSection('Subscriptions', subscriptionSection)}
          </>
        )}
        <div className="sidebar-divider" />
        {renderSection('Explore', exploreSection)}

        <div className="sidebar-footer">
          <div className="sidebar-links">
            <a href="/about">About</a>
            <a href="/press">Press</a>
            <a href="/copyright">Copyright</a>
            <a href="/contact">Contact us</a>
            <a href="/creators">Creators</a>
            <a href="/advertise">Advertise</a>
            <a href="/developers">Developers</a>
          </div>
          <div className="sidebar-terms">
            <a href="/terms">Terms</a>
            <a href="/privacy">Privacy</a>
            <a href="/policy">Policy & Safety</a>
            <a href="/how-youtube-works">How Streamifyy works</a>
            <a href="/test-new-features">Test new features</a>
          </div>
          <div className="sidebar-copyright">
            © 2024 Streamifyy by Sharad Pandey
            <br />
            Contact: sharad868788@gmail.com
          </div>
        </div>
      </aside>

      <main className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        {children}
      </main>

      {/* Ad Banner */}
      <div className="ad-banner">
        <div className="ad-content">
          <img src="https://via.placeholder.com/728x90" alt="Advertisement" className="ad-image" />
          <button className="ad-close-btn">×</button>
        </div>
      </div>
    </div>
  );
};

export default Layout; 