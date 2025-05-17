import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import VideoCard from '../components/VideoCard';
import VideoSearch from '../components/VideoSearch';
import { searchVideos } from '../services/apiService';
import '../styles/pages/SearchResults.css';

const SearchResults = () => {
  const location = useLocation();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const observer = useRef();

  // Parse search params
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const duration = searchParams.get('duration') || '';
  const date = searchParams.get('date') || '';
  const quality = searchParams.get('quality') || '';

  // Reset when search params change
  useEffect(() => {
    setVideos([]);
    setPage(1);
    setHasMore(true);
  }, [location.search]);

  // Fetch videos
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await searchVideos({
          query,
          category,
          duration,
          date,
          quality,
          page,
          limit: 20
        });

        setVideos(prev => {
          const newVideos = response.data.videos;
          // Remove duplicates
          const uniqueVideos = [...prev];
          newVideos.forEach(video => {
            if (!uniqueVideos.find(v => v._id === video._id)) {
              uniqueVideos.push(video);
            }
          });
          return uniqueVideos;
        });

        setTotalResults(response.data.total);
        setHasMore(response.data.hasMore);
      } catch (err) {
        console.error('Error fetching videos:', err);
        setError(err.message || 'Error fetching videos');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [query, category, duration, date, quality, page]);

  // Infinite scroll setup
  const lastVideoElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  // Format filter text
  const getFilterText = () => {
    const filters = [];
    if (category) filters.push(category);
    if (duration) {
      const durationText = {
        short: 'Under 4 minutes',
        medium: '4-20 minutes',
        long: 'Over 20 minutes'
      }[duration];
      filters.push(durationText);
    }
    if (date) {
      const dateText = {
        today: 'Today',
        week: 'This week',
        month: 'This month',
        year: 'This year'
      }[date];
      filters.push(dateText);
    }
    if (quality) filters.push(`${quality} quality`);

    return filters.length ? `Filtered by: ${filters.join(' • ')}` : '';
  };

  return (
    <div className="search-results">
      <div className="search-header">
        <VideoSearch />
      </div>

      <div className="results-info">
        {query && (
          <h2 className="results-title">
            Search results for "{query}"
            <span className="results-count">
              {totalResults.toLocaleString()} results
            </span>
          </h2>
        )}
        {getFilterText() && (
          <p className="filter-text">{getFilterText()}</p>
        )}
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setPage(1)}>Retry</button>
        </div>
      )}

      <div className="videos-grid">
        {videos.map((video, index) => {
          if (videos.length === index + 1) {
            return (
              <div ref={lastVideoElementRef} key={video._id}>
                <VideoCard video={video} />
              </div>
            );
          } else {
            return <VideoCard key={video._id} video={video} />;
          }
        })}
      </div>

      {loading && (
        <div className="loading-indicator">
          <div className="loading-spinner"></div>
          <p>Loading more videos...</p>
        </div>
      )}

      {!loading && !hasMore && videos.length > 0 && (
        <p className="no-more-results">
          No more videos to show
        </p>
      )}

      {!loading && videos.length === 0 && !error && (
        <div className="no-results">
          <h3>No videos found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default SearchResults; 