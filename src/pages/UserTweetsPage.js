import React, { useEffect, useState, forwardRef } from 'react';
import { useParams } from 'react-router-dom';
import { getUserTweets } from '../services/apiService';
import { motion, AnimatePresence } from 'framer-motion';
import Tweet from '../components/Tweet';
import '../styles/Tweet.css';

const UserTweetsPage = forwardRef((props, ref) => {
  const { userId } = useParams();
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserTweets = async () => {
      try {
        setLoading(true);
        const response = await getUserTweets(userId);
        setTweets(response.data.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserTweets();
    }
  }, [userId]);

  if (loading) return <div>Loading tweets...</div>;
  if (error) return <div>Error fetching tweets: {error.message}</div>;

  return (
    <motion.div
      ref={ref}
      className="user-tweets-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        Tweets by User {userId}
      </motion.h2>

      <motion.div
        className="tweet-list"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.1 } },
          hidden: {},
        }}
      >
        <AnimatePresence>
          {tweets.length > 0 ? (
            tweets.map((tweet) => (
              <motion.div
                key={tweet._id}
                className="tweet-item"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
              >
                <Tweet tweet={tweet} />
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="no-tweets"
            >
              No tweets found for this user.
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
});

export default UserTweetsPage;
