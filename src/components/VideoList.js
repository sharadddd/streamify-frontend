import React, { useEffect, useState } from 'react';
// Import your apiService.js here
import { getAllVideos } from '../services/apiService'; // Adjust the path as needed
import { Link } from 'react-router-dom'; // Assuming you use React Router for navigation

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
         // Replace with your actual apiService call
         const response = await getAllVideos();
         setVideos(response.data.data); // Assuming your ApiResponse has a 'data' field

         // Placeholder data - remove after integrating apiService
         const placeholderVideos = [
             {
                 _id: '1',
                 thumbnail: 'https://via.placeholder.com/200',
                 title: 'Placeholder Video 1',
             },
             {
                 _id: '2',
                 thumbnail: 'https://via.placeholder.com/200',
                 title: 'Placeholder Video 2',
             },
         ];
         setVideos(placeholderVideos);


      } catch (err) {
        console.error('Error fetching videos:', err);
        setError(err.message || 'An error occurred while fetching videos.');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []); // Empty dependency array means this effect runs once on mount

  if (loading) {
    return <div>Loading videos...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>All Videos</h2>
      {videos.length === 0 ? (
        <p>No videos available yet.</p>
      ) : (
        <div className="video-list">
          {videos.map((video) => (
            <div key={video._id} className="video-item">
                 {/* Wrap the video item in a Link to navigate to the video player page */}
              <Link to={`/videos/${video._id}`}></Link>
              <img src={video.thumbnail} alt={video.title} width="200" />
              <h3>{video.title}</h3>
              {/* You can add more video details here */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoList;
