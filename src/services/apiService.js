import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                const response = await api.post('/auth/refresh-token', { refreshToken });
                const { accessToken } = response.data;

                localStorage.setItem('accessToken', accessToken);

                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch (error) {
                localStorage.clear();
                window.location.href = '/login';
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);

// Auth related functions
export const loginUser = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response;
};

export const logoutUser = async () => {
    const response = await api.post('/auth/logout');
    return response;
};

export const registerUser = async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response;
};

export const refreshAccessToken = async (refreshToken) => {
    const response = await api.post('/auth/refresh-token', { refreshToken });
    return response;
};

// User related functions
export const getCurrentUser = async () => {
    const response = await api.get('/users/me');
    return response;
};

export const updateAccountDetails = async (details) => {
    const response = await api.put('/users/account', details);
    return response;
};

export const updateUserAvatar = async (avatarData) => {
    const response = await api.put('/users/avatar', avatarData);
    return response;
};

export const updateUserCoverImage = async (coverData) => {
    const response = await api.put('/users/cover', coverData);
    return response;
};

// Video related functions
export const getAllVideos = async () => {
    const response = await api.get('/videos');
    return response;
};

export const getVideoById = async (videoId) => {
    const response = await api.get(`/videos/${videoId}`);
    return response;
};

export const publishVideo = async (videoData) => {
    const response = await api.post('/videos', videoData);
    return response;
};

export const deleteVideo = async (videoId) => {
    const response = await api.delete(`/videos/${videoId}`);
    return response;
};

export const toggleVideoLike = async (videoId) => {
    const response = await api.post(`/videos/${videoId}/like`);
    return response;
};

export const getVideoProcessingStatus = async (videoId) => {
    const response = await api.get(`/videos/${videoId}/processing-status`);
    return response;
};

// Comment related functions
export const getVideoComments = async (videoId) => {
    const response = await api.get(`/videos/${videoId}/comments`);
    return response;
};

export const addCommentToVideo = async (videoId, commentData) => {
    const response = await api.post(`/videos/${videoId}/comments`, commentData);
    return response;
};

export const addCommentReply = async (commentId, replyData) => {
    const response = await api.post(`/comments/${commentId}/replies`, replyData);
    return response;
};

export const editComment = async (commentId, commentData) => {
    const response = await api.put(`/comments/${commentId}`, commentData);
    return response;
};

export const deleteComment = async (commentId) => {
    const response = await api.delete(`/comments/${commentId}`);
    return response;
};

export const toggleCommentLike = async (commentId) => {
    const response = await api.post(`/comments/${commentId}/like`);
    return response;
};

// Playlist related functions
export const createPlaylist = async (playlistData) => {
    const response = await api.post('/playlists', playlistData);
    return response;
};

export const getPlaylistById = async (playlistId) => {
    const response = await api.get(`/playlists/${playlistId}`);
    return response;
};

export const getUserPlaylists = async () => {
    const response = await api.get('/playlists');
    return response;
};

export const updatePlaylist = async (playlistId, playlistData) => {
    const response = await api.put(`/playlists/${playlistId}`, playlistData);
    return response;
};

export const deletePlaylist = async (playlistId) => {
    const response = await api.delete(`/playlists/${playlistId}`);
    return response;
};

export const addVideoToPlaylist = async (playlistId, videoId) => {
    const response = await api.post(`/playlists/${playlistId}/videos/${videoId}`);
    return response;
};

export const removeVideoFromPlaylist = async (playlistId, videoId) => {
    const response = await api.delete(`/playlists/${playlistId}/videos/${videoId}`);
    return response;
};

// Channel related functions
export const getChannelStats = async () => {
    const response = await api.get('/channels/stats');
    return response;
};

export const getUserChannelSubscribers = async () => {
    const response = await api.get('/channels/subscribers');
    return response;
};

export const getSubscribedChannels = async () => {
    const response = await api.get('/channels/subscribed');
    return response;
};

export const toggleSubscription = async (channelId) => {
    const response = await api.post(`/channels/${channelId}/subscribe`);
    return response;
};

// Tweet related functions
export const getUserTweets = async () => {
    const response = await api.get('/tweets');
    return response;
};

export const createTweet = async (tweetData) => {
    const response = await api.post('/tweets', tweetData);
    return response;
};

export const updateTweet = async (tweetId, tweetData) => {
    const response = await api.put(`/tweets/${tweetId}`, tweetData);
    return response;
};

export const deleteTweet = async (tweetId) => {
    const response = await api.delete(`/tweets/${tweetId}`);
    return response;
};

export const toggleTweetLike = async (tweetId) => {
    const response = await api.post(`/tweets/${tweetId}/like`);
    return response;
};

// Search related functions
export const searchVideos = async (query) => {
    const response = await api.get(`/search/videos?q=${query}`);
    return response;
};

// History related functions
export const getWatchHistory = async () => {
    const response = await api.get('/history/watch');
    return response;
};

// Liked content
export const getLikedVideos = async () => {
    const response = await api.get('/users/liked-videos');
    return response;
};

// Get channel videos
export const getChannelVideos = async () => {
    try {
        const response = await fetch('/api/channel/videos', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch channel videos');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching channel videos:', error);
        throw error;
    }
};

export default api; 