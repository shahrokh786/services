import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    address: '',
    description: ''
  });
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    fetchService();
  }, [id]);

  const fetchService = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/services/${id}`);
      setService(response.data);
    } catch (error) {
      console.error('Error fetching service:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookService = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setShowBookingModal(true);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/bookings', {
        service: id,
        provider: service.provider._id,
        ...bookingData
      });
      
      alert('Booking request sent successfully!');
      setShowBookingModal(false);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!service) {
    return <div className="min-h-screen flex items-center justify-center">Service not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              {/* Service Images */}
              <div className="mb-6">
                <img
                  src={service.images?.[0] || '/default-service.jpg'}
                  alt={service.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>

              <h1 className="text-3xl font-bold mb-4">{service.title}</h1>
              
              <div className="flex items-center mb-4">
                <span className="text-2xl font-bold text-green-600">${service.price}</span>
                <span className="ml-2 text-gray-600 capitalize">({service.priceType})</span>
              </div>

              <p className="text-gray-700 mb-6">{service.description}</p>

              {/* Service Details */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="font-semibold mb-2">Category</h3>
                  <p className="capitalize text-gray-600">{service.category}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Location</h3>
                  <p className="text-gray-600">
                    {service.location?.city}, {service.location?.state}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Availability</h3>
                  <p className="capitalize text-green-600">{service.availability}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Rating</h3>
                  <div className="flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span className="ml-1">{service.rating} ({service.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Provider Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">About the Provider</h2>
              <div className="flex items-center mb-4">
                <img
                  src={service.provider?.profilePicture || '/default-avatar.png'}
                  alt={service.provider?.name}
                  className="w-16 h-16 rounded-full mr-4"
                />
                <div>
                  <h3 className="text-lg font-semibold">{service.provider?.name}</h3>
                  <p className="text-gray-600">{service.provider?.experience} years experience</p>
                </div>
              </div>
              
              {service.provider?.bio && (
                <p className="text-gray-700 mb-4">{service.provider.bio}</p>
              )}
              
              {service.provider?.skills && service.provider.skills.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {service.provider.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="text-xl font-semibold mb-4">Book This Service</h3>
              
              <div className="mb-4">
                <span className="text-2xl font-bold text-green-600">${service.price}</span>
                <span className="ml-2 text-gray-600 capitalize">({service.priceType})</span>
              </div>

              <button
                onClick={handleBookService}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition mb-4"
              >
                Book Now
              </button>

              <div className="text-center text-gray-600">
                <p>✓ Verified Provider</p>
                <p>✓ Secure Booking</p>
                <p>✓ Quality Guarantee</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Book Service</h2>
            
            <form onSubmit={handleBookingSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Date</label>
                <input
                  type="date"
                  required
                  value={bookingData.date}
                  onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                  className="w-full p-2 border rounded"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Preferred Time</label>
                <select
                  required
                  value={bookingData.time}
                  onChange={(e) => setBookingData({...bookingData, time: e.target.value})}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Time</option>
                  <option value="morning">Morning (8AM - 12PM)</option>
                  <option value="afternoon">Afternoon (12PM - 5PM)</option>
                  <option value="evening">Evening (5PM - 8PM)</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Service Address</label>
                <textarea
                  required
                  value={bookingData.address}
                  onChange={(e) => setBookingData({...bookingData, address: e.target.value})}
                  className="w-full p-2 border rounded"
                  rows="3"
                  placeholder="Enter your complete address..."
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Additional Details</label>
                <textarea
                  value={bookingData.description}
                  onChange={(e) => setBookingData({...bookingData, description: e.target.value})}
                  className="w-full p-2 border rounded"
                  rows="3"
                  placeholder="Describe what you need..."
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceDetail;
// Add these imports
import { useSocket } from '../context/SocketContext';
import Chat from '../components/Chat';
import { useState } from 'react';

// Add to ServiceDetail component
const [activeChat, setActiveChat] = useState(null);
const [chatUser, setChatUser] = useState(null);

const startChat = async () => {
  if (!user) {
    navigate('/login');
    return;
  }

  try {
    const response = await axios.post('http://localhost:5000/api/chats', {
      participantId: service.provider._id,
      bookingId: null // You can link to booking if needed
    });

    setActiveChat(response.data._id);
    setChatUser(service.provider);
  } catch (error) {
    console.error('Error starting chat:', error);
    alert('Failed to start chat');
  }
};

// Add chat button to the booking sidebar
<button
  onClick={startChat}
  className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition mb-2"
>
  Message Provider
</button>

// Add chat component at the end of return
{activeChat && chatUser && (
  <Chat
    chatId={activeChat}
    onClose={() => {
      setActiveChat(null);
      setChatUser(null);
    }}
    otherUser={chatUser}
  />
)}
