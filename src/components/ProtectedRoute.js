import React, { forwardRef } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Assuming useAuth hook is in this path

const ProtectedRoute = forwardRef(({ component: Component, ...rest }, ref) => {
  const { isAuthenticated } = useAuth(); // Assuming useAuth provides isAuthenticated

  return isAuthenticated ? (
    <Component {...rest} ref={ref} />
  ) : (
    <Navigate to="/login" replace />
  );
});

export default ProtectedRoute;