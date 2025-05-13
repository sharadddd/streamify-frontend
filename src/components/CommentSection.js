import React, { useState, useEffect } from 'react';
import { addCommentToVideo, toggleCommentLike } from '../services/apiService';

const CommentSection = ({ comments, videoId }) => {
 const [newComment, setNewComment] = useState('');
 const [likedComments, setLikedComments] = useState({}); // State to track liked comments

  // Initialize likedComments state based on initial comments prop
  // Using useEffect for side effects like initializing state from props
  useEffect(() => {
    const initialLikedState = {};
    if (comments) {
      comments.forEach(comment => {
        initialLikedState[comment._id] = comment.isLiked; // Assuming comment object has an isLiked property
      });
    }
    setLikedComments(initialLikedState);
  }, [comments]);

 const handleInputChange = (event) => {
 setNewComment(event.target.value);
  };

 const handleAddComment = async (event) => {
 event.preventDefault();
 if (newComment.trim() === '') {
 return; // Don't add empty comments
    }

    try {
      // Assuming addComment requires videoId and comment content
      await addComment(videoId, { content: newComment });
      setNewComment(''); // Corrected to match the function name
      // You might want to refresh comments after adding a new one
      // This would likely involve calling a function passed down from the parent
 console.log('Comment added successfully');
    } catch (error) {
      console.error('Error adding comment:', error);
      // Handle error (e.g., display an error message to the user)
    }
  };

 const handleToggleCommentLike = async (commentId) => {
    try {
      await toggleCommentLike(commentId);
      // Update likedComments state based on successful API call
      setLikedComments(prevLikedComments => {
        const newState = {
          ...prevLikedComments,
          [commentId]: !prevLikedComments[commentId] // Toggle like status
        };
        // Optional: You might also want to update the like count in the comments array
        // find the comment and update its likeCount based on the toggle
        return newState;
      });
      console.log(`Like status toggled for comment ${commentId}`);
    } catch (error) {
      console.error(`Error toggling like status for comment ${commentId}:`, error);
      // Handle error
    }
  };

  // Basic animation styles for comments
 const commentAnimation = {
    opacity: 1,
    transform: 'translateY(0)',
 transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
  };

  return (
    <div>
      <h3>Comments</h3>
      <form onSubmit={handleAddComment}>
        <textarea
          value={newComment}
 onChange={handleInputChange}
          placeholder="Add a comment..."
 className="comment-textarea" // Add a class for styling
        />
        <button type="submit" className="add-comment-button">Add Comment</button> {/* Add a class for styling */}
      </form>
      <div className="comments-list"> {/* Add a container for the list */}
        {comments && comments.length > 0 ? (
          <ul className="comment-items"> {/* Add a class for styling */}
          {comments.map((comment) => (
            <li
              key={comment._id}
              className="comment-item" // Add a class for styling
              style={{ opacity: 0, transform: 'translateY(20px)', ...commentAnimation }} // Initial state for animation
            >
              <div className="comment-author"> {/* Add author info */}
                {/* Placeholder for author avatar and username */}
                <span className="author-name">{comment.owner?.username || 'Unknown User'}</span> {/* Assuming comment has owner object with username */}
              </div>
              <p className="comment-content">{comment.content}</p>
              <div className="comment-actions"> {/* Container for actions */}
                <span className="like-count">{comment.likesCount || 0}</span> {/* Assuming comment has a likesCount property */}
                <button onClick={() => handleToggleCommentLike(comment._id)}>
                  {likedComments[comment._id] ? 'Unlike' : 'Like'}
                </button>
                {/* Add edit and delete buttons (implement functionality later) */}
                <button>Edit</button>
                <button>Delete</button>
              </div>
            </li>
          ))}
          </ul>
        ) : (
          <p>No comments yet.</p>
        )}
      </div>

      {/* Add some basic CSS for styling and animations */}
 <style>{`
 .comment-textarea {
 width: 100%;
 height: 80px;
 margin-bottom: 10px;
 padding: 10px;
 border: 1px solid #ccc;
 border-radius: 4px;
 transition: border-color 0.3s ease-in-out;
    }
 .comment-textarea:focus {
 border-color: #007bff; /* Example focus color */
 outline: none;
    }
 .add-comment-button {
      padding: 10px 15px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
 transition: background-color 0.3s ease-in-out;
    }
 .add-comment-button:hover {
      background-color: #0056b3;
    }
 .comments-list {
      margin-top: 20px;
    }
 .comment-items {
 list-style: none;
      padding: 0;
    }
 .comment-item {
      border: 1px solid #eee;
      padding: 10px;
      margin-bottom: 10px;
 border-radius: 4px;
    }
 .comment-author {
      font-weight: bold;
      margin-bottom: 5px;
    }
 .comment-content {
      margin-bottom: 5px;
    }
 .comment-actions button {
      margin-right: 5px;
 cursor: pointer;
    }
 `}</style>
    </div>
  );
};

export default CommentSection;