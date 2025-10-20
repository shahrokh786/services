import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import bookingService from '../services/bookingService';
import serviceService from '../services/serviceService'; // <-- 1. IMPORT the serviceService to submit reviews

// A small, reusable sub-component for the star rating input in the modal
const StarRatingInput = ({ rating, setRating }) => {
    return (
        <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    className={`text-4xl cursor-pointer ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    onClick={() => setRating(star)}
                >
                    &#9733;
                </span>
            ))}
        </div>
    );
};

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- State for the Review Modal ---
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const { data } = await bookingService.getMyBookings();
                setBookings(data);
            } catch (error) {
                alert("Could not load your bookings.");
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    const handleOpenReviewModal = (booking) => {
        setSelectedBooking(booking);
        setShowReviewModal(true);
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            alert('Please select a star rating.');
            return;
        }
        setIsSubmittingReview(true);
        try {
            // 2. The component now DELEGATES the review submission to the serviceService.
            await serviceService.createReview(selectedBooking.service._id, { rating, comment });
            alert('Thank you for your review!');
            setShowReviewModal(false);
            setRating(0);
            setComment('');
            // Optionally, refresh the bookings to hide the "Leave a Review" button for this item
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to submit review.');
        } finally {
            setIsSubmittingReview(false);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'confirmed': return 'bg-blue-100 text-blue-800';
            case 'completed': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) return <div className="text-center py-20">Loading your bookings...</div>;

    return (
        <>
            <div className="bg-gray-50 min-h-screen">
                <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>
                    {bookings.length === 0 ? (
                        <div className="text-center bg-white p-12 rounded-lg shadow-md">
                           {/* ... Empty state JSX ... */}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {bookings.map((booking) => (
                                <div key={booking._id} className="bg-white p-6 rounded-lg shadow-md">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                                        <div className="flex items-center mb-4 sm:mb-0">
                                            {/* ... Booking info JSX ... */}
                                        </div>
                                        <div className="flex flex-col items-start sm:items-end">
                                            <span className={`text-sm font-semibold px-3 py-1 rounded-full ${getStatusBadge(booking.status)}`}>
                                                {booking.status}
                                            </span>
                                            {/* --- 3. THE "LEAVE A REVIEW" BUTTON --- */}
                                            {/* This button only appears for bookings that are 'completed'. */}
                                            {booking.status === 'completed' && (
                                                <button 
                                                    onClick={() => handleOpenReviewModal(booking)}
                                                    className="mt-4 bg-green-500 text-white text-sm font-semibold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
                                                >
                                                    Leave a Review
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* --- REVIEW MODAL --- */}
            {showReviewModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
                    <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
                        <h2 className="text-2xl font-bold mb-2">Leave a Review</h2>
                        <p className="text-gray-600 mb-6">For: {selectedBooking.service.title}</p>
                        <form onSubmit={handleReviewSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
                                <StarRatingInput rating={rating} setRating={setRating} />
                            </div>
                             <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Your Comment</label>
                                <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows="4" placeholder="Share your experience..." className="w-full px-3 py-2 border border-gray-300 rounded-md"/>
                            </div>
                            <div className="flex justify-end gap-4">
                                <button type="button" onClick={() => setShowReviewModal(false)} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancel</button>
                                <button type="submit" disabled={isSubmittingReview} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400">
                                    {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default MyBookings;

