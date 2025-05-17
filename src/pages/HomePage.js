import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import VideoCard from '../components/VideoCard';
import '../styles/pages/HomePage.css';

const HomePage = () => {
    const [featuredVideos, setFeaturedVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [mutedStates, setMutedStates] = useState({});
    const [progressStates, setProgressStates] = useState({});
    const [volumeLevels, setVolumeLevels] = useState({});
    const [showVolumeSlider, setShowVolumeSlider] = useState({});
    const [isHovering, setIsHovering] = useState({});
    const [qualityLevels, setQualityLevels] = useState({});
    const [showAd, setShowAd] = useState({});
    const videoRefs = useRef({});
    const progressIntervals = useRef({});

    const categories = [
        'All',
        'Podcasts',
        'Music',
        'Gaming',
        'Sports',
        'News',
        'Comedy',
        'Education',
        'Technology',
        'Entertainment',
        'Travel',
        'Cooking',
        'Fitness',
        'Art',
        'Live'
    ];

    const sampleVideos = useMemo(() => [
        {
            _id: '1',
            title: 'Quick Tips: VS Code Shortcuts',
            thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&auto=format&fit=crop&q=80',
            videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            duration: 25,
            views: 156789,
            category: 'tech',
            createdAt: '2024-03-15T10:30:00Z',
            channel: {
                _id: 'ch1',
                name: 'TechMaster Pro',
                username: 'techmasterpro',
                avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
                verified: true
            }
        },
        {
            _id: '2',
            title: 'React useState Hook in 30 Seconds',
            thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&auto=format&fit=crop&q=80',
            videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            duration: 30,
            views: 98765,
            category: 'tech',
            createdAt: '2024-03-14T15:20:00Z',
            channel: {
                _id: 'ch2',
                name: 'React Ninja',
                username: 'reactninja',
                avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
                verified: true
            }
        },
        {
            _id: '3',
            title: 'Quick Beat Making Tutorial',
            thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80',
            videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            duration: 35,
            views: 234567,
            category: 'music',
            createdAt: '2024-03-13T08:15:00Z',
            channel: {
                _id: 'ch3',
                name: 'Beat Masters',
                username: 'beatmasters',
                avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
                verified: false
            }
        },
        {
            _id: '4',
            title: '15-Second Healthy Breakfast Ideas',
            thumbnail: 'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=1200&auto=format&fit=crop&q=80',
            videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
            duration: 15,
            views: 78901,
            category: 'cooking',
            createdAt: '2024-03-12T12:45:00Z',
            channel: {
                _id: 'ch4',
                name: 'Cooking with Sarah',
                username: 'cookingwithsarah',
                avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
                verified: true
            }
        },
        {
            _id: '5',
            title: 'Digital Art: Quick Sketch Tips',
            thumbnail: 'https://images.unsplash.com/photo-1547333472-4d605a7f4c30?w=1200&auto=format&fit=crop&q=80',
            videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
            duration: 40,
            views: 45678,
            category: 'art',
            createdAt: '2024-03-11T16:30:00Z',
            channel: {
                _id: 'ch5',
                name: 'Art Studio',
                username: 'artstudio',
                avatar: 'https://randomuser.me/api/portraits/women/5.jpg',
                verified: false
            }
        },
        {
            _id: '6',
            title: 'JavaScript Array Methods in 20s',
            thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80',
            videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
            duration: 20,
            views: 123456,
            category: 'tech',
            createdAt: '2024-03-10T09:20:00Z',
            channel: {
                _id: 'ch6',
                name: 'Code Academy',
                username: 'codeacademy',
                avatar: 'https://randomuser.me/api/portraits/men/6.jpg',
                verified: true
            }
        },
        {
            _id: '7',
            title: 'Quick Camera Settings Guide',
            thumbnail: 'https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?w=1200&auto=format&fit=crop&q=80',
            videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
            duration: 28,
            views: 67890,
            category: 'art',
            createdAt: '2024-03-09T14:20:00Z',
            channel: {
                _id: 'ch7',
                name: 'Photo Masters',
                username: 'photomasters',
                avatar: 'https://randomuser.me/api/portraits/men/7.jpg',
                verified: false
            }
        },
        {
            _id: '8',
            title: '30-Second Core Workout',
            thumbnail: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&auto=format&fit=crop&q=80',
            videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
            duration: 30,
            views: 89012,
            category: 'fitness',
            createdAt: '2024-03-08T11:15:00Z',
            channel: {
                _id: 'ch8',
                name: 'FitLife',
                username: 'fitlife',
                avatar: 'https://randomuser.me/api/portraits/women/8.jpg',
                verified: true
            }
        }
    ], []);

    useEffect(() => {
        const intervals = progressIntervals.current;
        // Set featured videos from sampleVideos array
        setFeaturedVideos(sampleVideos);
        setLoading(false);

        return () => {
            // Clear all intervals in the object
            if (intervals && typeof intervals === 'object') {
                Object.values(intervals).forEach(interval => {
                    if (interval) clearInterval(interval);
                });
            }
        };
    }, [sampleVideos]);

    const handleVideoHover = (videoId, isHovering) => {
        const videoElement = videoRefs.current[videoId];
        if (videoElement) {
            setIsHovering(prev => ({ ...prev, [videoId]: isHovering }));
            if (isHovering) {
                videoElement.style.display = 'block';
                setShowAd(prev => ({ ...prev, [videoId]: false }));
                videoElement.play().catch(error => console.log('Autoplay prevented:', error));

                // Start progress tracking
                progressIntervals.current[videoId] = setInterval(() => {
                    const progress = (videoElement.currentTime / videoElement.duration) * 100;
                    setProgressStates(prev => ({
                        ...prev,
                        [videoId]: progress
                    }));
                }, 100);
            } else {
                videoElement.style.display = 'none';
                videoElement.pause();
                videoElement.currentTime = 0;
                setShowVolumeSlider(prev => ({ ...prev, [videoId]: false }));
                setShowAd(prev => ({ ...prev, [videoId]: true }));

                // Clear interval and reset progress
                if (progressIntervals.current[videoId]) {
                    clearInterval(progressIntervals.current[videoId]);
                    delete progressIntervals.current[videoId];
                }
                setProgressStates(prev => ({
                    ...prev,
                    [videoId]: 0
                }));
            }
        }
    };

    const toggleMute = (e, videoId) => {
        e.preventDefault();
        e.stopPropagation();

        const videoElement = videoRefs.current[videoId];
        if (videoElement) {
            const newMutedState = !videoElement.muted;
            videoElement.muted = newMutedState;
            if (!newMutedState) {
                videoElement.volume = volumeLevels[videoId];
            }
            setMutedStates(prev => ({
                ...prev,
                [videoId]: newMutedState
            }));
        }
    };

    const handleVolumeChange = (e, videoId) => {
        e.preventDefault();
        e.stopPropagation();

        const value = parseFloat(e.target.value);
        const videoElement = videoRefs.current[videoId];
        if (videoElement) {
            videoElement.volume = value;
            videoElement.muted = value === 0;
            setVolumeLevels(prev => ({ ...prev, [videoId]: value }));
            setMutedStates(prev => ({ ...prev, [videoId]: value === 0 }));
        }
    };

    const handleProgressClick = (e, videoId) => {
        e.preventDefault();
        e.stopPropagation();

        const progressBar = e.currentTarget;
        const rect = progressBar.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = (x / rect.width) * 100;

        const videoElement = videoRefs.current[videoId];
        if (videoElement) {
            const newTime = (percentage / 100) * videoElement.duration;
            videoElement.currentTime = newTime;
        }
    };

    const toggleQuality = (e, videoId) => {
        e.preventDefault();
        e.stopPropagation();

        setQualityLevels(prev => ({
            ...prev,
            [videoId]: prev[videoId] === 'HD' ? 'SD' : 'HD'
        }));
    };

    const filteredVideos = selectedCategory === 'All'
        ? featuredVideos
        : featuredVideos.filter(video => video.category === selectedCategory.toLowerCase());

    const formatDuration = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const formatViews = (views) => {
        if (views >= 1000000) {
            return `${(views / 1000000).toFixed(1)}M views`;
        }
        if (views >= 1000) {
            return `${(views / 1000).toFixed(1)}K views`;
        }
        return `${views} views`;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return 'Yesterday';
        if (diffDays <= 7) return `${diffDays} days ago`;
        if (diffDays <= 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        if (diffDays <= 365) return `${Math.floor(diffDays / 30)} months ago`;
        return `${Math.floor(diffDays / 365)} years ago`;
    };

    const formatTime = (seconds) => {
        if (!seconds) return '0:00';
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="home-page">
            <div className="category-section">
                <div className="category-list">
                    {categories.map((category) => (
                        <button
                            key={category}
                            className={`category-chip ${selectedCategory === category ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="loading-skeleton">
                    {[...Array(8)].map((_, index) => (
                        <div key={index} className="skeleton-card">
                            <div className="skeleton-thumbnail"></div>
                            <div className="skeleton-details">
                                <div className="skeleton-avatar"></div>
                                <div className="skeleton-text">
                                    <div className="skeleton-title"></div>
                                    <div className="skeleton-info"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="videos-grid">
                    {filteredVideos.map(video => (
                        <VideoCard key={video._id} video={video} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default HomePage;