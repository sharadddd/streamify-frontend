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
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    title: '',
    description: '',
    isPrivate: false
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        setLoading(true);
        const response = await getPlaylistById(playlistId);
        setPlaylist(response.data.data);
        setUpdateForm({
          title: response.data.data.title,
          description: response.data.data.description,
          isPrivate: response.data.data.isPrivate
        });
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

  const handleUpdatePlaylist = async () => {
    try {
      setIsUpdating(true);
      const response = await updatePlaylist(playlistId, updateForm);
      setPlaylist(response.data.data);
      setShowUpdateModal(false);
      setIsUpdating(false);
    } catch (err) {
      setError(err);
      console.error('Error updating playlist:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUpdateForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const renderUpdateModal = () => {
    if (!showUpdateModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full"
        >
          <h2 className="text-2xl font-bold mb-4">Update Playlist</h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            handleUpdatePlaylist();
          }}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                name="title"
                value={updateForm.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                name="description"
                value={updateForm.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg"
                rows="3"
              />
            </div>
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isPrivate"
                  checked={updateForm.isPrivate}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-sm font-medium">Private Playlist</span>
              </label>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowUpdateModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                disabled={isUpdating}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                disabled={isUpdating}
              >
                {isUpdating ? 'Updating...' : 'Update'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    );
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
            onClick={() => setShowUpdateModal(true)}
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
