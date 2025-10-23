// File: frontend/src/components/ProtectedRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
// Use relative path to context folder (up one level from components, then down)
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    // Optional: Loading indicator while checking auth
    return <div className='text-center p-10'>Checking authentication...</div>;
  }

  // If done loading and no user, redirect to login
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;