import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import bookingService from '../services/bookingService'; // Import the booking service to fetch data

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);

  useEffect(() => {
    // We only fetch bookings if the logged-in user is a 'customer'
    if (user && user.role === 'customer') {
      const fetchMyBookings = async () => {
        try {
          setBookingsLoading(true);
          const { data } = await bookingService.getMyBookings();
          setBookings(data);
        } catch (error) {
          console.error("Failed to fetch customer bookings:", error);
        } finally {
          setBookingsLoading(false);
        }
      };
      fetchMyBookings();
    }
  }, [user]); // The dependency on 'user' ensures this runs when the user logs in

  // --- THIS IS THE CRITICAL FIX ---
  // The logic for the status badge colors is now fully implemented.
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (authLoading) {
    return <div className="text-center py-20">Loading profile...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: User Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <img
                src={user.profilePicture || `https://placehold.co/128x128/e2e8f0/64748b?text=${user.name.charAt(0)}`}
                alt={user.name}
                className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-blue-500 object-cover"
              />
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-600">{user.email}</p>
              <span className="mt-2 inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full capitalize">
                {user.role}
              </span>
            </div>
          </div>

          {/* Right Column: Dynamic Content based on Role */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              {user.role === 'provider' && (
                <div className="text-center p-8 border-2 border-dashed border-blue-300 rounded-lg">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">Provider Tools</h2>
                  <p className="text-gray-600 mb-6">Manage your services, view your bookings, and update your public profile from your dashboard.</p>
                  <Link to="/dashboard" className="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700">
                    Go to Your Dashboard
                  </Link>
                </div>
              )}

              {user.role === 'customer' && (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-4">My Bookings</h2>
                  {bookingsLoading ? (
                    <p>Loading your bookings...</p>
                  ) : bookings.length === 0 ? (
                    <div className="text-center">
                      <p className="text-gray-600 mb-4">You have no bookings yet.</p>
                      <Link to="/" className="text-blue-600 font-semibold hover:underline">Browse Services</Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {bookings.map(booking => (
                        <div key={booking._id} className="p-4 border rounded-lg flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold">{booking.service.title}</h3>
                            <p className="text-sm text-gray-500">Date: {new Date(booking.date).toLocaleDateString()}</p>
                          </div>
                          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${getStatusBadge(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

