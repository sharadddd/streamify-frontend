import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getVideoById, getVideoComments, addCommentToVideo, toggleVideoLike } from '../services/apiService';
import '../styles/pages/videoPlayback.css';

const VideoPlaybackPage = () => {
    const { videoId } = useParams();
    const [video, setVideo] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newComment, setNewComment] = useState('');
    const [isLiked, setIsLiked] = useState(false);
    const [selectedQuality, setSelectedQuality] = useState('auto');

    useEffect(() => {
        const fetchVideoData = async () => {
            try {
                setLoading(true);
                const [videoResponse, commentsResponse] = await Promise.all([
                    getVideoById(videoId),
                    getVideoComments(videoId)
                ]);

                setVideo(videoResponse.data);
                setComments(commentsResponse.data.comments);
                setIsLiked(videoResponse.data.isLiked);

                // Auto-select best quality based on network
                const qualities = videoResponse.data.videoQualities;
                if (qualities && qualities.length > 0) {
                    setSelectedQuality(qualities[qualities.length - 1].quality);
                }
            } catch (err) {
                setError(err.message || 'Error loading video');
                console.error('Error fetching video:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchVideoData();
    }, [videoId]);

    const handleQualityChange = (quality) => {
        setSelectedQuality(quality);
    };

    const handleLikeClick = async () => {
        try {
            const response = await toggleVideoLike(videoId);
            setIsLiked(response.data.isLiked);
            setVideo(prev => ({
                ...prev,
                likes: response.data.likes
            }));
        } catch (err) {
            console.error('Error toggling like:', err);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const response = await addCommentToVideo(videoId, newComment);
            setComments(prev => [response.data.comment, ...prev]);
            setNewComment('');
        } catch (err) {
            console.error('Error adding comment:', err);
        }
    };

    if (loading) {
        return (
            <div className="video-playback loading">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    if (error || !video) {
        return (
            <div className="video-playback error">
                <div className="error-message">
                    <h2>Oops!</h2>
                    <p>{error || 'Video not found'}</p>
                    <Link to="/" className="back-home">Back to Home</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="video-playback">
            <div className="video-container">
                <div className="video-player">
                    <video
                        controls
                        autoPlay
                        src={video.videoQualities.find(q => q.quality === selectedQuality)?.url}
                        poster={video.thumbnail}
                    >
                        Your browser does not support the video tag.
                    </video>

                    {/* Quality selector */}
                    <div className="quality-selector">
                        <select
                            value={selectedQuality}
                            onChange={(e) => handleQualityChange(e.target.value)}
                        >
                            {video.videoQualities.map(quality => (
                                <option key={quality.quality} value={quality.quality}>
                                    {quality.quality}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="video-info">
                    <h1>{video.title}</h1>

                    <div className="video-stats">
                        <div className="stats-left">
                            <span>{formatViews(video.views)} views</span>
                            <span>•</span>
                            <span>{formatTimeAgo(video.createdAt)}</span>
                        </div>
                        <div className="stats-right">
                            <button
                                className={`like-button ${isLiked ? 'liked' : ''}`}
                                onClick={handleLikeClick}
                            >
                                <i className={`fas fa-thumbs-up ${isLiked ? 'liked' : ''}`}></i>
                                {formatCount(video.likes)}
                            </button>
                            <button className="share-button">
                                <i className="fas fa-share"></i>
                                Share
                            </button>
                        </div>
                    </div>

                    <div className="channel-info">
                        <Link to={`/channel/${video.owner._id}`} className="channel-link">
                            <img
                                src={video.owner.avatar}
                                alt={video.owner.username}
                                className="channel-avatar"
                            />
                            <div className="channel-details">
                                <h3>{video.owner.username}</h3>
                                <p>{formatCount(video.owner.subscribers)} subscribers</p>
                            </div>
                        </Link>
                        <button className="subscribe-button">Subscribe</button>
                    </div>

                    <div className="video-description">
                        <p>{video.description}</p>
                        {video.tags && video.tags.length > 0 && (
                            <div className="video-tags">
                                {video.tags.map(tag => (
                                    <Link key={tag} to={`/search?tag=${tag}`} className="tag">
                                        #{tag}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Comments Section */}
                <div className="comments-section">
                    <h2>{comments.length} Comments</h2>

                    <form onSubmit={handleCommentSubmit} className="comment-form">
                        <input
                            type="text"
                            placeholder="Add a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                        <button type="submit" disabled={!newComment.trim()}>
                            Comment
                        </button>
                    </form>

                    <div className="comments-list">
                        {comments.map(comment => (
                            <div key={comment._id} className="comment">
                                <img
                                    src={comment.user.avatar}
                                    alt={comment.user.username}
                                    className="comment-avatar"
                                />
                                <div className="comment-content">
                                    <div className="comment-header">
                                        <h4>{comment.user.username}</h4>
                                        <span>{formatTimeAgo(comment.createdAt)}</span>
                                    </div>
                                    <p>{comment.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Utility functions
const formatViews = (views) => {
    if (views >= 1000000) {
        return `${(views / 1000000).toFixed(1)}M`;
    }
    if (views >= 1000) {
        return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
};

const formatCount = (count) => {
    if (count >= 1000000) {
        return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
        return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
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

export default VideoPlaybackPage;
