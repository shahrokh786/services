import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import serviceService from '../services/serviceService';
import bookingService from '../services/bookingService';

// A reusable StarRating component to avoid code duplication.
const StarRating = ({ rating, size = 'text-xl' }) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        stars.push(
            <span key={i} className={`${i <= rating ? 'text-yellow-400' : 'text-gray-300'} ${size}`}>
                &#9733;
            </span>
        );
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
    const [bookingData, setBookingData] = useState({
        date: '',
        time: 'morning',
        address: '',
        description: ''
    });

    useEffect(() => {
        const fetchService = async () => {
            try {
                setLoading(true);
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

    if (loading) return <div className="text-center py-20">Loading Service...</div>;
    if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
    if (!service) return <div className="text-center py-20">Service not found.</div>;

    return (
        <>
            <div className="bg-gray-50">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                        {/* Left Column: Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-white p-4 rounded-lg shadow-md">
                                 <img src={service.images?.[0] || 'https://placehold.co/1200x800/e2e8f0/64748b?text=Service+Image'} alt={service.title} className="w-full h-96 object-cover rounded-lg"/>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h1 className="text-3xl font-bold text-gray-900">{service.title}</h1>
                                <div className="flex items-center mt-2">
                                    <StarRating rating={service.rating} />
                                    <p className="text-md text-gray-600 ml-2">
                                        {service.rating.toFixed(1)} ({service.numReviews} reviews) &middot; <span className="capitalize">{service.location?.city}, {service.location?.state}</span>
                                    </p>
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

                            {/* --- THIS IS THE UPGRADED, DYNAMIC REVIEWS SECTION --- */}
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">What Customers Are Saying</h2>
                                {service.reviews && service.reviews.length > 0 ? (
                                    <div className="space-y-6">
                                        {service.reviews.map((review) => (
                                            <div key={review._id} className="border-b last:border-b-0 pb-4">
                                                <div className="flex items-center mb-2">
                                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 mr-4">
                                                        {review.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold">{review.name}</p>
                                                        <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <StarRating rating={review.rating} size="text-lg" />
                                                <p className="text-gray-700 mt-2">{review.comment}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-600">No reviews yet. Be the first to leave one after booking!</p>
                                )}
                            </div>
                        </div>

                        {/* Right Column: Booking Card */}
                        <div className="lg:col-span-1">
                            {/* ... (Booking card JSX remains the same) ... */}
                        </div>
                    </div>
                </div>
            </div>
            {/* ... (Booking Modal JSX remains the same) ... */}
        </>
    );
};

export default ServiceDetail;

