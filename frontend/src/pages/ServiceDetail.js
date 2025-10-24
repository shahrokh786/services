// File: frontend/src/pages/ServiceDetail.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import serviceService from '../services/serviceService';
import bookingService from '../services/bookingService';
// --- ADDED: Payment Service and Stripe ---
import paymentService from '../services/paymentService'; // Import payment service
import { loadStripe } from '@stripe/stripe-js'; // Import Stripe library

import Chat from '../components/Chat';

// --- ADDED: Load Stripe (using REACT_APP_ prefix for Create React App) ---
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'YOUR_FALLBACK_PK_KEY'); // Replace fallback

// StarRating component (Unchanged)
const StarRating = ({ rating, size = 'text-xl' }) => { /* ... */ };

const ServiceDetail = () => {
    const { id: serviceId } = useParams(); // Use serviceId for clarity
    const { user } = useAuth();
    const navigate = useNavigate();

    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showBookingModal, setShowBookingModal] = useState(false);
    const [isSubmittingBooking, setIsSubmittingBooking] = useState(false); // Renamed for clarity
    const [bookingData, setBookingData] = useState({ date: '', time: 'morning', address: '', description: '' });
    const [isChatOpen, setIsChatOpen] = useState(false);
    // --- ADDED: State for payment ---
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

    // Data Fetching Effect (Unchanged from your version, added serviceId)
    useEffect(() => {
        const fetchService = async () => {
            setLoading(true); // Set loading true
            setError(null); // Clear errors
            try {
                const response = await serviceService.getServiceById(serviceId); // Use serviceId
                setService(response.data);
            } catch (err) {
                setError('Could not load service details.');
            } finally {
                setLoading(false);
            }
        };
        fetchService();
    }, [serviceId]); // Depend on serviceId

    // --- CORRECTED: Booking Modal Handler ---
const handleOpenBookingModal = () => {
    // 1. Check if user is logged in
    if (!user) {
        alert('Please log in to book this service.');
        navigate('/login');
        return; // Stop execution
    }
    // 2. Check if the user is the owner (using the existing isOwner variable)
    // We must ensure isOwner is defined *before* this function is called,
    // so we'll check it here using the same logic as your `isOwner` constant.
    const checkIsOwner = user && service?.user?._id && user._id === service.user._id;
    if (checkIsOwner) {
         alert('You cannot book your own service.');
         return; // Stop execution
    }
    // 3. If checks pass, open the modal
    setShowBookingModal(true);
};

// --- CORRECTED: Booking Submit Handler ---
const handleBookingSubmit = async (e) => {
    e.preventDefault(); // Prevent form from reloading the page
    if (!service?._id) {
         alert('Error: Service ID is missing. Cannot create booking.');
         return;
    }

    setIsSubmittingBooking(true);
    setError(null); // Clear previous errors

    try {
        // Construct the payload required by the backend
        const bookingPayload = {
            serviceId: service._id,
            providerId: service.user?._id, // Send the provider's ID
            date: bookingData.date,
            time: bookingData.time,
            address: bookingData.address,
            description: bookingData.description,
        };

        // Log the payload for debugging
        console.log("Submitting Booking Payload:", bookingPayload);

        // Call the service (ensure bookingService.js exists and is imported)
        await bookingService.createBooking(bookingPayload);

        // Handle success
        alert('Booking request sent successfully!');
        setShowBookingModal(false); // Close modal
        setBookingData({ date: '', time: 'morning', address: '', description: '' }); // Reset form
        navigate('/my-bookings'); // Redirect to customer's booking list

    } catch (err) {
        // Handle failure
        console.error("Failed to create booking:", err);
        // Set an error to display to the user in the UI
        setError(err.response?.data?.message || err.message || 'Failed to send booking request. Please try again.');
        // We can keep the modal open so the user sees the error context
    } finally {
        // Stop the loading state
        setIsSubmittingBooking(false);
    }
};
    // Chat Handler (Using service.user as per your version)
    const handleStartChat = () => {
         const providerId = service?.user?._id; // Get ID from service.user
         if (!user) alert('Please log in to message the provider.');
         else if (!providerId) alert("Provider info missing.");
         else if (user._id === providerId) alert("You cannot chat with yourself.");
         else setIsChatOpen(true);
     };

    // --- ADDED: Payment Handler ---
    const handlePayment = async () => {
        if (!user) { alert('Please log in to pay.'); navigate('/login'); return; }
        if (!service?._id) { alert('Service details missing.'); return; }

        setIsProcessingPayment(true);
        setError(null);
        try {
            const { data } = await paymentService.createCheckoutSession(service._id, 1); // Qty=1
            const sessionId = data.sessionId;
            if (!sessionId) throw new Error('No session ID received.');

            const stripe = await stripePromise;
            if (!stripe) throw new Error('Stripe.js failed.');

            const { error } = await stripe.redirectToCheckout({ sessionId });
            if (error) throw error; // Throw Stripe error if redirection fails

        } catch (err) {
            console.error("Payment initiation failed:", err);
            setError(err.response?.data?.message || err.message || 'Payment initiation failed.');
        } finally {
            setIsProcessingPayment(false);
        }
    };


    // --- Loading/Error/Not Found ---
    if (loading) return <div className="text-center py-20">Loading Service...</div>;
    if (error) return <div className="max-w-4xl mx-auto my-10 p-4 bg-red-100 text-red-700">{error}</div>; // Display error
    if (!service) return <div className="text-center py-20">Service not found.</div>;

    // --- CORRECTED: Ownership check using service.user as per your data model ---
    const isOwner = user && service?.user?._id && user._id === service.user._id;
    console.log(`ServiceDetail Render: UserID=${user?._id}, ServiceUserID=${service?.user?._id}, isOwner=${isOwner}`); // Debug Log

    // --- Use field names from your data model ---
    const serviceName = service.title || "Service"; // Use title
    const serviceImage = service.images?.[0] || 'https://placehold.co/1200x800/e2e8f0/64748b?text=Service+Image'; // Use images array
    const providerName = service.user?.name || 'Provider'; // Use service.user.name
    const providerInitial = providerName.charAt(0).toUpperCase();


    return (
        <>
            <div className="bg-gray-50">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                        {/* --- LEFT COLUMN (Using your field names) --- */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-white p-4 rounded-lg shadow-md">
                                <img src={serviceImage} alt={serviceName} className="w-full h-96 object-cover rounded-lg"/>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h1 className="text-3xl font-bold text-gray-900">{serviceName}</h1>
                                {/* ... StarRating, location ... */}
                                 <StarRating rating={service.rating || 0} />
                                 <p className="text-md text-gray-600 ml-2">({service.numReviews || 0} reviews) &middot; <span className="capitalize">{service.location?.city}, {service.location?.state}</span></p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">About this Service</h2>
                                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{service.description}</p>
                            </div>
                             <div className="bg-white p-6 rounded-lg shadow-md">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Meet Your Provider</h2>
                                 <div className="flex items-center">
                                     {/* Use service.user for provider info */}
                                     <img src={service.user?.profilePicture || `https://placehold.co/100x100/e2e8f0/64748b?text=${providerInitial}`} alt={providerName} className="w-20 h-20 rounded-full mr-6 object-cover"/>
                                    <div>
                                        <h3 className="text-xl font-bold">{providerName}</h3>
                                        {/* <p className="text-gray-600">Joined in ...</p> */}
                                    </div>
                                 </div>
                             </div>
                            {/* Reviews section (using service.reviews) */}
                             <div className="bg-white p-6 rounded-lg shadow-md">
                                 <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">What Customers Are Saying</h2>
                                 {/* ... Render service.reviews ... */}
                                  {(!service.reviews || service.reviews.length === 0) && <p>No reviews yet.</p>}
                             </div>
                        </div>

                        {/* --- RIGHT COLUMN: CORRECTED BUTTON VISIBILITY --- */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 bg-white p-6 rounded-lg shadow-xl">
                                <div className="flex items-baseline mb-4">
                                    <span className="text-3xl font-bold text-gray-900">${service.price}</span>
                                    <span className="ml-2 text-gray-600 capitalize">/{service.priceType?.replace('per ', '')}</span>
                                </div>
                                <div className="space-y-3">
                                    {/* --- Use the corrected isOwner check --- */}
                                    {isOwner ? (
                                        <Link to={`/edit-service/${service._id}`} className="block w-full text-center bg-gray-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-800">
                                            Manage Your Listing
                                        </Link>
                                    ) : (
                                        // Show Pay/Book/Message only if NOT the owner
                                        <>
                                            <button onClick={handlePayment} disabled={isProcessingPayment} className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 disabled:bg-gray-400">
                                                {isProcessingPayment ? 'Processing...' : 'Pay Now'}
                                            </button>
                                            <button onClick={handleOpenBookingModal} className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700">Book Service</button>
                                            <button onClick={handleStartChat} className="w-full bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-300">Message Provider</button>
                                        </>
                                    )}
                                </div>
                                {!isOwner && <p className="text-xs text-gray-500 text-center mt-4">Secure payment via Stripe.</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Booking Modal (using serviceName / service.title) */}
            {showBookingModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg w-full max-w-lg p-6">
                        <h3 className="text-xl font-bold mb-4">Book {serviceName}</h3>
                        <form onSubmit={handleBookingSubmit}>
                            <label className="block mb-2">
                                Date
                                <input
                                    type="date"
                                    value={bookingData.date}
                                    onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                                    required
                                    className="mt-1 w-full border rounded px-2 py-1"
                                />
                            </label>
                            <label className="block mb-2">
                                Time
                                <select
                                    value={bookingData.time}
                                    onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                                    className="mt-1 w-full border rounded px-2 py-1"
                                >
                                    <option value="morning">Morning</option>
                                    <option value="afternoon">Afternoon</option>
                                    <option value="evening">Evening</option>
                                </select>
                            </label>
                            <label className="block mb-2">
                                Address
                                <input
                                    type="text"
                                    value={bookingData.address}
                                    onChange={(e) => setBookingData({ ...bookingData, address: e.target.value })}
                                    className="mt-1 w-full border rounded px-2 py-1"
                                />
                            </label>
                            <label className="block mb-4">
                                Notes
                                <textarea
                                    value={bookingData.description}
                                    onChange={(e) => setBookingData({ ...bookingData, description: e.target.value })}
                                    className="mt-1 w-full border rounded px-2 py-1"
                                />
                            </label>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setShowBookingModal(false)}
                                    className="px-4 py-2 bg-gray-200 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmittingBooking}
                                    className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
                                >
                                    {isSubmittingBooking ? 'Booking...' : 'Confirm Booking'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Chat Window (using service.user) */}
            {isChatOpen && service.user && ( // Use service.user here
                 <Chat otherUser={service.user} onClose={() => setIsChatOpen(false)} />
            )}
        </>
    );
};

export default ServiceDetail;