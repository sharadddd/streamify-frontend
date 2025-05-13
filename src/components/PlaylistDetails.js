import React from 'react';
import VideoCard from './VideoCard';
import { removeVideoFromPlaylist } from '../services/apiService';

const PlaylistDetails = ({ playlist }) => {
  const handleRemoveVideo = async (videoId) => { // Define the function here
    try {
      await removeVideoFromPlaylist(videoId, playlist._id);
      // You might want to update the playlist state in the parent component
      // or refetch the playlist details after removing a video.
      console.log('Video removed successfully');
    } catch (error) {
      console.error('Error removing video:', error);
    }
  };

  return ( // Start the return statement here
    <div>
      <h2>{playlist.name}</h2>
      <p>{playlist.description}</p>
      <h3>Videos:</h3>
      {playlist.videos && playlist.videos.length > 0 ? (
        <div>
          {playlist.videos.map((video) => (
            <div key={video._id}>
              <VideoCard video={video} />
              <button onClick={() => handleRemoveVideo(video._id)}>Remove</button>
            </div>
          ))}
        </div>
      ) : (
        <p>This playlist has no videos yet.</p>
      )}
    </div>
  );
};

export default PlaylistDetails;
