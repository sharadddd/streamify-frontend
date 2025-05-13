import React, { useEffect, useState, forwardRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getUserChannelSubscribers } from '../services/apiService';

const ChannelSubscribersPage = forwardRef((props, ref) => {
  const { userId } = useParams();
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        setLoading(true);
        const response = await getUserChannelSubscribers(userId);
        setSubscribers(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    if (userId) {
      fetchSubscribers();
    }
  }, [userId]);

  if (loading) {
    return <div ref={ref}>Loading subscribers...</div>;
  }

  if (error) {
    return <div ref={ref}>Error loading subscribers: {error.message}</div>;
  }

  return (
    <div ref={ref}>
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Subscribers
      </motion.h2>
      {subscribers.length === 0 && !loading ? (
        <p>No subscribers yet.</p>
      ) : (
        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          style={{ listStyle: 'none', padding: 0 }}
        >
          <AnimatePresence>
            {subscribers.map((subscriber) => (
              <motion.li
                key={subscriber._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                style={{
                  marginBottom: '10px',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '5px'
                }}
              >
                {subscriber.username || 'Unnamed Subscriber'}
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
    </div>
  );
});

export default ChannelSubscribersPage;
