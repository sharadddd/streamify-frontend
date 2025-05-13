import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
} from '../services/apiService';
import { motion } from 'framer-motion';
import '../styles/UserProfilePage.css'; // Your CSS for layout

const UserProfilePage = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ fullName: '', email: '' });
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await getCurrentUser();
        const userData = response.data;
        setUser(userData);
        setFormData({ fullName: userData.fullName, email: userData.email });
      } catch (err) {
        console.error(err);
        setError('Failed to fetch user data.');
      } finally {
        setLoading(false);
      }
    };

    if (!user) {
      fetchCurrentUser();
    } else {
      setFormData({ fullName: user.fullName, email: user.email });
      setLoading(false);
    }
  }, [user, setUser]);

  const handleSubmit = async (e, type) => {
    e.preventDefault();
    try {
      if (type === 'account') {
        const updated = await updateAccountDetails(formData);
        setUser(updated.data);
        alert('Account details updated!');
      } else if (type === 'avatar' && avatarFile) {
        const updated = await updateUserAvatar(avatarFile);
        setUser(updated.data);
        alert('Avatar updated!');
      } else if (type === 'cover' && coverImageFile) {
        const updated = await updateUserCoverImage(coverImageFile);
        setUser(updated.data);
        alert('Cover image updated!');
      }
      setError(null);
    } catch (err) {
      console.error(err);
      setError(`Failed to update ${type}.`);
    }
  };

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!user) return <div>Please log in to view your profile.</div>;

  const containerVariants = {
    hidden: {},
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-6 text-white"
    >
      <motion.h2 variants={itemVariants} className="text-3xl font-bold mb-6">
        User Profile
      </motion.h2>

      <motion.div
        variants={itemVariants}
        className="mb-8 bg-gray-800 rounded-lg overflow-hidden shadow-lg"
      >
        {user.coverImage?.url && (
          <motion.img
            src={user.coverImage.url}
            alt="Cover"
            className="w-full h-48 object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          />
        )}
        <div className="p-4 flex items-center gap-4">
          {user.avatar?.url && (
            <motion.img
              src={user.avatar.url}
              alt="Avatar"
              className="w-20 h-20 rounded-full border-2 border-white"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            />
          )}
          <div>
            <h3 className="text-xl font-semibold">{user.fullName}</h3>
            <p className="text-sm text-gray-300">@{user.username}</p>
            <p className="text-sm">{user.email}</p>
          </div>
        </div>
      </motion.div>

      {/* Account Form */}
      <motion.form
        onSubmit={(e) => handleSubmit(e, 'account')}
        variants={itemVariants}
        className="mb-8 space-y-4"
      >
        <h3 className="text-xl font-bold">Update Account Details</h3>
        <div>
          <label htmlFor="fullName" className="block mb-1">
            Full Name
          </label>
          <motion.input
            type="text"
            id="fullName"
            className="w-full p-2 rounded bg-gray-700 text-white"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            whileFocus={{ scale: 1.01 }}
          />
        </div>
        <div>
          <label htmlFor="email" className="block mb-1">
            Email
          </label>
          <motion.input
            type="email"
            id="email"
            className="w-full p-2 rounded bg-gray-700 text-white"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            whileFocus={{ scale: 1.01 }}
          />
        </div>
        <motion.button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Save Changes
        </motion.button>
      </motion.form>

      {/* Avatar Form */}
      <motion.form
        onSubmit={(e) => handleSubmit(e, 'avatar')}
        variants={itemVariants}
        className="mb-8 space-y-4"
      >
        <h3 className="text-xl font-bold">Update Avatar</h3>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setAvatarFile(e.target.files[0])}
          className="file-input"
        />
        <motion.button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Upload Avatar
        </motion.button>
      </motion.form>

      {/* Cover Image Form */}
      <motion.form
        onSubmit={(e) => handleSubmit(e, 'cover')}
        variants={itemVariants}
        className="space-y-4"
      >
        <h3 className="text-xl font-bold">Update Cover Image</h3>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setCoverImageFile(e.target.files[0])}
          className="file-input"
        />
        <motion.button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Upload Cover Image
        </motion.button>
      </motion.form>
    </motion.div>
  );
};

export default UserProfilePage;
