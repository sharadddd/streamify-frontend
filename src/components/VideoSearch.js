import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/VideoSearch.css';

const VideoSearch = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    duration: '',
    date: '',
    quality: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    'All', 'Music', 'Gaming', 'Education', 
    'Entertainment', 'Sports', 'Technology', 'News'
  ];

  const durations = [
    { label: 'Any length', value: '' },
    { label: 'Under 4 minutes', value: 'short' },
    { label: '4-20 minutes', value: 'medium' },
    { label: 'Over 20 minutes', value: 'long' }
  ];

  const dates = [
    { label: 'Any time', value: '' },
    { label: 'Today', value: 'today' },
    { label: 'This week', value: 'week' },
    { label: 'This month', value: 'month' },
    { label: 'This year', value: 'year' }
  ];

  const qualities = [
    { label: 'Any quality', value: '' },
    { label: '4K', value: '4k' },
    { label: '1080p', value: '1080p' },
    { label: '720p', value: '720p' },
    { label: '480p', value: '480p' }
  ];

  useEffect(() => {
    // Load recent searches from localStorage
    const loadRecentSearches = () => {
      const saved = localStorage.getItem('recentSearches');
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    };

    loadRecentSearches();
  }, []);

  useEffect(() => {
    // Parse search params from URL
    const params = new URLSearchParams(location.search);
    const term = params.get('q') || '';
    setSearchTerm(term);
    
    // Set filters from URL params
    setFilters({
      category: params.get('category') || '',
      duration: params.get('duration') || '',
      date: params.get('date') || '',
      quality: params.get('quality') || ''
    });
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    // Save to recent searches
    const updatedSearches = [
      searchTerm,
      ...recentSearches.filter(s => s !== searchTerm)
    ].slice(0, 5);
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));

    // Build search URL with filters
    const params = new URLSearchParams();
    params.set('q', searchTerm);
    if (filters.category) params.set('category', filters.category);
    if (filters.duration) params.set('duration', filters.duration);
    if (filters.date) params.set('date', filters.date);
    if (filters.quality) params.set('quality', filters.quality);

    // Navigate to search results
    navigate(`/search?${params.toString()}`);
  };

  const handleFilterChange = (type, value) => {
    setFilters(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      duration: '',
      date: '',
      quality: ''
    });
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-wrapper">
          <input
            ref={searchRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search videos..."
            className="search-input"
          />
          {searchTerm && (
            <button
              type="button"
              className="clear-search"
              onClick={() => setSearchTerm('')}
            >
              ×
            </button>
          )}
          <button type="submit" className="search-button">
            🔍
          </button>
        </div>

        <button
          type="button"
          className={`filter-toggle ${showFilters ? 'active' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          Filters
        </button>

        {showFilters && (
          <div className="filters-panel">
            <div className="filter-group">
              <label>Category</label>
              <div className="category-pills">
                {categories.map(category => (
                  <button
                    key={category}
                    type="button"
                    className={`category-pill ${
                      filters.category === category ? 'active' : ''
                    }`}
                    onClick={() => handleFilterChange('category', category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <label>Duration</label>
              <select
                value={filters.duration}
                onChange={(e) => handleFilterChange('duration', e.target.value)}
              >
                {durations.map(({ label, value }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Upload Date</label>
              <select
                value={filters.date}
                onChange={(e) => handleFilterChange('date', e.target.value)}
              >
                {dates.map(({ label, value }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Quality</label>
              <select
                value={filters.quality}
                onChange={(e) => handleFilterChange('quality', e.target.value)}
              >
                {qualities.map(({ label, value }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              className="clear-filters"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div>
        )}

        {searchTerm && suggestions.length > 0 && (
          <div className="suggestions-panel">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                className="suggestion-item"
                onClick={() => setSearchTerm(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {!searchTerm && recentSearches.length > 0 && (
          <div className="recent-searches">
            <h4>Recent Searches</h4>
            {recentSearches.map((term, index) => (
              <button
                key={index}
                type="button"
                className="recent-search-item"
                onClick={() => setSearchTerm(term)}
              >
                {term}
              </button>
            ))}
          </div>
        )}
      </form>
    </div>
  );
};

export default VideoSearch; 