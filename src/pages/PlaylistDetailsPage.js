import React, { useEffect, useState, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { getPlaylistById, updatePlaylist, deletePlaylist } from '../services/apiService';
import PlaylistDetails from '../components/PlaylistDetails';
//import '../styles/PlaylistDetailsPage.css';

const PlaylistDetailsPage = forwardRef((props, ref) => {
  const { playlistId } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        setLoading(true);
        const response = await getPlaylistById(playlistId);
        setPlaylist(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchPlaylist();
  }, [playlistId]);

  const handleDeletePlaylist = async () => {
    if (window.confirm('Are you sure you want to delete this playlist?')) {
      try {
        setIsDeleting(true);
        await deletePlaylist(playlistId);
        navigate('/playlists');
      } catch (err) {
        setIsDeleting(false);
        setError(err);
        console.error('Error deleting playlist:', err);
      }
    }
  };

  const handleUpdatePlaylist = () => {
    setIsUpdating(true);
    console.log('Update playlist clicked for playlistId:', playlistId);
    // Open modal or other logic goes here
  };

  const renderUpdateModal = () => {
    return null; // Add modal implementation here
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen" ref={ref}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, loop: Infinity, ease: "linear" }}
          className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full"
        ></motion.div>
      </div>
    );
  }

  if (error) {
    return <div ref={ref}>Playlist not found.</div>;
  }

  return (
    <div ref={ref}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="playlist-details-page"
      >
        <h1 className="page-title">Playlist Details</h1>
        <PlaylistDetails playlist={playlist} />
        <div className="playlist-actions">
          <motion.button
            onClick={handleUpdatePlaylist}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            disabled={isUpdating || isDeleting}
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${isUpdating || isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isUpdating ? 'Updating...' : 'Update Playlist'}
          </motion.button>
          <motion.button
            onClick={handleDeletePlaylist}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            disabled={isUpdating || isDeleting}
            className={`bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ${isUpdating || isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isDeleting ? 'Deleting...' : 'Delete Playlist'}
          </motion.button>
        </div>
        {renderUpdateModal()}
      </motion.div>
    </div>
  );
});

export default PlaylistDetailsPage;
