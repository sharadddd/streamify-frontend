import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Assuming you use React Router
// Import your apiService.js here
 import apiService from '../services/apiService'; // Adjust the path as needed
import { getVideoById, deleteVideo } from '../services/apiService';
const VideoPlayer = () => {
  const { videoId } = useParams(); // Get videoId from URL parameters
  const navigate = useNavigate(); // Hook for navigation
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false); // State for delete operation
  const [deleteError, setDeleteError] = useState(null); // State for delete error

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        // Replace with your actual apiService call
         const response = await getVideoById(videoId);
         setVideo(response.data.data); // Assuming your ApiResponse has a 'data' field

        // Placeholder data - remove after integrating apiService
         const placeholderVideo = {
             _id: videoId,
             videoFile: 'https://www.w3schools.com/html/mov_bbb.mp4', // Example video URL
             thumbnail: 'https://via.placeholder.com/400x200',
             title: `Placeholder Video ${videoId}`,
             description: `This is a placeholder description for video ${videoId}.`,
             views: 100,
         };
         setVideo(placeholderVideo);


      } catch (err) {
        console.error('Error fetching video:', err);
        setError(err.message || 'An error occurred while fetching the video.');
      } finally {
        setLoading(false);
      }
    };

    if (videoId) {
      fetchVideo();
    }

  }, [videoId]); // Rerun effect if videoId changes

  const handleDelete = async () => {
      if (window.confirm('Are you sure you want to delete this video?')) {
          setDeleting(true);
          setDeleteError(null);
          try {
              // Replace with your actual apiService call
               await deleteVideo(videoId);
               console.log('Video deleted successfully');
               // Redirect to video list page after deletion
               navigate('/videos'); // Adjust the path to your video list page

              // Placeholder for successful deletion - remove after integrating apiService
              console.log(`Attempting to delete video with ID: ${videoId}`);
              navigate('/videos'); // Adjust the path to your video list page


          } catch (err) {
              console.error('Error deleting video:', err);
              setDeleteError(err.message || 'An error occurred during video deletion.');
          } finally {
              setDeleting(false);
          }
      }
  };


  if (loading) {
    return <div className="loading-message">Loading video...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

   if (!video) {
      return <div className="not-found-message">Video not found.</div>;
  }


  return (
    <div className="video-player-container">
    <div className="video-wrapper">
      <video width="100%" controls> {/* Set width to 100% for responsiveness */}
        <source src={video.videoFile} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
    <div className="video-details">
      <h2>{video.title}</h2>
      <p>{video.description}</p>
      <p>Views: {video.views}</p>
      {/* Add the delete button */}
      <button onClick={handleDelete} disabled={deleting} className="delete-button">
          {deleting ? 'Deleting...' : 'Delete Video'}
      </button>

      {deleteError && <p className="error-message">{deleteError}</p>}

    </div>
  </div>
);
  
};

export default VideoPlayer;
