import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/VideoCard.css';

const VideoCard = ({ video }) => {
    const [isHovering, setIsHovering] = useState(false);
    const [showAd, setShowAd] = useState(false);
    const [muted, setMuted] = useState(true);
    const [progress, setProgress] = useState(0);
    const [volumeLevel, setVolumeLevel] = useState(1);
    const [showVolumeSlider, setShowVolumeSlider] = useState(false);
    const [quality, setQuality] = useState('HD');
    
    const videoRef = useRef(null);
    const progressInterval = useRef(null);

    const handleVideoHover = (hovering) => {
        const videoElement = videoRef.current;
        if (videoElement) {
            setIsHovering(hovering);
            if (hovering) {
                videoElement.style.display = 'block';
                setShowAd(false);
                videoElement.play().catch(error => console.log('Autoplay prevented:', error));

                progressInterval.current = setInterval(() => {
                    const progress = (videoElement.currentTime / videoElement.duration) * 100;
                    setProgress(progress);
                }, 100);
            } else {
                videoElement.style.display = 'none';
                videoElement.pause();
                videoElement.currentTime = 0;
                setShowVolumeSlider(false);
                setShowAd(true);

                if (progressInterval.current) {
                    clearInterval(progressInterval.current);
                    progressInterval.current = null;
                }
                setProgress(0);
            }
        }
    };

    useEffect(() => {
        return () => {
            if (progressInterval.current) {
                clearInterval(progressInterval.current);
            }
        };
    }, []);

    const toggleMute = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const videoElement = videoRef.current;
        if (videoElement) {
            const newMutedState = !muted;
            videoElement.muted = newMutedState;
            if (!newMutedState) {
                videoElement.volume = volumeLevel;
            }
            setMuted(newMutedState);
        }
    };

    const handleVolumeChange = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const value = parseFloat(e.target.value);
        const videoElement = videoRef.current;
        if (videoElement) {
            videoElement.volume = value;
            videoElement.muted = value === 0;
            setVolumeLevel(value);
            setMuted(value === 0);
        }
    };

    const handleProgressClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const progressBar = e.currentTarget;
        const rect = progressBar.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = (x / rect.width) * 100;

        const videoElement = videoRef.current;
        if (videoElement) {
            const newTime = (percentage / 100) * videoElement.duration;
            videoElement.currentTime = newTime;
        }
    };

    const toggleQuality = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setQuality(prev => prev === 'HD' ? 'SD' : 'HD');
    };

    const formatDuration = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const formatViews = (views) => {
        if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M views`;
        if (views >= 1000) return `${(views / 1000).toFixed(1)}K views`;
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

    return (
        <Link
            to={`/watch/${video._id}`}
            className={`video-card ${isHovering ? 'is-hovering' : ''}`}
            onMouseEnter={() => handleVideoHover(true)}
            onMouseLeave={() => handleVideoHover(false)}
        >
            <div className="thumbnail-container">
                <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="video-thumbnail"
                    loading="lazy"
                />
                {showAd && (
                    <div className="ad-overlay">
                        <img 
                            src="https://via.placeholder.com/400x225?text=Advertisement" 
                            alt="Advertisement" 
                            className="ad-image"
                        />
                        <span className="ad-badge">Ad</span>
                    </div>
                )}
                <video
                    ref={videoRef}
                    src={video.videoUrl}
                    className="video-preview"
                    muted={muted}
                    playsInline
                    loop
                    preload="metadata"
                />
                <div className="video-overlay">
                    <div className="video-controls">
                        <div className="controls-left">
                            <div className="volume-control">
                                <button
                                    className="mute-toggle"
                                    onClick={toggleMute}
                                    onMouseEnter={() => setShowVolumeSlider(true)}
                                >
                                    {muted ? (
                                        <span className="material-icons">volume_off</span>
                                    ) : volumeLevel < 0.5 ? (
                                        <span className="material-icons">volume_down</span>
                                    ) : (
                                        <span className="material-icons">volume_up</span>
                                    )}
                                </button>
                                <div
                                    className={`volume-slider-container ${showVolumeSlider ? 'show' : ''}`}
                                    onMouseLeave={() => setShowVolumeSlider(false)}
                                >
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.1"
                                        value={volumeLevel}
                                        onChange={handleVolumeChange}
                                        className="volume-slider"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="controls-right">
                            <button
                                className="quality-toggle"
                                onClick={toggleQuality}
                            >
                                {quality}
                            </button>
                        </div>
                    </div>
                    <div
                        className="video-progress"
                        onClick={handleProgressClick}
                    >
                        <div className="progress-bar-bg">
                            <div
                                className="progress-bar"
                                style={{ width: `${progress}%` }}
                            >
                                <div className="progress-handle"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <span className="video-duration">{formatDuration(video.duration)}</span>
                <div className="video-badges">
                    {video.category === 'tech' && (
                        <span className="badge tech">Tech</span>
                    )}
                    {quality === 'HD' && (
                        <span className="badge hd">HD</span>
                    )}
                </div>
            </div>
            <div className="video-info">
                <div className="channel-avatar">
                    <img src={video.channel.avatar} alt={video.channel.name} loading="lazy" />
                </div>
                <div className="video-details">
                    <h3 className="video-title">{video.title}</h3>
                    <Link
                        to={`/channel/${video.channel.username}`}
                        className="channel-name"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {video.channel.name}
                        {video.channel.verified && (
                            <span className="verified-badge" title="Verified Channel">✓</span>
                        )}
                    </Link>
                    <div className="video-meta">
                        <span>{formatViews(video.views)}</span>
                        <span className="meta-separator">•</span>
                        <span>{formatDate(video.createdAt)}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default VideoCard;