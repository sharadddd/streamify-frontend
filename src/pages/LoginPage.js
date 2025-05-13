import React, { useState, forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

import './../styles/LoginPage.css';
const LoginPage = forwardRef((props, ref) => {
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const { login } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(loginIdentifier, password);
      console.log('Login successful.');
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div ref={ref} className="login-page-container">
      <div className="login-form-box">
        <h2 className="form-title">Login to Your Account</h2>
        {error && (
          <p className="error-message">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="loginIdentifier">Username or Email:</label>
            <input
              type="text"
              id="loginIdentifier"
              value={loginIdentifier}
              onChange={(e) => setLoginIdentifier(e.target.value)}
 className="form-group input"
              placeholder="Enter username or email"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
 className="form-group input"
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="login-button btn-primary">Login</button>
        </form>
        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .login-page-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: calc(100vh - var(--header-height, 0px) - var(--footer-height, 0px));
            background-color: #f0f2f5;
            padding: 20px;
          }
          .login-form-box {
            background-color: #fff;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 400px;
            animation: fadeIn 0.8s ease-out;
          }
          .form-title {
            text-align: center;
            margin-bottom: 30px;
            color: #333;
          }
          .form-group {
            margin-bottom: 20px;
          }
          .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: bold;
            color: #555;
          }
          .form-group input {
            width: 100%;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-sizing: border-box;
            transition: border-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
          }
          .form-input:focus {
            outline: none;
            border-color: #007bff;
            box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
          }
          .login-button {
            width: 100%;
            padding: 12px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.3s ease, transform 0.1s ease;
          }
          .login-button:hover {
            background-color: #0056b3;
          }
          .error-message {
            margin-bottom: 15px;
            padding: 10px;
            background-color: #f8d7da;
            border: 1px solid #f5c6cb;
            border-radius: 4px;
            color: #721c24;
          }
          .login-button:active {
            transform: scale(0.98);
          }
        `}</style>
      </div>
    </div>
  );
});

export default LoginPage;
