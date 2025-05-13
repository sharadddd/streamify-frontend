import React, { useState } from 'react';
import '../styles/CreatePlaylistModal.css'; // Import CSS file for styling and animations
import { createPlaylist } from '../services/apiService'; // Assuming apiService is in ../services

const CreatePlaylistModal = ({ isOpen, onClose, onCreateSuccess }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const newPlaylist = await createPlaylist({ name, description });
      console.log('Playlist created:', newPlaylist);
      setLoading(false);
      setName('');
      setDescription('');
      if (onCreateSuccess) {
        onCreateSuccess(newPlaylist);
      }
      onClose();
    } catch (err) {
      console.error('Error creating playlist:', err);
      setError('Failed to create playlist. Please try again.');
      setLoading(false);
    }
  };

  return (
    isOpen && (
      <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}> {/* Prevent clicks inside modal from closing it */}
          <h2>Create New Playlist</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name">Playlist Name:</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="animated-input"
              />
            </div>
            <div>
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="animated-input"
              ></textarea>
            </div>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <div className="modal-actions">
              <button type="submit" disabled={loading} className="animated-button">
                {loading ? 'Creating...' : 'Create Playlist'}
              </button>
              <button type="button" onClick={onClose} disabled={loading} className="animated-button cancel">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );

};

export default CreatePlaylistModal;