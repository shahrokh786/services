import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import serviceService from '../services/serviceService';
import bookingService from '../services/bookingService';
import Chat from '../components/Chat';

const StarRating = ({ rating, size = 'text-xl' }) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        stars.push(<span key={i} className={`${i <= rating ? 'text-yellow-400' : 'text-gray-300'} ${size}`}>&#9733;</span>);
    }
    return <div className="flex items-center">{stars}</div>;
};

const ServiceDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bookingData, setBookingData] = useState({ date: '', time: 'morning', address: '', description: '' });
    const [isChatOpen, setIsChatOpen] = useState(false);

    useEffect(() => {
        const fetchService = async () => {
            try {
                const response = await serviceService.getServiceById(id);
                setService(response.data);
            } catch (err) {
                setError('Could not load service details.');
            } finally {
                setLoading(false);
            }
        };
        fetchService();
    }, [id]);

    const handleOpenBookingModal = () => {
        if (!user) {
            alert('Please log in to book a service.');
            navigate('/login'); 
        } else {
            setShowBookingModal(true);
        }
    };

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const bookingPayload = { serviceId: service._id, ...bookingData };
            await bookingService.createBooking(bookingPayload);
            alert('Booking request sent successfully!');
            setShowBookingModal(false);
            navigate('/my-bookings');
        } catch (err) {
            alert('Failed to create booking. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleStartChat = () => {
        if (!user) {
            alert('Please log in to message the provider.');
        } else if (user._id === service.user._id) {
            alert("You cannot start a chat with yourself.");
        } else {
            setIsChatOpen(true);
        }
    };

    if (loading) return <div className="text-center py-20">Loading Service...</div>;
    if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
    if (!service) return <div className="text-center py-20">Service not found.</div>;

    // This is the intelligent safeguard to prevent self-booking
    const isOwner = user && user._id === service.user._id;

    return (
        <>
            <div className="bg-gray-50">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                        {/* --- RESTORED LEFT COLUMN --- */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-white p-4 rounded-lg shadow-md">
                                 <img src={service.images?.[0] || 'https://placehold.co/1200x800/e2e8f0/64748b?text=Service+Image'} alt={service.title} className="w-full h-96 object-cover rounded-lg"/>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h1 className="text-3xl font-bold text-gray-900">{service.title}</h1>
                                <div className="flex items-center mt-2">
                                    <StarRating rating={service.rating} />
                                    <p className="text-md text-gray-600 ml-2">{service.rating.toFixed(1)} ({service.numReviews || 0} reviews) &middot; <span className="capitalize">{service.location?.city}, {service.location?.state}</span></p>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">About this Service</h2>
                                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{service.description}</p>
                            </div>
                             <div className="bg-white p-6 rounded-lg shadow-md">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Meet Your Provider</h2>
                                 <div className="flex items-center">
                                     <img src={service.user?.profilePicture || `https://placehold.co/100x100/e2e8f0/64748b?text=${service.user?.name.charAt(0)}`} alt={service.user?.name} className="w-20 h-20 rounded-full mr-6 object-cover"/>
                                    <div>
                                        <h3 className="text-xl font-bold">{service.user?.name}</h3>
                                        <p className="text-gray-600">Joined in 2024</p>
                                    </div>
                                 </div>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">What Customers Are Saying</h2>
                                {service.reviews && service.reviews.length > 0 ? (
                                    <div className="space-y-6">
                                        {service.reviews.map((review) => (
                                            <div key={review._id} className="border-b last:border-b-0 pb-4">
                                                {/* ... review item JSX ... */}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-600">No reviews yet. Be the first to leave one after booking!</p>
                                )}
                            </div>
                        </div>

                        {/* --- RESTORED RIGHT COLUMN: BOOKING CARD --- */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 bg-white p-6 rounded-lg shadow-xl">
                                <div className="flex items-baseline mb-4">
                                    <span className="text-3xl font-bold text-gray-900">${service.price}</span>
                                    <span className="ml-2 text-gray-600 capitalize">/{service.priceType.replace('per ', '')}</span>
                                </div>
                                <div className="space-y-2">
                                    {isOwner ? (
                                        <Link to={`/edit-service/${service._id}`} className="block w-full text-center bg-gray-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-800">
                                            Manage Your Listing
                                        </Link>
                                    ) : (
                                        <>
                                            <button onClick={handleOpenBookingModal} className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700">Book Now</button>
                                            <button onClick={handleStartChat} className="w-full bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-300">Message Provider</button>
                                        </>
                                    )}
                                </div>
                                {!isOwner && <p className="text-xs text-gray-500 text-center mt-4">You won't be charged yet</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- RESTORED BOOKING MODAL WITH FORM FIELDS --- */}
            {showBookingModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={() => setShowBookingModal(false)}>
                    <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
                        <h2 className="text-2xl font-bold mb-6">Book: {service.title}</h2>
                        <form onSubmit={handleBookingSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Date</label>
                                <input type="date" required value={bookingData.date} onChange={(e) => setBookingData({...bookingData, date: e.target.value})} min={new Date().toISOString().split('T')[0]} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Preferred Time</label>
                               <select required value={bookingData.time} onChange={(e) => setBookingData({...bookingData, time: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
                                    <option value="morning">Morning (8AM - 12PM)</option>
                                    <option value="afternoon">Afternoon (12PM - 5PM)</option>
                               </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Service Address</label>
                                <textarea required value={bookingData.address} onChange={(e) => setBookingData({...bookingData, address: e.target.value})} rows="3" placeholder="Enter the full address..." className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"/>
                            </div>
                            <div className="flex justify-end gap-4 pt-4">
                                <button type="button" onClick={() => setShowBookingModal(false)} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancel</button>
                                <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-400">
                                    {isSubmitting ? 'Sending...' : 'Confirm Booking'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            
            {isChatOpen && ( <Chat otherUser={service.user} onClose={() => setIsChatOpen(false)} /> )}
        </>
    );
};

export default ServiceDetail;

