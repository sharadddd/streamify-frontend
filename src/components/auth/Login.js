import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/apiService';
import '../../styles/LoginPage.css';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    // Check for existing token on component mount
    useEffect(() => {
        const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
        if (token) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (error) setError('');
    };

    const validateForm = () => {
        // Trim the email to ensure no whitespace
        const trimmedEmail = formData.email.trim();

        if (!trimmedEmail) {
            setError('Email is required');
            return false;
        }
        if (!formData.password) {
            setError('Password is required');
            return false;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmedEmail)) {
            setError('Please enter a valid email address');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Form validation
        if (!validateForm()) {
            return;
        }

        setError('');
        setLoading(true);

        try {
            // Store remember me preference
            localStorage.setItem('rememberMe', rememberMe);

            // Prepare login data
            const loginData = {
                email: formData.email.trim(),
                password: formData.password // Don't modify the password
            };

            const response = await loginUser(loginData);

            if (!response || !response.accessToken) {
                throw new Error('Invalid response from server');
            }

            // Store user data based on remember me preference
            const storage = rememberMe ? localStorage : sessionStorage;
            if (response.user) {
                storage.setItem('user', JSON.stringify(response.user));
            }

            // Clear any existing errors
            setError('');

            // Redirect to dashboard
            navigate('/dashboard');
        } catch (err) {
            console.error('Login error:', err);
            // Handle different types of errors
            if (err.response?.status === 401) {
                setError('Invalid email or password');
            } else if (err.response?.status === 429) {
                setError('Too many attempts. Please try again later');
            } else if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else if (!navigator.onLine) {
                setError('No internet connection. Please check your network');
            } else {
                setError('An error occurred. Please try again later');
            }

            // Clear any existing tokens on error
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            sessionStorage.removeItem('accessToken');
            sessionStorage.removeItem('user');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-form-container">
                <div className="login-header">
                    <h1>Welcome back</h1>
                    <p>Sign in to continue to Streamify</p>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    {error && (
                        <div className="error-message" role="alert">
                            <i className="fas fa-exclamation-circle"></i>
                            {error}
                        </div>
                    )}

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
                            disabled={loading}
                            aria-invalid={error && !formData.email ? 'true' : 'false'}
                            autoComplete="email"
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
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={loading}
                            aria-invalid={error && !formData.password ? 'true' : 'false'}
                            autoComplete="current-password"
                        />
                        <div className="forgot-password">
                            <Link to="/forgot-password">Forgot password?</Link>
                        </div>
                    </div>

                    <div className="remember-me">
                        <input
                            type="checkbox"
                            id="remember-me"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            disabled={loading}
                        />
                        <label htmlFor="remember-me">Remember me</label>
                    </div>

                    <button
                        type="submit"
                        className="submit-button"
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : 'Sign in'}
                    </button>

                    <div className="form-footer">
                        Don't have an account? <Link to="/register">Sign up</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login; 