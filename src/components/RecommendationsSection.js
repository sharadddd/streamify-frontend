import React, { useEffect, useState } from 'react';
import { getChannelStats, getChannelVideos } from '../services/apiService';

import VideoCard from '../components/VideoCard'; // Import VideoCard
function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsData = await getChannelStats();
        setStats(statsData.data); // Assuming your API returns data in a 'data' field
        const videosData = await getChannelVideos();
        setVideos(videosData.data); // Assuming your API returns data in a 'data' field
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>Channel Dashboard</h1>
      {loading && <p>Loading dashboard data...</p>}
      {error && <p>Error loading dashboard data: {error.message}</p>}
      {stats && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Channel Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fadeIn">
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold text-gray-400">Total Subscribers</h3>
              <p className="text-3xl font-bold text-white">{stats.totalSubscribers}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold text-gray-400">Total Views</h3>
              <p className="text-3xl font-bold text-white">{stats.totalViews}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold text-gray-400">Total Videos</h3>
              <p className="text-3xl font-bold text-white">{stats.totalVideos}</p>
            </div>
          </div>
        </div>
      )}
      {videos.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold my-4">Channel Videos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-slideInUp">
            {videos.map((video, index) => (
              <div key={video._id} className="animate-fadeIn" style={{ animationDelay: `${index * 0.1}s` }}>
                <VideoCard video={video} />
              </div>
            ))}
          </div> {/* This should be the closing div for the grid */}
        </div>
      )}
    </div>
  );
}

export default DashboardPage;