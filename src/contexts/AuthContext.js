import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, logoutUser } from '../services/apiService'; // Assuming apiService.js is in ../services

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // Add a loading state

  // Check for token in local storage on initial load
  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user'); // You might store basic user info

    if (storedToken) {
      setToken(storedToken);
      // You might want to validate the token with the backend here
      // and fetch full user details if needed
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
    setLoading(false); // Set loading to false after checking storage
  }, []);

  const login = async (credentials) => {
    try {
      const response = await loginUser(credentials);
      const { user, accessToken, refreshToken } = response.data.data; // Adjust based on your API response structure

      setUser(user);
      setToken(accessToken);
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken); // Store refresh token too
      localStorage.setItem('user', JSON.stringify(user)); // Store basic user info

      // You might also want to set up an interceptor in apiService
      // to automatically attach the token to requests
      return response.data; // Return the response for handling in the component
    } catch (error) {
      console.error('Login failed:', error);
      throw error; // Re-throw the error for handling in the component
    }
  };

  const logout = async () => {
    try {
      await logoutUser(); // Call your backend logout API

      setUser(null);
      setToken(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      // Clear any other relevant local storage items

    } catch (error) {
      console.error('Logout failed:', error);
      // Even if backend logout fails, clear local storage for a better UX
      setUser(null);
      setToken(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      throw error;
    }
  };

  // You might want a function to refresh the access token
  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      // Assuming you have a refresh token API call in apiService
      const response = await apiService.refreshAccessToken({ refreshToken });
      const { accessToken } = response.data.data; // Adjust based on your API response

      setToken(accessToken);
      localStorage.setItem('accessToken', accessToken);
      return accessToken;
    } catch (error) {
      console.error('Failed to refresh access token:', error);
      // If refreshing fails, potentially force logout
      logout();
      throw error;
    }
  };


  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};