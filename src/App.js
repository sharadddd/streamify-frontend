import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import ChatBot from './components/ChatBot';
import Footer from './components/Footer';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import './styles/App.css';

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="app">
          <Header />
          <Sidebar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/explore" element={<div>Explore Page</div>} />
              <Route path="/library" element={<div>Library Page</div>} />
              <Route path="/history" element={<div>History Page</div>} />
              <Route path="/bookmarks" element={<div>Bookmarks Page</div>} />
              <Route path="/liked" element={<div>Liked Videos Page</div>} />
              <Route path="/category/:category" element={<div>Category Page</div>} />
              <Route path="/watch/:videoId" element={<div>Video Page</div>} />
              <Route path="/channel/:username" element={<div>Channel Page</div>} />
            </Routes>
          </main>
          <ChatBot />
          <Footer />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
