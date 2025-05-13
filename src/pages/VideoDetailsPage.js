import React, { useEffect, useState, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import {
  getVideoById,
  getVideoComments,
  toggleVideoLike,
  getUserPlaylists,
  addVideoToPlaylist
} from '../services/apiService';
import CommentSection from '../components/CommentSection';
import ChannelSubscribeButton from '../components/ChannelSubscribeButton';
import '../styles/VideoDetailsPage.css';

const VideoDetailsPage = forwardRef((props, ref) => {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [showAddToPlaylistModal, setShowAddToPlaylistModal] = useState(false);
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const videoResponse = await getVideoById(videoId);
        setVideo(videoResponse.data.data);

        const commentsResponse = await getVideoComments(videoId);
        if (commentsResponse.data && Array.isArray(commentsResponse.data.data)) {
          setComments(commentsResponse.data.data);
        } else {
          console.error("Unexpected comments response format:", commentsResponse);
          setComments([]);
        }

        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, [videoId]);

  useEffect(() => {
    if (video && video.isLikedByUser !== undefined) {
      setIsLiked(video.isLikedByUser);
    }
  }, [video]);

  useEffect(() => {
    const fetchUserPlaylists = async () => {
      try {
        const response = await getUserPlaylists(); // Corrected to match your import
        if (response.data && Array.isArray(response.data.data)) {
          setUserPlaylists(response.data.data);
        } else {
          console.error("Unexpected playlists response format:", response);
          setUserPlaylists([]);
        }
      } catch (err) {
        console.error("Error fetching user playlists:", err);
      }
    };

    if (showAddToPlaylistModal) {
      fetchUserPlaylists();
    }
  }, [showAddToPlaylistModal]);

  const handleLikeToggle = async () => {
    try {
      const response = await toggleVideoLike(videoId);
      setIsLiked(response.data.data.isLiked);
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const handleAddToPlaylist = async () => {
    if (!selectedPlaylist) {
      alert('Please select a playlist.');
      return;
    }
    try {
      await addVideoToPlaylist(videoId, selectedPlaylist);
      alert('Video added to playlist!');
      setShowAddToPlaylistModal(false);
      setSelectedPlaylist('');
    } catch (err) {
      console.error("Error adding video to playlist:", err);
      alert('Failed to add video to playlist.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!video) return <div>Video not found.</div>;

  return (
    <div className="video-details-page" ref={ref}> {/* <- ref added here */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="video-title"
      >
        {video.title}
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="video-player-container"
      >
        <video src={video.videoFile} controls width="100%" />
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="video-description"
      >
        {video.description}
      </motion.p>

      <div className="video-actions">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="channel-info"
        >
          <p>Channel: {video.owner.username}</p>
          <ChannelSubscribeButton channelId={video.owner._id} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="action-buttons"
        >
          <button onClick={handleLikeToggle} className="like-button btn-primary">
            {isLiked ? 'Unlike' : 'Like'}
          </button> {/* Apply btn-primary class */}
          <button onClick={() => setShowAddToPlaylistModal(true)} className="add-to-playlist-button">
            Add to Playlist
          </button>
        </motion.div>
      </div>

      {showAddToPlaylistModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="modal-overlay"
        >
          <div className="modal-content">
            <h3>Add Video to Playlist</h3>
            <select onChange={(e) => setSelectedPlaylist(e.target.value)} value={selectedPlaylist}>
              <option value="">Select a playlist</option>
              {userPlaylists.map(playlist => (
                <option key={playlist._id} value={playlist._id}>{playlist.name}</option>
              ))}
            </select> {/* Add consistent form element styles */}
            <button onClick={handleAddToPlaylist} className="btn-primary">Add</button> {/* Apply btn-primary class */}
            <button onClick={() => setShowAddToPlaylistModal(false)}>Cancel</button>
          </div>
        </motion.div>
      )}

      <CommentSection videoId={videoId} comments={comments} setComments={setComments} />

      <h2>Related Videos</h2>
      <div>Related Videos Placeholder</div>
    </div>
  );
});

export default VideoDetailsPage;
