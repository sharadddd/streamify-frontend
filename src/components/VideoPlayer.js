import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Assuming you use React Router
// Import your apiService.js here
import apiService from '../services/apiService'; // Adjust the path as needed
import { getVideoById, deleteVideo } from '../services/apiService';
import '../styles/videoPlayer.css';

const VideoPlayer = () => {
  const { videoId } = useParams(); // Get videoId from URL parameters
  const navigate = useNavigate(); // Hook for navigation
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const controlsRef = useRef(null);
  const progressBarRef = useRef(null);
  const volumeBarRef = useRef(null);

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false); // State for delete operation
  const [deleteError, setDeleteError] = useState(null); // State for delete error

  // Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [quality, setQuality] = useState('auto');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isPiP, setIsPiP] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Control visibility timer
  let controlsTimeout;

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

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (document.activeElement.tagName === 'INPUT') return;

      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
        case 'arrowleft':
          e.preventDefault();
          seek(-10);
          break;
        case 'arrowright':
          e.preventDefault();
          seek(10);
          break;
        case 'arrowup':
          e.preventDefault();
          adjustVolume(0.1);
          break;
        case 'arrowdown':
          e.preventDefault();
          adjustVolume(-0.1);
          break;
        case 't':
          e.preventDefault();
          toggleTheaterMode();
          break;
        case 'i':
          e.preventDefault();
          togglePiP();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Handle video events
  useEffect(() => {
    if (!videoRef.current) return;

    const handleTimeUpdate = () => {
      setCurrentTime(videoRef.current.currentTime);
      updateCurrentChapter();
    };

    const handleDurationChange = () => setDuration(videoRef.current.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleWaiting = () => setIsBuffering(true);
    const handlePlaying = () => setIsBuffering(false);
    const handleVolumeChange = () => setVolume(videoRef.current.volume);

    videoRef.current.addEventListener('timeupdate', handleTimeUpdate);
    videoRef.current.addEventListener('durationchange', handleDurationChange);
    videoRef.current.addEventListener('play', handlePlay);
    videoRef.current.addEventListener('pause', handlePause);
    videoRef.current.addEventListener('waiting', handleWaiting);
    videoRef.current.addEventListener('playing', handlePlaying);
    videoRef.current.addEventListener('volumechange', handleVolumeChange);

    return () => {
      videoRef.current.removeEventListener('timeupdate', handleTimeUpdate);
      videoRef.current.removeEventListener('durationchange', handleDurationChange);
      videoRef.current.removeEventListener('play', handlePlay);
      videoRef.current.removeEventListener('pause', handlePause);
      videoRef.current.removeEventListener('waiting', handleWaiting);
      videoRef.current.removeEventListener('playing', handlePlaying);
      videoRef.current.removeEventListener('volumechange', handleVolumeChange);
    };
  }, []);

  useEffect(() => {
    const handlePiPChange = (e) => {
      setIsPiP(document.pictureInPictureElement !== null);
    };

    document.addEventListener('enterpictureinpicture', handlePiPChange);
    document.addEventListener('leavepictureinpicture', handlePiPChange);

    return () => {
      document.removeEventListener('enterpictureinpicture', handlePiPChange);
      document.removeEventListener('leavepictureinpicture', handlePiPChange);
    };
  }, []);

  const updateCurrentChapter = () => {
    if (!video.chapters?.length || !videoRef.current) return;

    const currentTime = videoRef.current.currentTime;
    const chapter = video.chapters.find((chapter, index) => {
      const nextChapter = video.chapters[index + 1];
      return currentTime >= chapter.startTime &&
        (!nextChapter || currentTime < nextChapter.startTime);
    });

    if (chapter !== currentChapter) {
      setCurrentChapter(chapter);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleTheaterMode = () => {
    setIsTheaterMode(!isTheaterMode);
    // Add class to parent container for theater mode styling
    document.body.classList.toggle('theater-mode');
  };

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await playerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const togglePiP = async () => {
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        setIsPiP(false);
      } else if (document.pictureInPictureEnabled) {
        await videoRef.current.requestPictureInPicture();
        setIsPiP(true);
      }
    } catch (error) {
      console.error('PiP failed:', error);
    }
  };

  const seek = (seconds) => {
    if (videoRef.current) {
      const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
      videoRef.current.currentTime = newTime;
    }
  };

  const adjustVolume = (delta) => {
    if (videoRef.current) {
      const newVolume = Math.max(0, Math.min(1, volume + delta));
      videoRef.current.volume = newVolume;
      if (newVolume > 0) {
        videoRef.current.muted = false;
        setIsMuted(false);
      }
    }
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = pos * duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

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

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return h > 0
      ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
      : `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="video-player-loading">
        <div className="loading-spinner"></div>
        <p>Loading video...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="video-player-error">
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="video-player-not-found">
        <p>Video not found.</p>
        <button onClick={() => navigate('/videos')}>Back to Videos</button>
      </div>
    );
  }

  return (
    <div 
      ref={playerRef}
      className={`video-player ${isTheaterMode ? 'theater' : ''} ${isFullscreen ? 'fullscreen' : ''}`}
      onMouseMove={() => {
        setShowControls(true);
        clearTimeout(controlsRef.current);
        controlsRef.current = setTimeout(() => setShowControls(false), 3000);
      }}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={video.videoFile}
        poster={video.thumbnail}
        className="video-element"
        onClick={togglePlay}
      />

      {/* Custom Controls */}
      <div className={`video-controls ${showControls ? 'visible' : ''}`}>
        {/* Progress Bar */}
        <div
          className="progress-bar"
          ref={progressBarRef}
          onClick={handleSeek}
        >
          <div
            className="progress-bar-filled"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
        </div>

        <div className="controls-main">
          {/* Left Controls */}
          <div className="controls-left">
            <button onClick={togglePlay} className="control-button">
              {isPlaying ? '⏸️' : '▶️'}
            </button>

            <div className="volume-control">
              <button onClick={toggleMute} className="control-button">
                {isMuted || volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
              </button>
              <div 
                ref={volumeBarRef}
                className="volume-bar"
                onClick={handleSeek}
              >
                <div 
                  className="volume-filled"
                  style={{ width: `${volume * 100}%` }}
                />
              </div>
            </div>

            <div className="time-display">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>

            {currentChapter && (
              <div className="current-chapter">
                {currentChapter.title}
              </div>
            )}
          </div>

          {/* Right Controls */}
          <div className="controls-right">
            <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} className="control-button">
              ⚙️
            </button>
            <button onClick={togglePiP} className="control-button">
              {isPiP ? '⬆️' : '⬇️'}
            </button>
            <button onClick={toggleTheaterMode} className="control-button">
              {isTheaterMode ? '↙️' : '↗️'}
            </button>
            <button onClick={toggleFullscreen} className="control-button">
              {isFullscreen ? '⤢' : '⤡'}
            </button>
          </div>
        </div>

        {/* Buffering Indicator */}
        {isBuffering && (
          <div className="buffering-indicator">
            <div className="buffering-spinner"></div>
            <p>Buffering...</p>
          </div>
        )}
      </div>

      <div className="video-details">
        <h2>{video.title}</h2>
        <p>{video.description}</p>
        <p>Views: {video.views}</p>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="delete-button"
        >
          {deleting ? 'Deleting...' : 'Delete Video'}
        </button>
        {deleteError && <p className="error-message">{deleteError}</p>}
      </div>

      {isSettingsOpen && (
        <div className="settings-menu">
          <div className="settings-section">
            <h4>Playback Speed</h4>
            <select 
              value={playbackSpeed}
              onChange={(e) => {
                const speed = parseFloat(e.target.value);
                setPlaybackSpeed(speed);
                if (videoRef.current) videoRef.current.playbackRate = speed;
              }}
            >
              <option value="0.25">0.25x</option>
              <option value="0.5">0.5x</option>
              <option value="0.75">0.75x</option>
              <option value="1">Normal</option>
              <option value="1.25">1.25x</option>
              <option value="1.5">1.5x</option>
              <option value="1.75">1.75x</option>
              <option value="2">2x</option>
            </select>
          </div>

          <div className="settings-section">
            <h4>Quality</h4>
            <select 
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
            >
              <option value="auto">Auto</option>
              {video.qualities?.map(q => (
                <option key={q} value={q}>{q}p</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
