import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistance } from 'date-fns';
import { 
  toggleVideoLike, 
  toggleSubscription 
} from '../services/apiService';
import '../styles/VideoInfo.css';

const VideoInfo = ({ video }) => {
  const [isLiked, setIsLiked] = useState(video.isLiked);
  const [likeCount, setLikeCount] = useState(video.likes);
  const [isSubscribed, setIsSubscribed] = useState(video.channel.isSubscribed);
  const [subscriberCount, setSubscriberCount] = useState(
    video.channel.subscriberCount
  );
  const [showDescription, setShowDescription] = useState(false);

  const handleLikeClick = async () => {
    try {
      const response = await toggleVideoLike(video._id);
      setIsLiked(response.isLiked);
      setLikeCount(response.likeCount);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleSubscribe = async () => {
    try {
      const response = await toggleSubscription(video.channel._id);
      setIsSubscribed(response.isSubscribed);
      setSubscriberCount(response.subscriberCount);
    } catch (error) {
      console.error('Error toggling subscription:', error);
    }
  };

  return (
    <div className="video-info">
      <h1 className="video-title">{video.title}</h1>
      
      <div className="video-stats">
        <div className="video-meta">
          <span>{video.views.toLocaleString()} views</span>
          <span>•</span>
          <span>
            {formatDistance(new Date(video.createdAt), new Date(), {
              addSuffix: true,
            })}
          </span>
        </div>

        <div className="video-actions">
          <button 
            className={`like-button ${isLiked ? 'active' : ''}`}
            onClick={handleLikeClick}
          >
            <span className="like-icon">👍</span>
            <span>{likeCount.toLocaleString()}</span>
          </button>
          
          <button className="share-button">
            <span className="share-icon">↗️</span>
            <span>Share</span>
          </button>
        </div>
      </div>

      <div className="channel-info">
        <Link to={`/channel/${video.channel.username}`} className="channel-link">
          <img 
            src={video.channel.avatar} 
            alt={video.channel.name} 
            className="channel-avatar"
          />
          <div className="channel-details">
            <h3 className="channel-name">{video.channel.name}</h3>
            <p className="subscriber-count">
              {subscriberCount.toLocaleString()} subscribers
            </p>
          </div>
        </Link>

        <button 
          className={`subscribe-button ${isSubscribed ? 'subscribed' : ''}`}
          onClick={handleSubscribe}
        >
          {isSubscribed ? 'Subscribed' : 'Subscribe'}
        </button>
      </div>

      <div className="video-description">
        <div className={`description-content ${showDescription ? 'expanded' : ''}`}>
          {video.description}
        </div>
        {video.description.length > 200 && (
          <button 
            className="show-more-button"
            onClick={() => setShowDescription(!showDescription)}
          >
            {showDescription ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>
    </div>
  );
};

export default VideoInfo; 