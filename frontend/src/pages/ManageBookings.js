import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import bookingService from '../services/bookingService'; // <-- Import our dedicated booking service

const ManageBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProviderBookings = async () => {
            try {
                setLoading(true);
                // This page fetches data using the dedicated provider endpoint.
                const { data } = await bookingService.getProviderBookings();
                setBookings(data);
            } catch (error) {
                console.error("Failed to fetch provider bookings:", error);
                alert("Could not load your bookings.");
            } finally {
                setLoading(false);
            }
        };
        fetchProviderBookings();
    }, []);

    const handleStatusUpdate = async (bookingId, newStatus) => {
        try {
            // This is an "optimistic update" for a snappy user experience.
            // We update the UI state immediately, assuming the backend call will succeed.
            const updatedBookings = bookings.map(b => 
                b._id === bookingId ? { ...b, status: newStatus } : b
            );
            setBookings(updatedBookings);

            // Then, we send the actual update request to the backend.
            await bookingService.updateBookingStatus(bookingId, newStatus);
        } catch (error) {
            console.error("Failed to update booking status:", error);
            alert("Failed to update status. Please try again.");
            // In a real production app, we would add logic here to revert the UI change if the backend call fails.
        }
    };
    
    // Helper function for styling the status badges
    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'confirmed': return 'bg-blue-100 text-blue-800';
            case 'completed': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return <div className="text-center py-20">Loading your bookings...</div>;
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Your Bookings</h1>

                {bookings.length === 0 ? (
                    <div className="text-center bg-white p-12 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold text-gray-800">No Bookings Yet</h2>
                        <p className="text-gray-600 mt-2">You don't have any incoming booking requests at the moment.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <ul className="divide-y divide-gray-200">
                            {bookings.map((booking) => (
                                <li key={booking._id} className="p-6">
                                    <div className="flex flex-col sm:flex-row justify-between">
                                        <div>
                                            <h3 className="text-lg font-bold text-blue-600">{booking.service?.title}</h3>
                                            <p className="text-sm text-gray-700 mt-1">
                                                <span className="font-semibold">Customer:</span> {booking.customer?.name} ({booking.customer?.email})
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                <span className="font-semibold">Date:</span> {new Date(booking.date).toLocaleDateString()}
                                            </p>
                                            <p className="text-sm text-gray-600 capitalize">
                                                <span className="font-semibold">Time:</span> {booking.time}
                                            </p>
                                        </div>
                                        <div className="mt-4 sm:mt-0 flex flex-col items-start sm:items-end">
                                            <p className="text-lg font-bold">${booking.price}</p>
                                            <div className={`mt-1 text-sm font-semibold px-3 py-1 rounded-full ${getStatusBadge(booking.status)}`}>
                                                {booking.status}
                                            </div>
                                            {/* Action buttons are only shown for pending requests */}
                                            {booking.status === 'pending' && (
                                                <div className="flex space-x-2 mt-4">
                                                    <button onClick={() => handleStatusUpdate(booking._id, 'confirmed')} className="bg-green-500 text-white text-sm font-semibold py-1 px-3 rounded-md hover:bg-green-600 transition-colors">Confirm</button>
                                                    <button onClick={() => handleStatusUpdate(booking._id, 'cancelled')} className="bg-red-500 text-white text-sm font-semibold py-1 px-3 rounded-md hover:bg-red-600 transition-colors">Decline</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageBookings;

