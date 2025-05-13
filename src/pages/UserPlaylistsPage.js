import React, { useEffect, useState, forwardRef } from 'react';
import { getLikedVideos } from '../services/apiService';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import CreatePlaylistModal from '../components/CreatePlaylistModal';
import '../styles/UserPlaylistsPage.css';

const UserPlaylistsPage = forwardRef((props, ref) => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserPlaylists = async () => {
      try {
        setLoading(true);
        const response = await getLikedVideos(user._id);
        setPlaylists(response.data.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (user && user._id) {
      fetchUserPlaylists();
    }
  }, [user]);

  const handleCloseModal = () => setIsModalOpen(false);

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const containerVariants = {
    hidden: {},
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  if (loading) return <div ref={ref}>Loading playlists...</div>;
  if (error) return <div ref={ref}>Error fetching playlists: {error.message}</div>;
  if (!playlists || playlists.length === 0) return <div ref={ref}>No playlists found.</div>;

  return (
    <div ref={ref} className="user-playlists-page">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="page-title"
      >
        My Playlists
      </motion.h2>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsModalOpen(true)}
        className="btn-primary mb-4"
      >
        Create New Playlist
      </motion.button>

      <motion.ul
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="playlist-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr"
      >
        {playlists.map((playlist) =>
          playlist && playlist._id ? (
            <motion.li
              key={playlist._id}
              variants={itemVariants}
              className="playlist-item"
            >
              <Link
                to={`/playlist/${playlist._id}`}
                className="playlist-link text-white hover:text-blue-400"
              >
                {playlist.name} ({playlist.videos.length} videos)
              </Link>
            </motion.li>
          ) : null
        )}
      </motion.ul>

      <CreatePlaylistModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
});

export default UserPlaylistsPage;
