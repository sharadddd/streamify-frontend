import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import VideoPreview from './VideoPreview';
import { fetchVideos } from '../services/apiService';
import '../styles/VideoGrid.css';

const VideoGrid = ({ filters = {}, initialVideos = [], columns = 4 }) => {
    const [videos, setVideos] = useState(initialVideos);

    const loadMoreVideos = useCallback(async (page) => {
        const response = await fetchVideos({
            ...filters,
            page,
            limit: 12
        });

        setVideos(prev => [...prev, ...response.videos]);

        return {
            items: response.videos,
            hasMore: response.hasMore
        };
    }, [filters]);

    const { targetRef, loading, error } = useInfiniteScroll(loadMoreVideos, {
        enabled: true,
        initialPage: 1
    });

    return (
        <div className={`video-grid columns-${columns}`}>
            {videos.map(video => (
                <Link
                    key={video._id}
                    to={`/video/${video._id}`}
                    className="video-grid-item"
                >
                    <VideoPreview
                        video={video}
                        thumbnailUrl={video.thumbnail}
                        previewUrl={video.previewUrl}
                    />
                </Link>
            ))}

            {/* Loading indicator */}
            {loading && (
                <div className="loading-indicator">
                    <div className="loading-spinner"></div>
                    <p>Loading more videos...</p>
                </div>
            )}

            {/* Error message */}
            {error && (
                <div className="error-message">
                    <p>{error}</p>
                    <button onClick={() => loadMoreVideos(1)}>Retry</button>
                </div>
            )}

            {/* Intersection observer target */}
            <div ref={targetRef} className="intersection-target" />
        </div>
    );
};

export default VideoGrid; 