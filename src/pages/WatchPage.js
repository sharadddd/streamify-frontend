import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VideoPlayer from '../components/VideoPlayer';
import VideoInfo from '../components/VideoInfo';
import Comments from '../components/Comments';
import RecommendedVideos from '../components/RecommendedVideos';
import { getVideoById, getRecommendedVideos } from '../services/apiService';
import '../styles/pages/WatchPage.css';

const WatchPage = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [recommendedVideos, setRecommendedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch video details
        const videoData = await getVideoById(videoId);
        setVideo(videoData);

        // Fetch recommended videos
        const recommended = await getRecommendedVideos(10);
        setRecommendedVideos(recommended.videos);
      } catch (err) {
        console.error('Error fetching video:', err);
        setError(err.message || 'Error loading video');
      } finally {
        setLoading(false);
      }
    };

    if (videoId) {
      fetchVideoData();
    }
  }, [videoId]);

  if (loading) {
    return (
      <div className="watch-page-loading">
        <div className="loading-spinner"></div>
        <p>Loading video...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="watch-page-error">
        <h2>Error loading video</h2>
        <p>{error}</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="watch-page-not-found">
        <h2>Video not found</h2>
        <p>The video you're looking for doesn't exist or has been removed.</p>
        <button onClick={() => navigate('/')}>Go Home</button>
      </div>
    );
  }

  return (
    <div className="watch-page">
      <div className="watch-page-content">
        <div className="video-section">
          <VideoPlayer video={video} />
          <VideoInfo video={video} />
          <Comments videoId={videoId} />
        </div>
        <div className="recommended-section">
          <RecommendedVideos 
            videos={recommendedVideos} 
            currentVideoId={videoId} 
          />
        </div>
      </div>
    </div>
  );
};

export default WatchPage; 