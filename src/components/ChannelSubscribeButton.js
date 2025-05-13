import React, { useState, useEffect } from 'react';
import { toggleSubscription } from '../services/apiService'; // Assuming apiService.js is in a services folder
import { useAuth } from '../contexts/AuthContext'; // Assuming AuthContext.js is in a contexts folder
import '../styles/ChannelSubscribeButton.css'; // Import CSS for styling and animations
const ChannelSubscribeButton = ({ channelId, isSubscribed: initialIsSubscribed }) => {
  const [isSubscribed, setIsSubscribed] = useState(initialIsSubscribed);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth(); // Assuming you get the current user from AuthContext

  useEffect(() => {
    setIsSubscribed(initialIsSubscribed);
  }, [initialIsSubscribed]);

  const handleToggleSubscription = async () => {
    if (!user) {
      // Handle case where user is not logged in, maybe redirect to login
      console.log("User not logged in");
      return;
    }

    setLoading(true);
    try {
      // Assuming toggleSubscription takes channelId
      await toggleSubscription(channelId);
      setIsSubscribed(!isSubscribed);
      // Optionally, refetch subscriber count if needed
    } catch (error) {
      console.error('Error toggling subscription:', error);
      // Handle error, maybe show a message to the user
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleSubscription}
      disabled={loading}
      className={`subscribe-button ${isSubscribed ? 'subscribed' : 'not-subscribed'} ${loading ? 'loading' : ''}`}
    >
      {loading ? (isSubscribed ? 'Unsubscribing...' : 'Subscribing...') : (isSubscribed ? 'Subscribed' : 'Subscribe')}
    </button>
  );
};

export default ChannelSubscribeButton;