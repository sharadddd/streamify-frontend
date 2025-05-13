import React, { useEffect, useState, forwardRef } from 'react'; // Import forwardRef
import { useParams, Link } from 'react-router-dom'; // Import useParams and Link
import { getChannelDetails, getChannelVideos, checkSubscriptionStatus, subscribeToChannel, unsubscribeFromChannel } from '../services/apiService'; // Import API service functions

const ChannelDetailPage = forwardRef((props, ref) => {
  const [videos, setVideos] = useState([]); // State for videos
  const { channelId } = useParams();
  const [channel, setChannel] = useState(null); // State for channel data
  const [loading, setLoading] = useState(true); // State for loading status
  const [isSubscribed, setIsSubscribed] = useState(false); // State for subscription status
  const [subscriptionError, setSubscriptionError] = useState(null); // State for subscription error
  const [subscribing, setSubscribing] = useState(false); // State for subscribe/unsubscribe loading
  const [error, setError] = useState(null); // State for error

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        setLoading(true);
        const response = await getChannelDetails(channelId);
        setChannel(response.data.data); // Adjust based on your API response structure
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchChannel();
  }, [channelId]); // Re-run effect if channelId changes

  useEffect(() => {
    const fetchChannelVideos = async () => {
      try {
        const response = await getChannelVideos(channelId);
        setVideos(response.data.data); // Adjust based on your API response structure
      } catch (err) {
        // Handle error
      }
    };

    fetchChannelVideos();
  }, [channelId]); // Re-run effect if channelId changes

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const response = await checkSubscriptionStatus(channelId);
        setIsSubscribed(response.data.isSubscribed); // Adjust based on your API response structure
      } catch (err) {
        console.error("Error checking subscription status:", err);
      }
    };

    checkSubscription();
  }, [channelId]); // Re-run effect if channelId changes

  const handleSubscribeToggle = async () => {
    setSubscriptionError(null); // Clear any previous errors
    setSubscribing(true);
    try {
      if (isSubscribed) {
        await unsubscribeFromChannel(channelId);
        console.log("Unsubscribed successfully"); // Optional: log success
      } else {
        await subscribeToChannel(channelId);
        console.log("Subscribed successfully"); // Optional: log success
      }
      setIsSubscribed(!isSubscribed); // Toggle subscription status on success
    } catch (err) {
      // Handle error
    } finally {
      setSubscribing(false); // Always set subscribing to false
    }
  };

  if (loading) {
    return <div>Loading channel details...</div>;
  }

  if (error) {
    return <div>Error loading channel details: {error.message}</div>;
  }

  return (
    <div ref={ref}> {/* Apply ref to the root element */}
      <h1>{channel?.username}</h1> {/* Display channel username */}
      {/* Display subscriber count */}
      {channel?.subscribersCount !== undefined && (
        <p>{channel.subscribersCount} Subscribers</p>
      )}
      {/* Display channel description */}
      {channel?.description && (
        <p>{channel.description}</p>
      )}
      <img src={channel?.avatar} alt={channel?.username} className="w-20 h-20 rounded-full object-cover" /> {/* Display channel avatar */}

      {/* Display subscription error */}
      {subscriptionError && <p className="text-red-500">{subscriptionError}</p>}

      {/* Subscribe/Unsubscribe Button */}
      <button
        onClick={handleSubscribeToggle}
        disabled={subscribing}
        className={`px-4 py-2 rounded-md text-white font-semibold ${
          isSubscribed ? 'bg-gray-600 hover:bg-gray-700' : 'bg-blue-600 hover:bg-blue-700'
        } disabled:opacity-50`}
      >
        {subscribing ? (isSubscribed ? 'Unsubscribing...' : 'Subscribing...') : (isSubscribed ? 'Subscribed' : 'Subscribe')}
      </button>

      <h2>Videos</h2>
      <div className="mt-8"> {/* Add some margin at the top */}
        <h2 className="text-xl font-bold mb-4">Videos</h2> {/* Heading for the videos section */}
        {videos.length === 0 ? (
          <p>No videos found for this channel.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"> {/* Grid layout for videos */}
            {videos.map((video) => (
              <Link key={video._id} to={`/watch/${video._id}`} className="block bg-gray-800 rounded-lg overflow-hidden"> {/* Wrap with Link */}
                <img src={video.thumbnail} alt={video.title} className="w-full h-40 object-cover" /> {/* Video thumbnail */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold truncate">{video.title}</h3> {/* Video title */}
                  {/* You can add more video details here, like views or upload date */}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

export default ChannelDetailPage;
