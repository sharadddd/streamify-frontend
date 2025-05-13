import React from 'react';
import './../styles/VideoCard.css';

const VideoCard = ({ video }) => {
  return (
    <div className="video-card">
      <img src={video.thumbnail} alt={video.title} />
      <div className="video-content">
        <h3 className="video-title">{video.title}</h3>
        <p className="video-description">
          {video.description}
        </p>
        <div className="video-info">
          <span>Views: {video.views}</span>
          <span>Duration: {video.duration}</span>
        </div>
      </div>

      {/* Add more video information as needed */}
    </div>
  );
};

export default VideoCard;