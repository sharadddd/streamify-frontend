import React from 'react';
import { useParams } from 'react-router-dom';

const DummyVideoDetailsPage = () => {
  const { videoId } = useParams();

  return (
    <div>
      <h1>This is a dummy video details page</h1>
      <p>Video ID: {videoId}</p>
    </div>
  );
};

export default DummyVideoDetailsPage;