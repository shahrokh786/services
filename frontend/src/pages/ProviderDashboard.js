import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// We define our SVG icons as small, reusable components right here.
// This keeps the component self-contained.
const CreateIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>;
const ServicesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>;
const BookingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;

const ProviderDashboard = () => {
  const { user } = useAuth();

  // The data for our dashboard cards, now with SVG components and the CORRECT route.
  const dashboardLinks = [
    { 
      to: '/create-service', 
      Icon: CreateIcon,
      title: 'Create New Service', 
      description: 'List a new service and make it available for customers to book.' 
    },
    { 
      to: '/my-services', 
      Icon: ServicesIcon,
      title: 'My Services', 
      description: 'View, edit, or delete your existing service listings.' 
    },
    { 
      to: '/manage-bookings', // <-- CRITICAL FIX: Changed from /my-bookings
      Icon: BookingsIcon,
      title: 'Manage Bookings', 
      description: 'View and manage incoming appointments from your customers.' 
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Welcome, {user?.name}!
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            This is your dashboard. Manage your business on LocalServiceHub here.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dashboardLinks.map(({ to, Icon, title, description }) => (
            <Link 
              key={title}
              to={to} 
              className="group block bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ease-in-out"
            >
              <div className="mb-4">
                <Icon />
              </div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                {title}
              </h3>
              <p className="mt-2 text-gray-600">
                {description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;

