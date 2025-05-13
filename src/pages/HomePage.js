import React, { useEffect, useState, forwardRef } from 'react';
import { getAllVideos } from '../services/apiService'; // Assuming you have getAllVideos in apiService
import VideoCard from '../components/VideoCard'; // Import the VideoCard component
import RecommendationsSection from '../components/RecommendationsSection'; // Import the RecommendationsSection component
import '../styles/HomePage.css'; // Import CSS for styling and animations

const HomePage = forwardRef((props, ref) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await getAllVideos();
        setVideos(response.data.data); // Adjust based on your API response structure
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  return (
    <div className="home-page" ref={ref}> {/* Add a class to the main container */}
      <h1>Home Page</h1>
      <h2>AA Raha Hu Maderchodo</h2>
      {/* Placeholder for Search Bar */}
      {/* Placeholder for Search Bar */}
 {loading ? (
 <p>Loading videos...</p>
 ) : error ? (
 <p>Error loading videos: {error.message}</p>
 ) : videos.length > 0 ? (
        <>
 <div>
 <input type="text" placeholder="Search videos..." />
 <button>Search</button>
 </div>
 <ul className="video-grid"> {/* Change class name for grid layout */}
 {videos.map((video, index) => (
 <li
 key={video._id}
 className="video-grid-item" // Add a class for grid items
              style={{ animationDelay: `${index * 0.1}s` }} // Staggered animation delay
            >
              <VideoCard video={video} />
            </li>
          ))}
        </ul>
 {videos.length === 0 && (
        <p>No videos available.</p>
      )}
 </>
      ) : (
        <p>No videos available.</p>
      )}

      <RecommendationsSection />
    </div>
  );
});

export default HomePage;