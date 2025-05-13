import React, { useState } from 'react';
import { toggleTweetLike, updateTweet, deleteTweet } from '../services/apiService'; // Assuming these are in apiService
import { useAuth } from '../contexts/AuthContext'; // Assuming you have an AuthContext
import '../styles/Tweet.css'; // Import CSS for styling and animations

const Tweet = ({ tweet }) => {
  const [currentLikes, setCurrentLikes] = useState(tweet.likes);
  const [isLiked, setIsLiked] = useState(tweet.isLikedByUser); // Assuming your tweet object has this property
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(tweet.content);

  const { user } = useAuth();
  const isAuthor = user && tweet.owner === user._id; // Assuming user object has _id and tweet has owner

  const handleLikeToggle = async () => {
    try {
      const response = await toggleTweetLike(tweet._id);
      setCurrentLikes(response.data.likes); // Assuming your API returns the new like count
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await updateTweet(tweet._id, { content: editedContent });
      console.log('Tweet updated:', response.data); // Handle success (e.g., show a message)
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating tweet:', error);
      // Handle error (e.g., show an error message)
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this tweet?')) {
      try {
        await deleteTweet(tweet._id);
        console.log('Tweet deleted'); // Handle success (e.g., remove the tweet from the list)
      } catch (error) {
        console.error('Error deleting tweet:', error);
        // Handle error
      }
    }
  };

  return (
    <div className="tweet-container">
      <div className="tweet-header">
        <img src={tweet.author?.avatar} alt={`${tweet.author?.username}'s avatar`} className="tweet-avatar" />
        <div className="tweet-owner-info">
          <span className="tweet-owner-name">{tweet.ownerDetails?.fullName}</span>
          <span className="tweet-author-username">@{tweet.author?.username}</span>
        </div>
      </div>
      <div className="tweet-content">
        {isEditing ? (
          <textarea value={editedContent} onChange={(e) => setEditedContent(e.target.value)} />
        ) : (
          <p>{tweet.content}</p>
        )}
      </div>
      <div className="tweet-actions">
        <button
 className={`tweet-action-button like-button ${isLiked ? 'liked' : ''}`}
 onClick={handleLikeToggle}
 >
          <i className={`fa-heart ${isLiked ? 'fas' : 'far'}`}></i> Like ({currentLikes})
        </button>
        {isAuthor && (
          <>
            {isEditing ? (
              <button
 className="tweet-action-button save-button"
 onClick={handleUpdate}
 >
                <i className="fas fa-save"></i> Save
              </button>
            ) : (
              <button className="tweet-action-button update-button" onClick={() => setIsEditing(true)}>
                <i className="fas fa-edit"></i> Update
              </button>
            )}
            <button className="tweet-action-button delete-button" onClick={handleDelete}>Delete</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Tweet;