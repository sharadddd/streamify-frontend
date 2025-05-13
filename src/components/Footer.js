import React from 'react';
import './../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} Your App Name. All rights reserved.</p>
      {/* Add more footer content like links here */}
    </footer>
  );
};

export default Footer;