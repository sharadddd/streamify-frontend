import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'About',
      links: [
        { label: 'About Us', url: '/about' },
        { label: 'Press', url: '/press' },
        { label: 'Copyright', url: '/copyright' },
        { label: 'Contact us', url: '/contact' },
        { label: 'Creators', url: '/creators' }
      ]
    },
    {
      title: 'Community',
      links: [
        { label: 'Community Guidelines', url: '/guidelines' },
        { label: 'Safety Center', url: '/safety' },
        { label: 'Help Center', url: '/help' },
        { label: 'Advertise', url: '/advertise' },
        { label: 'Developers', url: '/developers' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { label: 'Terms', url: '/terms' },
        { label: 'Privacy', url: '/privacy' },
        { label: 'Policy & Safety', url: '/policy' },
        { label: 'How Streamifyy works', url: '/how-it-works' },
        { label: 'Test new features', url: '/beta' }
      ]
    }
  ];

  const socialLinks = [
    { icon: '🌐', label: 'Website', url: 'https://sharadpandey.com' },
    { icon: '💼', label: 'LinkedIn', url: 'https://linkedin.com/in/sharadpandey' },
    { icon: '🐱', label: 'GitHub', url: 'https://github.com/sharadpandey' },
    { icon: '📸', label: 'Instagram', url: 'https://instagram.com/sharadpandey' },
    { icon: '🐦', label: 'Twitter', url: 'https://twitter.com/sharadpandey' }
  ];

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-main">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <svg viewBox="0 0 24 24" className="footer-logo-icon">
                <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
              </svg>
              <span className="footer-logo-text">Streamifyy</span>
            </Link>
            <p className="footer-description">
              A modern video streaming platform built with love by Sharad Pandey.
              Share your stories, connect with others, and discover amazing content.
            </p>
            <div className="footer-social">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  title={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="footer-links">
            {footerSections.map((section, index) => (
              <div key={index} className="footer-section">
                <h3 className="footer-section-title">{section.title}</h3>
                <ul className="footer-section-links">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link to={link.url}>{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-info">
            <p>© {currentYear} Streamifyy by Sharad Pandey</p>
            <p>Contact: sharad868788@gmail.com</p>
          </div>
          <div className="footer-language">
            <select className="language-select">
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="hi">हिंदी</option>
            </select>
            <select className="country-select">
              <option value="global">Global</option>
              <option value="us">United States</option>
              <option value="uk">United Kingdom</option>
              <option value="ca">Canada</option>
              <option value="au">Australia</option>
              <option value="in">India</option>
            </select>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;