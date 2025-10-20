import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// This component acts as a "security guard" for your provider-only pages.
const ProviderRoute = () => {
  // 1. Get the current user and the initial loading status from the global AuthContext.
  const { user, loading } = useAuth();

  // 2. If the app is still in the process of checking who is logged in,
  //    we display a simple loading message. This is crucial to prevent
  //    a logged-in provider from being momentarily redirected away.
  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  // 3. The security check:
  //    - Does a user object exist? (Are they logged in?)
  //    - AND is their role exactly 'provider'?
  if (user && user.role === 'provider') {
    // If both are true, the Outlet component renders the actual page
    // the user was trying to access (e.g., /dashboard, /my-services).
    return <Outlet />;
  }

  // 4. If the security check fails, the user is not a logged-in provider.
  //    We use the Navigate component from React Router to redirect them
  //    back to the homepage. The 'replace' prop is a security measure
  //    that prevents them from using the browser's "back" button to
  //    get to the protected page they were just kicked out of.
  return <Navigate to="/" replace />;
};

export default ProviderRoute;

