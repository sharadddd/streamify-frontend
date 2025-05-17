import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/apiService';
import '../styles/RegisterPage.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    password: '',
    avatar: null,
    coverImage: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('username', formData.username);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('fullName', formData.fullName);
      formDataToSend.append('password', formData.password);
      if (formData.avatar) formDataToSend.append('avatar', formData.avatar);
      if (formData.coverImage) formDataToSend.append('coverImage', formData.coverImage);

      const response = await registerUser(formDataToSend);
      setSuccess(true);

      // Store user data and token
      localStorage.setItem('user', JSON.stringify(response.data));
      localStorage.setItem('token', response.data.token);

      // Show success message briefly before redirecting
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-form-box">
        <h2 className="form-title">Create Your Account</h2>
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Choose a username"
              required
              className="input-field"
              style={{ backgroundColor: '#ffffff', color: '#1a202c' }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
                onChange={handleInputChange}
              placeholder="Enter your full name"
              required
              className="input-field"
              style={{ backgroundColor: '#ffffff', color: '#1a202c' }}
              />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
              className="input-field"
              style={{ backgroundColor: '#ffffff', color: '#1a202c' }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Create a password"
              required
              className="input-field"
              style={{ backgroundColor: '#ffffff', color: '#1a202c' }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="avatar">Profile Picture (Required)</label>
            <input
              type="file"
              id="avatar"
              name="avatar"
              onChange={handleInputChange}
              accept="image/*"
              required
              className="file-input"
              style={{ color: '#2d3748' }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="coverImage">Cover Image (Optional)</label>
            <input
              type="file"
              id="coverImage"
              name="coverImage"
              onChange={handleInputChange}
              accept="image/*"
              className="file-input"
              style={{ color: '#2d3748' }}
            />
          </div>

          <button
            type="submit"
            className="register-button"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">Account created successfully!</p>}
      </div>
    </div>
  );
};

export default RegisterPage;
