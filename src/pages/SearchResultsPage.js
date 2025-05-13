import React, { useEffect, useState, forwardRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { searchVideos } from '../services/apiService';

const SearchResultsPage = forwardRef((props, ref) => {
  const location = useLocation();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams(location.search);
      const query = params.get('q');

      if (!query) {
        setError('No search query provided.');
        setLoading(false);
        setSearchResults([]);
        return;
      }

      try {
        const response = await searchVideos(query);
        setSearchResults(response.data?.data || []);
      } catch (err) {
        console.error('Error fetching search results:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [location.search]);

  return (
    <div ref={ref} className="container mx-auto px-4 py-8 text-white">
      <h1 className="text-3xl font-bold mb-6">Search Results</h1>

      {loading && (
        <div className="text-center text-gray-400">Loading search results...</div>
      )}

      {error && (
        <div className="text-center text-red-500">
          Error: {String(error?.message || error)}
        </div>
      )}

      {!loading && !error && searchResults.length === 0 && (
        <div className="text-center text-gray-400">
          No results found for your query.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {searchResults.map((video) => (
          <Link
            to={`/watch/${video._id}`}
            key={video._id}
            className="block hover:scale-105 transition-transform duration-200 ease-in-out"
          >
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-md h-full flex flex-col">
              <img
                src={video.thumbnail || '/default-thumbnail.jpg'}
                alt={video.title || 'Untitled'}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 flex-grow">
                <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                  {video.title || 'Untitled Video'}
                </h3>
                <p className="text-sm text-gray-400">
                  {video.uploader?.username || 'Unknown uploader'}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
});

export default SearchResultsPage;
