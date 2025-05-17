import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistance } from 'date-fns';
import '../styles/RecommendedVideos.css';

const RecommendedVideos = ({ videos, currentVideoId }) => {
  // Filter out the current video from recommendations
  const filteredVideos = videos.filter(video => video._id !== currentVideoId);

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
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

  return (
    <div className="recommended-videos">
      <h3 className="recommended-title">Recommended videos</h3>
      
      <div className="recommended-list">
        {filteredVideos.map(video => (
          <Link 
            to={`/watch/${video._id}`} 
            key={video._id} 
            className="recommended-video"
          >
            <div className="thumbnail-container">
              <img 
                src={video.thumbnail} 
                alt={video.title}
                className="video-thumbnail" 
              />
              <span className="video-duration">
                {formatDuration(video.duration)}
              </span>
            </div>

            <div className="video-details">
              <h4 className="video-title">{video.title}</h4>
              
              <Link 
                to={`/channel/${video.channel.username}`}
                className="channel-name"
                onClick={(e) => e.stopPropagation()}
              >
                {video.channel.name}
              </Link>

              <div className="video-meta">
                <span>{formatViews(video.views)}</span>
                <span>•</span>
                <span>
                  {formatDistance(new Date(video.createdAt), new Date(), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecommendedVideos; 