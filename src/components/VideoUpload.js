import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { publishVideo, getVideoProcessingStatus } from '../services/apiService';
import '../styles/videoUpload.css';

// Constants for file limitations (free tier)
const MAX_VIDEO_SIZE_MB = 100; // 100MB max for free tier
const MAX_THUMBNAIL_SIZE_MB = 10; // 10MB max for images
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

const VideoUpload = () => {
    const navigate = useNavigate();
    const [videoFile, setVideoFile] = useState(null);
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState('');
    const [category, setCategory] = useState('');
    const [visibility, setVisibility] = useState('public');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [processingStatus, setProcessingStatus] = useState(null);
    const [processingProgress, setProcessingProgress] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const validateFile = (file, maxSize, allowedTypes, fileType = 'video') => {
        if (!file) return null;

        // Check file type
        if (!allowedTypes.includes(file.type)) {
            throw new Error(`Invalid ${fileType} format. Allowed formats: ${allowedTypes.join(', ')}`);
        }

        // Check file size
        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > maxSize) {
            throw new Error(`${fileType} size should be less than ${maxSize}MB`);
        }

        return file;
    };

    const handleFileChange = (event) => {
        const { name, files } = event.target;
        setError(null);

        try {
            if (name === 'videoFile') {
                const validatedFile = validateFile(files[0], MAX_VIDEO_SIZE_MB, ALLOWED_VIDEO_TYPES, 'video');
                setVideoFile(validatedFile);
            } else if (name === 'thumbnailFile') {
                const validatedFile = validateFile(files[0], MAX_THUMBNAIL_SIZE_MB, ALLOWED_IMAGE_TYPES, 'thumbnail');
                setThumbnailFile(validatedFile);
            }
        } catch (err) {
            setError(err.message);
            event.target.value = ''; // Reset file input
        }
    };

    const pollProcessingStatus = useCallback(async (videoId) => {
        try {
            const response = await getVideoProcessingStatus(videoId);
            const { status, progress } = response.data;

            setProcessingStatus(status);
            if (progress !== undefined) {
                setProcessingProgress(progress);
            }

            if (status === 'completed') {
                navigate(`/video/${videoId}`);
            } else if (status === 'failed') {
                setError(response.data.error || 'Video processing failed');
            } else {
                setTimeout(() => pollProcessingStatus(videoId), 5000); // Poll every 5 seconds
            }
        } catch (err) {
            console.error('Error polling status:', err);
            setError('Failed to get processing status');
        }
    }, [navigate]);

    // Function to optimize video metadata
    const optimizeVideoData = (videoData) => {
        return {
            ...videoData,
            title: videoData.title.slice(0, 100), // Limit title length
            description: videoData.description.slice(0, 5000), // Limit description length
            tags: videoData.tags
                .slice(0, 20) // Limit to 20 tags
                .map(tag => tag.slice(0, 30)), // Limit each tag length
        };
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        setUploadProgress(0);
        setProcessingProgress(0);
        setProcessingStatus('preparing');

        try {
            // Validate required fields
            if (!title.trim()) throw new Error('Title is required');
            if (!description.trim()) throw new Error('Description is required');
            if (!videoFile) throw new Error('Video file is required');

            // Prepare and optimize video data
            const videoData = optimizeVideoData({
                videoFile,
                thumbnail: thumbnailFile,
                title: title.trim(),
                description: description.trim(),
                tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
                category: category.trim(),
                visibility
            });

            // Show processing estimate
            setProcessingStatus('uploading');

            // Upload video
            const response = await publishVideo(videoData, (progress) => {
                setUploadProgress(progress);
            });

            const videoId = response.data._id;

            // Start polling for processing status
            pollProcessingStatus(videoId);

        } catch (err) {
            console.error('Upload error:', err);
            setError(err.response?.data?.message || err.message || 'An error occurred during upload.');
            setProcessingStatus('failed');
        } finally {
            setLoading(false);
        }
    };

    const renderProgress = () => {
        if (!processingStatus) return null;

        const statusMessages = {
            preparing: 'Preparing upload...',
            uploading: 'Uploading video...',
            pending: 'Waiting to process...',
            processing: 'Processing video...',
            completed: 'Upload complete!',
            failed: 'Upload failed'
        };

        const progress = processingStatus === 'uploading' ? uploadProgress : processingProgress;

        return (
            <div className="upload-progress">
                <div className="progress-bar">
                    <div
                        className="progress-bar-fill"
                        style={{
                            width: `${progress}%`,
                            backgroundColor: processingStatus === 'failed' ? '#ef4444' : '#3b82f6'
                        }}
                    />
                </div>
                <p className="progress-status">{statusMessages[processingStatus]}</p>
                {progress > 0 && (
                    <p className="progress-percentage">{progress}%</p>
                )}
                {processingStatus === 'processing' && videoFile && (
                    <div className="processing-info">
                        <p>Your video is being processed in multiple qualities (360p, 480p, 720p, 1080p)</p>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="upload-container">
            <h2>Upload New Video</h2>
            <form onSubmit={handleSubmit} className="upload-form">
                <div className="form-group">
                    <label htmlFor="videoFile">Video File:</label>
                    <input
                        type="file"
                        id="videoFile"
                        name="videoFile"
                        accept="video/*"
                        onChange={handleFileChange}
                        required
                        disabled={loading}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="thumbnailFile">Thumbnail (Optional):</label>
                    <input
                        type="file"
                        id="thumbnailFile"
                        name="thumbnailFile"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={loading}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        disabled={loading}
                        placeholder="Enter video title"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        disabled={loading}
                        placeholder="Enter video description"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="tags">Tags (comma-separated):</label>
                    <input
                        type="text"
                        id="tags"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        disabled={loading}
                        placeholder="Enter tags, separated by commas"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="category">Category:</label>
                    <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        disabled={loading}
                    >
                        <option value="">Select a category</option>
                        <option value="music">Music</option>
                        <option value="gaming">Gaming</option>
                        <option value="education">Education</option>
                        <option value="entertainment">Entertainment</option>
                        <option value="sports">Sports</option>
                        <option value="technology">Technology</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="visibility">Visibility:</label>
                    <select
                        id="visibility"
                        value={visibility}
                        onChange={(e) => setVisibility(e.target.value)}
                        disabled={loading}
                    >
                        <option value="public">Public</option>
                        <option value="unlisted">Unlisted</option>
                        <option value="private">Private</option>
                    </select>
                </div>

                {renderProgress()}

                {error && <div className="error-message">{error}</div>}

                <button
                    type="submit"
                    disabled={loading || !videoFile}
                    className={`submit-button ${loading ? 'loading' : ''}`}
                >
                    {loading ? 'Uploading...' : 'Upload Video'}
                </button>
            </form>
        </div>
    );
};

export default VideoUpload;
