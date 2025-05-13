import React, { useState } from 'react';
import { publishVideo } from '../services/apiService'; // Assuming publishVideo is the correct function
import '../styles/videoUpload.css';


const VideoUpload = () => { 
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (event) => {
    const { name, files } = event.target;
    if (name === 'videoFile') {
      setVideoFile(files[0]);
    } else if (name === 'thumbnailFile') {
      setThumbnailFile(files[0]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.append('videoFile', videoFile);
    formData.append('thumbnail', thumbnailFile); // Match the backend field name
    formData.append('title', title);
    formData.append('description', description);

    try {
      const response = await publishVideo(formData); // Use the imported function
      console.log('Upload successful:', response.data);
      setSuccess(true);
      // Reset form
      setVideoFile(null);
      setThumbnailFile(null);
      setTitle('');
      setDescription('');

      // setTitle('');
      // setDescription('');

      // Placeholder for successful upload - remove after integrating apiService
      console.log('Form data prepared:', formData);
      setSuccess(true);
        setVideoFile(null);
        setThumbnailFile(null);
        setTitle('');
        setDescription('');


    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'An error occurred during upload.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div>
      <h2>Upload New Video</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="videoFile">Video File:</label>
          <input
            type="file"
            id="videoFile"
            name="videoFile"
            accept="video/*"
            onChange={handleFileChange}
            required
          />
        </div>
        <div>
          <label htmlFor="thumbnailFile">Thumbnail File:</label>
          <input
            type="file"
            id="thumbnailFile"
            name="thumbnailFile"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
        </div>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload Video'}
        </button>

        {success && <p style={{ color: 'green' }}>Video uploaded successfully!</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      </form>
    </div>
  );
};

export default VideoUpload;
