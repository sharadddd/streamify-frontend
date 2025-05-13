import React, { useState } from 'react';
import { createTweet } from '../services/apiService'; // Assuming createTweet is in apiService.js

const CreateTweetForm = ({ onSuccess }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createTweet({ content });
      setContent('');
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError('Failed to create tweet. Please try again.');
      console.error('Error creating tweet:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Create a New Tweet</h3>
      <div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          rows="4"
          cols="50"
          required
        />
      </div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Posting...' : 'Tweet'}
      </button>
    </form>
  );
};

export default CreateTweetForm;