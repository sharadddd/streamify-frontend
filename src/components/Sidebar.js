import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';
import * as BsIcons from 'react-icons/bs';
import * as AiIcons from 'react-icons/ai';
import '../styles/components/Sidebar.css';

const Sidebar = () => {
    const location = useLocation();

    const mainLinks = [
        { icon: <FaIcons.FaHome />, text: 'Home', path: '/' },
        { icon: <FaIcons.FaCompass />, text: 'Explore', path: '/explore' },
        { icon: <BsIcons.BsFillCollectionPlayFill />, text: 'Library', path: '/library' },
        { icon: <BsIcons.BsClockHistory />, text: 'History', path: '/history' },
        { icon: <BsIcons.BsBookmarkFill />, text: 'Bookmarks', path: '/bookmarks' },
        { icon: <AiIcons.AiFillLike />, text: 'Liked Videos', path: '/liked' }
    ];

    const categories = [
        { icon: <FaIcons.FaGamepad />, text: 'Gaming', path: '/category/gaming' },
        { icon: <FaIcons.FaFilm />, text: 'Movies', path: '/category/movies' },
        { icon: <FaIcons.FaMusic />, text: 'Music', path: '/category/music' },
        { icon: <FaIcons.FaNewspaper />, text: 'News', path: '/category/news' },
        { icon: <FaIcons.FaGraduationCap />, text: 'Education', path: '/category/education' },
        { icon: <FaIcons.FaCode />, text: 'Technology', path: '/category/technology' }
    ];

    const socialLinks = [
        { icon: <AiIcons.AiFillGithub />, url: 'https://github.com' },
        { icon: <AiIcons.AiFillInstagram />, url: 'https://instagram.com' },
        { icon: <AiIcons.AiFillTwitterCircle />, url: 'https://twitter.com' },
        { icon: <AiIcons.AiFillLinkedin />, url: 'https://linkedin.com' }
    ];

    return (
        <div className="sidebar">
            <div className="sidebar-section">
                <div className="sidebar-header">Main Menu</div>
                {mainLinks.map((link) => (
                    <Link
                        key={link.path}
                        to={link.path}
                        className={`sidebar-item ${location.pathname === link.path ? 'active' : ''}`}
                    >
                        <span className="sidebar-icon">{link.icon}</span>
                        <span className="sidebar-text">{link.text}</span>
                    </Link>
                ))}
            </div>

            <div className="sidebar-section">
                <div className="sidebar-header">Categories</div>
                {categories.map((category) => (
                    <Link
                        key={category.path}
                        to={category.path}
                        className={`sidebar-item ${location.pathname === category.path ? 'active' : ''}`}
                    >
                        <span className="sidebar-icon">{category.icon}</span>
                        <span className="sidebar-text">{category.text}</span>
                    </Link>
                ))}
            </div>

            <div className="sidebar-section social-section">
                <div className="sidebar-header">Follow Us</div>
                <div className="social-links">
                    {socialLinks.map((social, index) => (
                        <a
                            key={index}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-link"
                        >
                            {social.icon}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Sidebar; 