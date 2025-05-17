import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../../services/apiService';
import '../../styles/RegisterPage.css';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        fullName: ''
    });
    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState('');

    const checkPasswordStrength = (password) => {
        if (password.length < 8) return '';
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        const strength = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;
        
        if (strength < 2) return 'weak';
        if (strength < 4) return 'medium';
        return 'strong';
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        if (name === 'password') {
            setPasswordStrength(checkPasswordStrength(value));
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setError('Avatar image must be less than 5MB');
                return;
            }
            if (!file.type.startsWith('image/')) {
                setError('Please upload an image file');
                return;
            }
            setAvatar(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (passwordStrength === 'weak') {
            setError('Please choose a stronger password');
            setLoading(false);
            return;
        }

        if (!avatar) {
            setError('Please upload a profile picture');
            setLoading(false);
            return;
        }

        try {
            const userData = new FormData();
            userData.append('username', formData.username);
            userData.append('email', formData.email);
            userData.append('password', formData.password);
            userData.append('fullName', formData.fullName);
            userData.append('avatar', avatar);

            const response = await registerUser(userData);

            if (response?.user) {
                // Store user data
                const storage = localStorage;
                storage.setItem('user', JSON.stringify(response.user));
                storage.setItem('accessToken', response.accessToken);

                // Navigate to dashboard
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Registration error:', error);
            setError(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-form-container">
                <div className="register-header">
                    <h1>Create your account</h1>
                    <p>Join Streamify today</p>
                </div>
                
                <form onSubmit={handleSubmit}>
                    {error && (
                        <div className="error-message">
                            <i className="fas fa-exclamation-circle"></i>
                            {error}
                        </div>
                    )}

                    <div className="avatar-upload">
                        <div className="avatar-preview">
                            {avatarPreview ? (
                                <img src={avatarPreview} alt="Avatar preview" />
                            ) : (
                                <div className="avatar-placeholder">
                                    <i className="fas fa-user"></i>
                                </div>
                            )}
                        </div>
                        <input
                            type="file"
                            id="avatar"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="avatar-input"
                        />
                        <label htmlFor="avatar" className="avatar-label">
                            Choose Profile Picture
                        </label>
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label" htmlFor="fullName">Full Name</label>
                        <input
                            id="fullName"
                            name="fullName"
                            type="text"
                            required
                            className="form-input"
                            placeholder="Enter your full name"
                            value={formData.fullName}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="username">Username</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            required
                            className="form-input"
                            placeholder="Choose a username"
                            value={formData.username}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="email">Email address</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="form-input"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="form-input"
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        {passwordStrength && (
                            <div className="password-strength">
                                <div className={`strength-${passwordStrength}`}></div>
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            required
                            className="form-input"
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="submit-button"
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>

                    <div className="form-footer">
                        Already have an account? <Link to="/login">Sign in</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register; 