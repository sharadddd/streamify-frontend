import React, { useState, useEffect, useCallback } from 'react';
import { searchVideos, getAllVideos } from '../services/apiService';
import '../styles/videoDiscovery.css';

const CATEGORIES = [
    'all',
    'music',
    'gaming',
    'education',
    'entertainment',
    'sports',
    'technology',
    'other'
];

const SORT_OPTIONS = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'views', label: 'Most Viewed' },
    { value: 'likes', label: 'Most Liked' }
];

const VideoDiscovery = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('recent');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [recommendations, setRecommendations] = useState([]);

    // Debounce search query
    const debounce = (func, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    };

    const fetchVideos = useCallback(async (isNewSearch = false) => {
        try {
            setLoading(true);
            setError(null);

            const currentPage = isNewSearch ? 1 : page;
            let response;

            if (searchQuery) {
                response = await searchVideos({
                    query: searchQuery,
                    category: selectedCategory !== 'all' ? selectedCategory : undefined,
                    sortBy,
                    page: currentPage
                });
            } else {
                response = await getAllVideos({
                    category: selectedCategory !== 'all' ? selectedCategory : undefined,
                    sortBy,
                    page: currentPage
                });
            }

            const newVideos = response.data.videos;
            setVideos(prevVideos => isNewSearch ? newVideos : [...prevVideos, ...newVideos]);
            setHasMore(newVideos.length === 10); // Assuming 10 is the page size
            setPage(currentPage + 1);

        } catch (err) {
            setError(err.message || 'Error fetching videos');
        } finally {
            setLoading(false);
        }
    }, [searchQuery, selectedCategory, sortBy, page]);

    // Handle search input change with debounce
    const handleSearchChange = debounce((value) => {
        setSearchQuery(value);
        setPage(1);
        fetchVideos(true);
    }, 500);

    // Handle category change
    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setPage(1);
        fetchVideos(true);
    };

    // Handle sort change
    const handleSortChange = (sort) => {
        setSortBy(sort);
        setPage(1);
        fetchVideos(true);
    };

    // Load more videos
    const handleLoadMore = () => {
        if (!loading && hasMore) {
            fetchVideos();
        }
    };

    // Initial load
    useEffect(() => {
        fetchVideos(true);
    }, []);

    // Fetch recommendations based on user's viewing history
    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                // TODO: Implement recommendation API
                // const response = await getRecommendedVideos();
                // setRecommendations(response.data.videos);
            } catch (err) {
                console.error('Error fetching recommendations:', err);
            }
        };

        fetchRecommendations();
    }, []);

    return (
        <div className="video-discovery">
            {/* Search Section */}
            <div className="search-section">
                <input
                    type="text"
                    placeholder="Search videos..."
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="search-input"
                />
            </div>

            {/* Filters Section */}
            <div className="filters-section">
                <div className="categories">
                    {CATEGORIES.map(category => (
                        <button
                            key={category}
                            className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                            onClick={() => handleCategoryChange(category)}
                        >
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                        </button>
                    ))}
                </div>

                <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="sort-select"
                >
                    {SORT_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Recommendations Section */}
            {recommendations.length > 0 && !searchQuery && (
                <div className="recommendations-section">
                    <h2>Recommended for you</h2>
                    <div className="video-grid">
                        {recommendations.map(video => (
                            <VideoCard key={video._id} video={video} />
                        ))}
                    </div>
                </div>
            )}

            {/* Videos Grid */}
            {error ? (
                <div className="error-message">{error}</div>
            ) : (
                <div className="video-grid">
                    {videos.map(video => (
                        <VideoCard key={video._id} video={video} />
                    ))}
                </div>
            )}

            {/* Load More */}
            {hasMore && (
                <button
                    className={`load-more-btn ${loading ? 'loading' : ''}`}
                    onClick={handleLoadMore}
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Load More'}
                </button>
            )}
        </div>
    );
};

// VideoCard Component
const VideoCard = ({ video }) => {
    return (
        <div className="video-card">
            <div className="thumbnail">
                <img src={video.thumbnail} alt={video.title} />
                <span className="duration">{formatDuration(video.duration)}</span>
            </div>
            <div className="video-info">
                <h3 className="title">{video.title}</h3>
                <p className="channel">{video.owner.username}</p>
                <div className="meta">
                    <span>{formatViews(video.views)} views</span>
                    <span>•</span>
                    <span>{formatTimeAgo(video.createdAt)}</span>
                </div>
            </div>
        </div>
    );
};

// Utility functions
const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const formatViews = (views) => {
    if (views >= 1000000) {
        return `${(views / 1000000).toFixed(1)}M`;
    }
    if (views >= 1000) {
        return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
};

const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        if (interval >= 1) {
            return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
        }
    }
    return 'Just now';
};

export default VideoDiscovery; 