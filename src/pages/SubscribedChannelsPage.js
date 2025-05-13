import React, { useEffect, useState, forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { getSubscribedChannels } from '../services/apiService';

const SubscribedChannelsPage = forwardRef((props, ref) => {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubscribedChannels = async () => {
      try {
        setLoading(true);
        const response = await getSubscribedChannels();
        setChannels(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchSubscribedChannels();
  }, []);

  if (loading) {
    return <div ref={ref}>Loading subscribed channels...</div>;
  }

  if (error) {
    return <div ref={ref}>Error loading subscribed channels: {error.message}</div>;
  }

  return (
    <div ref={ref}>
      <h1 className="text-2xl font-bold text-white mb-6">Subscribed Channels</h1>
      {channels.length === 0 ? (
        <p className="text-gray-400">No subscribed channels found.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {channels.map((channel) => (
            <li
              key={channel._id}
              className="bg-gray-800 rounded-lg p-4 flex items-center space-x-4"
            >
              <Link to={`/channels/${channel._id}`} className="flex items-center space-x-4 w-full">
                <img
                  src={channel.avatar || '/default-avatar.png'}
                  alt={channel.username}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h2 className="text-lg font-semibold text-white">{channel.username}</h2>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

export default SubscribedChannelsPage;
