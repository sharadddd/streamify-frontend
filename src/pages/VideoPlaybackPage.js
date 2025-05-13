import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  getVideoById,
  getVideoComments,
  toggleVideoLike,
} from '../services/apiService';

import VideoPlayer from '../components/VideoPlayer';
import UploaderInfo from '../components/UploaderInfo';
import VideoMetaActions from '../components/VideoMetaActions';
import CommentSection from '../components/CommentSection';
import RelatedVideosPlaceholder from '../components/RelatedVideosPlaceholder';

const VideoPlaybackPage = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

<VideoPlayer url={video.videoUrl} />





  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const [videoRes, commentsRes] = await Promise.all([
          getVideoById(videoId),
          getVideoComments(videoId),
        ]);
        setVideo(videoRes.data.data);
        setComments(commentsRes.data.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [videoId]);

  const handleToggleLike = async () => {
    try {
      const response = await toggleVideoLike(videoId);
      setVideo(response.data.data);
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  if (loading) return <div className="text-white text-center">Loading video...</div>;
  if (error) return <div className="text-red-500 text-center">Error: {error.message}</div>;
<VideoMetaActions video={video} onToggleLike={handleToggleLike} />



  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <VideoPlayer url={video.videoUrl} />
          <h1 className="text-2xl font-bold mt-4">{video.title}</h1>
          <UploaderInfo uploader={video.uploader} />
          <VideoMetaActions video={video} onToggleLike={handleToggleLike} />
          <p className="mt-4 text-gray-300">{video.description}</p>
          <CommentSection videoId={videoId} comments={comments} setComments={setComments} />
        </div>
        <RelatedVideosPlaceholder />
      </div>
    </div>
  );
};

export default VideoPlaybackPage;
