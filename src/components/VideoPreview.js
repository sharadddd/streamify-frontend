import React, { useState, useRef, useEffect } from 'react';
import '../styles/VideoPreview.css';

const VideoPreview = ({ video, previewUrl, thumbnailUrl }) => {
    const [isHovering, setIsHovering] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(true);
    const [isHD, setIsHD] = useState(false);
    const [showVolumeSlider, setShowVolumeSlider] = useState(false);
    const videoRef = useRef(null);
    const timeoutRef = useRef(null);
    const animationFrameRef = useRef(null);
    const hoverTimeoutRef = useRef(null);
    const previousVolumeRef = useRef(0.7);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.addEventListener('loadedmetadata', () => {
                setIsHD(videoRef.current.videoHeight >= 720);
            });
        }

        // Initialize video settings when component mounts
        if (videoRef.current) {
            videoRef.current.volume = volume;
            videoRef.current.muted = isMuted;
        }

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
            if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
        };
    }, []);

    const handleMouseEnter = () => {
        setIsHovering(true);
        if (videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play();
        }
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
        setShowVolumeSlider(false);
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };

    const startTimeUpdate = () => {
        const updateTime = () => {
            if (videoRef.current) {
                setCurrentTime(videoRef.current.currentTime);
                animationFrameRef.current = requestAnimationFrame(updateTime);
            }
        };
        updateTime();
    };

    const toggleMute = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const newMutedState = !isMuted;
        setIsMuted(newMutedState);

        if (videoRef.current) {
            videoRef.current.muted = newMutedState;
        }
    };

    const handleVolumeChange = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);

        if (videoRef.current) {
            videoRef.current.volume = newVolume;
            // If volume is set to 0, mute the video
            if (newVolume === 0) {
                setIsMuted(true);
                videoRef.current.muted = true;
            }
            // If volume is increased from 0, unmute the video
            else if (isMuted) {
                setIsMuted(false);
                videoRef.current.muted = false;
            }
        }
    };

    const handleVolumeMouseEnter = (e) => {
        e.stopPropagation();
        setShowVolumeSlider(true);
    };

    const handleVolumeMouseLeave = (e) => {
        e.stopPropagation();
        setShowVolumeSlider(false);
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
        }
    };

    const formatViews = (views) => {
        if (views >= 1000000) {
            return `${(views / 1000000).toFixed(1)}M`;
        } else if (views >= 1000) {
            return `${(views / 1000).toFixed(1)}K`;
        }
        return views;
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
                return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
            }
        }
        return 'Just now';
    };

    const getVolumeIcon = () => {
        if (isMuted || volume === 0) return '🔇';
        if (volume < 0.3) return '🔈';
        if (volume < 0.7) return '🔉';
        return '🔊';
    };

    return (
        <div
            className="video-preview-container"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="video-preview-wrapper">
                <img
                    src={thumbnailUrl}
                    alt={video.title}
                    className={`video-thumbnail ${isHovering ? 'hidden' : ''}`}
                    loading="lazy"
                />
                {previewUrl && (
                    <video
                        ref={videoRef}
                        src={previewUrl}
                        className={`video-preview ${isHovering ? 'visible' : ''}`}
                        muted={isMuted}
                        playsInline
                        loop
                        onTimeUpdate={handleTimeUpdate}
                    />
                )}

                {/* Video Badges */}
                <div className="video-badges">
                    {isHD && <span className="video-badge hd">HD</span>}
                    {video.isLive && <span className="video-badge live">LIVE</span>}
                </div>

                {/* Volume Control */}
                {isHovering && (
                    <div className="volume-control">
                        <button
                            className="volume-button"
                            onClick={toggleMute}
                            title={isMuted ? "Unmute" : "Mute"}
                        >
                            {getVolumeIcon()}
                        </button>
                        <div className="volume-slider">
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={isMuted ? 0 : volume}
                                onChange={handleVolumeChange}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    </div>
                )}

                {/* Progress Bar */}
                {isHovering && (
                    <div className="preview-progress-bar">
                        <div
                            className="progress"
                            style={{
                                width: `${(currentTime / (video.previewDuration || 10)) * 100}%`
                            }}
                        />
                    </div>
                )}

                {/* Video Info */}
                <div className="video-info-overlay">
                    <h3>{video.title}</h3>
                    <div className="video-meta">
                        <span>{formatViews(video.views)} views</span>
                        <span>•</span>
                        <span>{formatTimeAgo(video.createdAt)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoPreview; 