import axios from 'axios';

const API_BASE_URL = '/api/v1'; // Assuming your backend runs on the same domain

// Example in src/services/apiService.js
 // Assuming you are using axios for API calls

const API_URL = 'YOUR_BACKEND_API_URL'; // Replace with your backend API URL

// ... other API functions

export const searchVideos = async (query) => {
  try {
    const response = await axios.get(`${API_URL}/api/v1/search?q=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    console.error('Error searching videos:', error);
    throw error; // Re-throw the error to be handled by the component
  }
};

const apiService = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function for user registration
export const registerUser = async (userData) => {
  try {
    const response = await apiService.post('/users/register', userData);
    return response.data; // Assuming the response contains user data or success message
  } catch (error) {
    console.error('Error during user registration:', error);
    throw error; // Re-throw the error for handling in the component
  }
};

// Function for user login
export const loginUser = async (credentials) => {
  try {
    const response = await apiService.post('/users/login', credentials);
    return response.data; // Assuming the response contains user data and tokens
  } catch (error) {
    console.error('Error during user login:', error);
    throw error; // Re-throw the error for handling in the component
  }
};

// Function for user logout
export const logoutUser = async () => {
  try {
    const response = await apiService.post('/users/logout');
    return response.data;
  } catch (error) {
    console.error('Error during user logout:', error);
    throw error;
  }
};

// Function to get playlists for the current user
export const getUserPlaylists = async () => {
  try {
    const response = await apiService.get('/playlists/user'); // Assuming '/playlists/user' is the endpoint for fetching current user's playlists
    return response.data;
  } catch (error) {
    console.error('Error fetching user playlists:', error);
    throw error;
  }
};

// Function to get channel statistics
export const getChannelStats = async () => {
  try {
    const response = await apiService.get('/dashboard/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching channel statistics:', error);
    throw error;
  }
};

// Function to get channel videos
export const getChannelVideos = async () => {
  try {
    const response = await apiService.get('/dashboard/videos');
    return response.data;
  } catch (error) {
    console.error('Error fetching channel videos:', error);
    throw error;
  }
};

// Function to perform a healthcheck
export const healthcheck = async () => {
  try {
    const response = await apiService.get('/healthcheck');
    return response.data;
  } catch (error) {
    console.error('Error during healthcheck:', error);
    throw error;
  }
};

// Function to create a new tweet
export const createTweet = async (tweetContent) => {
  try {
    const response = await apiService.post('/tweets', { content: tweetContent });
    return response.data;
  } catch (error) {
    console.error('Error creating tweet:', error);
    throw error;
  }
};

// Function to get user tweets by user ID
export const getUserTweets = async (userId) => {
  try {
    const response = await apiService.get(`/tweets/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching tweets for user with ID ${userId}:`, error);
    throw error;
  }
};

// Function to update a tweet by ID
export const updateTweet = async (tweetId, newContent) => {
  try {
    const response = await apiService.patch(`/tweets/${tweetId}`, { content: newContent });
    return response.data;
  } catch (error) {
    console.error(`Error updating tweet with ID ${tweetId}:`, error);
    throw error;
  }
};

// Function to delete a tweet by ID
export const deleteTweet = async (tweetId) => {
  try {
    const response = await apiService.delete(`/tweets/${tweetId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting tweet with ID ${tweetId}:`, error);
    throw error;
  }
};

// Function to get subscribed channels for a channel ID
export const getSubscribedChannels = async (channelId) => {
  try {
    const response = await apiService.get(`/subscriptions/c/${channelId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching subscribed channels for channel ID ${channelId}:`, error);
    throw error;
  }
};

// Function to toggle subscription status for a channel ID
export const toggleSubscription = async (channelId) => {
  try {
    const response = await apiService.post(`/subscriptions/c/${channelId}`);
    return response.data;
  } catch (error) {
    console.error(`Error toggling subscription for channel ID ${channelId}:`, error);
    throw error;
  }
};

// Function to get user channel subscribers by subscriber ID
export const getUserChannelSubscribers = async (subscriberId) => {
  try {
    const response = await apiService.get(`/subscriptions/u/${subscriberId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user channel subscribers for subscriber ID ${subscriberId}:`, error);
    throw error;
  }
};

// Function to create a new playlist
export const createPlaylist = async (playlistData) => {
  try {
    const response = await apiService.post('/playlists', playlistData);
    return response.data;
  } catch (error) {
    console.error('Error creating playlist:', error);
    throw error;
  }
};

// Function to get a playlist by ID
export const getPlaylistById = async (playlistId) => {
  try {
    const response = await apiService.get(`/playlists/${playlistId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching playlist with ID ${playlistId}:`, error);
    throw error;
  }
};

// Function to update a playlist by ID
export const updatePlaylist = async (playlistId, playlistData) => {
  try {
    const response = await apiService.patch(`/playlists/${playlistId}`, playlistData);
    return response.data;
  } catch (error) {
    console.error(`Error updating playlist with ID ${playlistId}:`, error);
    throw error;
  }
};

// Function to delete a playlist by ID
export const deletePlaylist = async (playlistId) => {
  try {
    const response = await apiService.delete(`/playlists/${playlistId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting playlist with ID ${playlistId}:`, error);
    throw error;
  }
};

// Function to add a video to a playlist by video and playlist IDs
export const addVideoToPlaylist = async (videoId, playlistId) => {
  try {
    const response = await apiService.patch(`/playlists/add/${videoId}/${playlistId}`);
    return response.data;
  } catch (error) {
    console.error(`Error adding video ${videoId} to playlist ${playlistId}:`, error);
    throw error;
  }
};

// Function to remove a video from a playlist by video and playlist IDs
export const removeVideoFromPlaylist = async (videoId, playlistId) => {
  try {
    const response = await apiService.patch(`/playlists/remove/${videoId}/${playlistId}`);
    return response.data;
  } catch (error) {
    console.error(`Error removing video ${videoId} from playlist ${playlistId}:`, error);
    throw error;
  }
};

// Function to toggle like status for a video by video ID
export const toggleVideoLike = async (videoId) => {
  try {
    const response = await apiService.post(`/likes/toggle/v/${videoId}`);
    return response.data;
  } catch (error) {
    console.error(`Error toggling like for video with ID ${videoId}:`, error);
    throw error;
  }
};

// Function to toggle like status for a comment by comment ID
export const toggleCommentLike = async (commentId) => {
  try {
    const response = await apiService.post(`/likes/toggle/c/${commentId}`);
    return response.data;
  } catch (error) {
    console.error(`Error toggling like for comment with ID ${commentId}:`, error);
    throw error;
  }
};

// Function to toggle like status for a tweet by tweet ID
export const toggleTweetLike = async (tweetId) => {
  try {
    const response = await apiService.post(`/likes/toggle/t/${tweetId}`);
    return response.data;
  } catch (error) {
    console.error(`Error toggling like for tweet with ID ${tweetId}:`, error);
    throw error;
  }
};

// Function to get liked videos
export const getLikedVideos = async () => {
  try {
    const response = await apiService.get('/likes/videos');
    return response.data;
  } catch (error) {
    console.error('Error fetching liked videos:', error);
    throw error;
  }
};

// Function to get comments for a video by video ID
export const getVideoComments = async (videoId) => {
  try {
    const response = await apiService.get(`/comments/${videoId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching comments for video with ID ${videoId}:`, error);
    throw error;
  }
};

// Function to add a comment to a video by video ID
export const addCommentToVideo = async (videoId, commentContent) => {
  try {
    const response = await apiService.post(`/comments/${videoId}`, { content: commentContent });
    return response.data;
  } catch (error) {
    console.error(`Error adding comment to video with ID ${videoId}:`, error);
    throw error;
  }
};

// Function to delete a comment by ID
export const deleteComment = async (commentId) => {
  try {
    const response = await apiService.delete(`/comments/c/${commentId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting comment with ID ${commentId}:`, error);
    throw error;
  }
};

// Function to update a comment by ID
export const updateComment = async (commentId, newContent) => {
  try {
    const response = await apiService.patch(`/comments/c/${commentId}`, { content: newContent });
    return response.data;
  } catch (error) {
    console.error(`Error updating comment with ID ${commentId}:`, error);
    throw error;
  }
};

// Function for smart search
export const search = async (query) => {
  try {
    const response = await apiService.get('/search', {
      params: { query },
    });
    return response.data;
  } catch (error) {
    console.error(`Error during search for query "${query}":`, error);
    throw error;
  }
};
// Function to update user cover image
export const updateUserCoverImage = async (coverImageFile) => {
  try {
    const formData = new FormData();
    formData.append('coverImage', coverImageFile);
    const response = await apiService.patch('/users/cover-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating user cover image:', error);
    throw error;
  }
};
// Function to get user channel profile by username
export const getUserChannelProfile = async (username) => {
  try {
    const response = await apiService.get(`/users/c/${username}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user channel profile for ${username}:`, error);
    throw error;
  }
};
// Function to get watch history of the current user
export const getWatchHistory = async () => {
  try {
    const response = await apiService.get('/users/history');
    return response.data;
  } catch (error) {
    console.error('Error fetching watch history:', error);
    throw error;
  }
};
// Function to get all videos
export const getAllVideos = async () => {
  try {
    const response = await apiService.get('/videos');
    return response.data;
  } catch (error) {
    console.error('Error fetching all videos:', error);
    throw error;
  }
};
// Function to publish a new video
export const publishVideo = async (videoData) => {
  try {
    const formData = new FormData();
    formData.append('videoFile', videoData.videoFile);
    formData.append('thumbnail', videoData.thumbnail);
    // Add other video details to formData if needed (e.g., title, description)
    const response = await apiService.post('/videos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error publishing video:', error);
    throw error;
  }
};
// Function to get a video by ID
export const getVideoById = async (videoId) => {
  try {
    const response = await apiService.get(`/videos/${videoId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching video with ID ${videoId}:`, error);
    throw error;
  }
};
// Function to delete a video by ID
export const deleteVideo = async (videoId) => {
  try {
    const response = await apiService.delete(`/videos/${videoId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting video with ID ${videoId}:`, error);
    throw error;
  }
};
// Function to update a video by ID
export const updateVideo = async (videoId, videoData) => {
  try {
    const formData = new FormData();
    if (videoData.thumbnail) {
      formData.append('thumbnail', videoData.thumbnail);
    }
    // Add other video details to formData if needed (e.g., title, description)
    const response = await apiService.patch(`/videos/${videoId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating video with ID ${videoId}:`, error);
    throw error;
  }
};
// Function to toggle publish status of a video by ID
export const togglePublishStatus = async (videoId) => {
  try {
    const response = await apiService.patch(`/videos/toggle/publish/${videoId}`);
    return response.data;
  } catch (error) {
    console.error(`Error toggling publish status for video with ID ${videoId}:`, error);
    throw error;
  }
};
// Function to refresh access token
export const refreshAccessToken = async () => {
  try {
    const response = await apiService.post('/users/refresh-token');
    return response.data;
  } catch (error) {
    console.error('Error during token refresh:', error);
    throw error;
  }
};

// Function to change current password
export const changePassword = async (passwords) => {
  try {
    const response = await apiService.post('/users/change-password', passwords);
    return response.data;
  } catch (error) {
    console.error('Error during password change:', error);
    throw error;
  }
};

// Function to get current user details
export const getCurrentUser = async () => {
  try {
    const response = await apiService.get('/users/current-user');
    return response.data;
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  }
};

// Function to update user account details
export const updateAccountDetails = async (details) => {
  try {
    const response = await apiService.patch('/users/update-account', details);
    return response.data;
  } catch (error) {
    console.error('Error updating account details:', error);
    throw error;
  }
};

// Function to update user avatar
export const updateUserAvatar = async (avatarFile) => {
  try {
    const formData = new FormData();
    formData.append('avatar', avatarFile);
    const response = await apiService.patch('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating user avatar:', error);
    throw error;
  }
};

// You can add more functions here for other API endpoints