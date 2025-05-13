import React, { useState, forwardRef } from 'react';
import { registerUser } from '../services/apiService';
import '../styles/RegisterPage.css';

const RegisterPage = forwardRef((props, ref) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    avatar: null,
    coverImage: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const form = new FormData();
    form.append('username', formData.username);
    form.append('email', formData.email);
    form.append('password', formData.password);
    if (formData.avatar) form.append('avatar', formData.avatar);
    if (formData.coverImage) form.append('coverImage', formData.coverImage);

    try {
      await registerUser(form);
      setSuccess(true);
      setFormData({
        username: '',
        email: '',
        password: '',
        avatar: null,
        coverImage: null,
      });
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container" ref={ref}>
      {/* Assuming first and last name inputs are needed for registration.
          These were not in the provided JS, adding as example based on previous conversation. */}
      <div className="register-form-box">
        <h2 className="form-title">Register Page</h2>
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group animated-form-group" style={{ animationDelay: '0.1s' }}>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              className="input-field fade-in"
              style={{ animationDelay: '0.1s' }}
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Example of wrapping first and last name in a container for layout */}
          <div className="name-fields"> {/* New container for name fields */}
            {/* Add form group for first name if it exists */}
            {/*
            <div className="form-group animated-form-group" style={{ animationDelay: '0.15s' }}>
              <label htmlFor="firstName">First Name:</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                className="input-field fade-in"
                style={{ animationDelay: '0.15s' }}
                value={formData.firstName} // Assuming formData includes firstName
                onChange={handleInputChange}
              />
            </div>
            */}
            {/* Add form group for last name if it exists */}
            {/*
            <div className="form-group animated-form-group" style={{ animationDelay: '0.25s' }}>
              <label htmlFor="lastName">Last Name:</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className="input-field fade-in"
                style={{ animationDelay: '0.25s' }}
                value={formData.lastName} // Assuming formData includes lastName
                onChange={handleInputChange}
              />
            </div>
            */}
          </div>

          <div className="form-group animated-form-group" style={{ animationDelay: '0.2s' }}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              className="input-field fade-in"
              style={{ animationDelay: '0.2s' }}
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group animated-form-group" style={{ animationDelay: '0.3s' }}>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              className="input-field fade-in"
              style={{ animationDelay: '0.3s' }}
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group animated-form-group" style={{ animationDelay: '0.4s' }}>
            <label htmlFor="avatar">Avatar:</label>
            <input
              type="file"
              id="avatar"
              name="avatar"
              className="input-field fade-in"
              style={{ animationDelay: '0.4s' }}
              accept="image/*"
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group animated-form-group" style={{ animationDelay: '0.5s' }}>
            <label htmlFor="coverImage">Cover Image:</label>
            <input
              type="file"
              id="coverImage"
              name="coverImage"
              className="input-field fade-in"
              style={{ animationDelay: '0.5s' }}
              accept="image/*"
              onChange={handleInputChange}
            />
          </div>

          <button type="submit" disabled={loading} className="register-button btn-primary">
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        {/* Feedback Messages */}
        {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
        {success && <p className="success-message" style={{ color: 'green' }}>Registration successful!</p>}
      </div>
    </div>
  );
});

export default RegisterPage;
