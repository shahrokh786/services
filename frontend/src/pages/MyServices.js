import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import serviceService from '../services/serviceService'; // <-- 1. IMPORT our dedicated service

const MyServices = () => {
    const [myServices, setMyServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyServices = async () => {
            try {
                setLoading(true);
                // 2. The component now DELEGATES the API call to the service.
                const { data } = await serviceService.getMyServices();
                setMyServices(data);
            } catch (error) {
                console.error("Could not fetch provider services", error);
                alert('Failed to fetch your services.');
            } finally {
                setLoading(false);
            }
        };
        fetchMyServices();
    }, []);

    const handleDelete = async (serviceId) => {
        if (window.confirm('Are you sure you want to permanently delete this service?')) {
            try {
                // 3. The delete logic is also delegated to the service.
                await serviceService.deleteService(serviceId);
                setMyServices(myServices.filter(service => service._id !== serviceId));
                alert('Service deleted successfully.');
            } catch (error) {
                console.error("Failed to delete service", error);
                alert('Deletion failed.');
            }
        }
    };

    if (loading) {
        return <div className="text-center py-20">Loading your services...</div>;
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
                    <h1 className="text-3xl font-bold text-gray-900">My Services</h1>
                    <Link 
                        to="/create-service" 
                        className="inline-block bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        + Add New Service
                    </Link>
                </div>

                {/* Conditional Rendering for Services List or Empty State */}
                {myServices.length === 0 ? (
                    // A professional "empty state" to guide the user
                    <div className="text-center bg-white p-12 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold text-gray-800">No Services Yet</h2>
                        <p className="text-gray-600 mt-2 mb-6">
                            You haven't created any services. Click the button below to add your first one!
                        </p>
                        <Link 
                            to="/create-service" 
                            className="inline-block bg-green-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-600 transition-colors"
                        >
                            Create Your First Service
                        </Link>
                    </div>
                ) : (
                    // The list of services, rendered as clean, modern cards
                    <div className="space-y-4">
                        {myServices.map(service => (
                            <div key={service._id} className="bg-white p-6 rounded-lg shadow-md flex justify-between items-center transition-shadow hover:shadow-lg">
                                <div className="flex items-center">
                                    <img 
                                        src={service.images?.[0] || 'https://placehold.co/80x80/e2e8f0/64748b?text=Img'} 
                                        alt={service.title}
                                        className="w-16 h-16 rounded-md object-cover mr-6"
                                    />
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">{service.title}</h3>
                                        <p className="text-green-600 font-semibold">${service.price} {service.priceType === 'per hour' ? '/hr' : ''}</p>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <Link to={`/edit-service/${service._id}`} className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">
                                        Edit
                                    </Link>
                                    <button onClick={() => handleDelete(service._id)} className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyServices;

