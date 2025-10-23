// File: frontend/src/components/ProtectedRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Use relative path

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    // Optional: Show a loading indicator while auth status is checked
    return <div>Checking authentication...</div>;
  }

  // If loading is done and there's no user, redirect to login
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;