import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, [activeTab]);

  const fetchUserData = async () => {
    try {
      if (activeTab === 'bookings') {
        const response = await axios.get('http://localhost:5000/api/bookings/my-bookings');
        setBookings(response.data);
      } else if (activeTab === 'services' && user?.role === 'provider') {
        const response = await axios.get('http://localhost:5000/api/services/my-services');
        setServices(response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Total Bookings</h3>
            <p className="text-3xl font-bold text-blue-600">{bookings.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Active Services</h3>
            <p className="text-3xl font-bold text-green-600">
              {services.filter(s => s.isActive).length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Rating</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {user?.rating || '4.5'} ★
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('bookings')}
                className={`py-4 px-6 font-medium ${
                  activeTab === 'bookings'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                My Bookings
              </button>
              {user?.role === 'provider' && (
                <button
                  onClick={() => setActiveTab('services')}
                  className={`py-4 px-6 font-medium ${
                    activeTab === 'services'
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  My Services
                </button>
              )}
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-6 font-medium ${
                  activeTab === 'profile'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Profile
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'bookings' && <BookingsTab bookings={bookings} />}
            {activeTab === 'services' && <ServicesTab services={services} />}
            {activeTab === 'profile' && <ProfileTab user={user} />}
          </div>
        </div>
      </div>
    </div>
  );
};

const BookingsTab = ({ bookings }) => {
  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">My Bookings</h2>
      {bookings.length === 0 ? (
        <p className="text-gray-600">No bookings found.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map(booking => (
            <div key={booking._id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold">{booking.service?.title}</h3>
                <span className={`px-2 py-1 rounded text-sm ${getStatusColor(booking.status)}`}>
                  {booking.status.replace('-', ' ')}
                </span>
              </div>
              <p className="text-gray-600 mb-2">Provider: {booking.provider?.name}</p>
              <p className="text-gray-600">Date: {new Date(booking.date).toLocaleDateString()}</p>
              <p className="text-gray-600">Price: ${booking.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ServicesTab = ({ services }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">My Services</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          Add New Service
        </button>
      </div>
      
      {services.length === 0 ? (
        <p className="text-gray-600">No services listed yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map(service => (
            <div key={service._id} className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">{service.title}</h3>
              <p className="text-gray-600 mb-2">{service.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-green-600 font-semibold">${service.price}</span>
                <span className={`px-2 py-1 rounded text-sm ${
                  service.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {service.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ProfileTab = ({ user }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-2">Personal Info</h3>
          <p><strong>Name:</strong> {user?.name}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Phone:</strong> {user?.phone}</p>
          <p><strong>Role:</strong> <span className="capitalize">{user?.role}</span></p>
        </div>
        
        {user?.address && (
          <div>
            <h3 className="font-semibold mb-2">Address</h3>
            <p>{user.address.street}</p>
            <p>{user.address.city}, {user.address.state} {user.address.zipCode}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;