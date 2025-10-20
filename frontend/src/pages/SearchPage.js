import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import serviceService from '../services/serviceService';
import ServiceCard from '../components/ServiceCard';

// A small, reusable custom hook to make reading URL parameters easy.
// This is a common architectural pattern for clean code.
const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

const SearchPage = () => {
    const query = useQuery();
    const keyword = query.get('keyword');
    const category = query.get('category');

    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                setLoading(true);
                // We pass the search parameters from the URL directly to our service.
                const response = await serviceService.getAllServices({ keyword, category });
                setServices(response.data);
            } catch (error) {
                console.error("Failed to fetch search results:", error);
                setServices([]); // On error, ensure we show the "no results" message.
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
        // This useEffect will automatically re-run whenever the keyword or category in the URL changes.
    }, [keyword, category]);

    // A helper function to create a dynamic title for the page.
    const getTitle = () => {
        if (keyword) return `Search Results for "${keyword}"`;
        if (category) return `Services in "${category}"`;
        return 'Browse All Services';
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 capitalize">
                    {getTitle()}
                </h1>

                {loading ? (
                    <p className="text-center text-gray-600">Loading results...</p>
                ) : services.length > 0 ? (
                    <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {services.map(service => (
                            <ServiceCard key={service._id} service={service} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center bg-white p-12 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold text-gray-800">No Services Found</h2>
                        <p className="text-gray-600 mt-2">
                            We couldn't find any services matching your criteria. Please try a different search or category.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchPage;

