import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import SearchBar from './SearchBar'; // Make sure this path is correct based on your file structure
import '../styles/Header.css';

const Header = () => {
  const { user, logout, loading } = useAuth(); // Include loading state
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 0;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Render nothing or a loading indicator while authentication status is loading
  if (loading) {
    return null; // Or return a loading spinner component
  }

  return (
    <header
 className={`header flex items-center justify-between px-4 py-3 ${scrolled ? 'scrolled' : ''}`}
    >
 <div className="flex items-center">
        {/* Placeholder for Logo */}
        <Link to="/" className="header-logo">
          <h2>My App</h2>
        </Link>
 </div>
 <div className="flex-grow mx-4">
 <SearchBar />
 </div>
      <nav>
        {user ? (
          <ul className="header-nav-list">
            <NavLink to="/">Home</NavLink>
            <NavLink to={`/profile/${user.username}`}>Profile</NavLink>
            {/* Add more logged-in navigation links as needed */}
            <li className="header-nav-item"><span>Welcome, {user.username}</span></li>
            <li className="header-nav-item">
              <button onClick={logout} className="header-logout-button">
                Logout
              </button>
            </li>
          </ul>
        ) : (
          <ul className="header-nav-list">
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </ul>
        )}
      </nav>
    </header>
  );
};

const NavLink = ({ to, children }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <li className="header-nav-item">
      <Link
        to={to}
        className="header-nav-link"
      >
 {children}
      </Link>
    </li>
  );
};

export default Header;