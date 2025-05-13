import React, { forwardRef } from 'react';

const UploaderInfo = forwardRef(({ uploader }, ref) => {
  if (!uploader) {
    return null; // Or a loading/error state
  }

  return (
    <div ref={ref} className="flex items-center space-x-4"> {/* Add some basic styling */}
      <img
        src={uploader.avatar} // Assuming 'avatar' property holds the avatar URL
        alt={uploader.username} // Assuming 'username' property holds the username
        className="w-12 h-12 rounded-full" // Add some basic styling for avatar
      />
      <div>
        <h3 className="text-lg font-semibold">{uploader.username}</h3> {/* Assuming 'username' property holds the username */}
        {/* You can add subscriber count here if available */}
        {/* <p className="text-gray-400">{uploader.subscribersCount} subscribers</p> */}
      </div>
      {/* Placeholder for Subscribe Button */}
      <button className="bg-red-600 text-white px-4 py-2 rounded-md">
        Subscribe {/* Or "Subscribed" based on uploader.isSubscribed */}
      </button>
    </div>
  );
});

export default UploaderInfo;