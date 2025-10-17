import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import ServiceCard from '../components/ServiceCard';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    city: '',
    search: '',
    minPrice: '',
    maxPrice: ''
  });
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setFilters(prev => ({ ...prev, category }));
    }
    fetchServices();
  }, [searchParams]);

  const fetchServices = async () => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await axios.get(`http://localhost:5000/api/services?${params}`);
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    fetchServices();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading services...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Filters</h3>
              
              {/* Search */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Search</label>
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Search services..."
                />
              </div>

              {/* Category */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="">All Categories</option>
                  <option value="plumbing">Plumbing</option>
                  <option value="electrical">Electrical</option>
                  <option value="cleaning">Cleaning</option>
                  <option value="carpentry">Carpentry</option>
                  <option value="painting">Painting</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Location */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">City</label>
                <input
                  type="text"
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Enter city..."
                />
              </div>

              {/* Price Range */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Price Range</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="w-1/2 p-2 border rounded"
                    placeholder="Min"
                  />
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="w-1/2 p-2 border rounded"
                    placeholder="Max"
                  />
                </div>
              </div>

              <button
                onClick={applyFilters}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              >
                Apply Filters
              </button>
            </div>
          </div>

          {/* Services Grid */}
          <div className="lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">
                Available Services {services.length > 0 && `(${services.length})`}
              </h1>
            </div>

            {services.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <h3 className="text-xl font-semibold mb-2">No services found</h3>
                <p className="text-gray-600">Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {services.map(service => (
                  <ServiceCard key={service._id} service={service} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;