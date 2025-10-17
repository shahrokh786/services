import React from 'react';
import { Link } from 'react-router-dom';

const ServiceCard = ({ service }) => {
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <span
        key={i}
        className={i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      <img
        src={service.images?.[0] || '/default-service.jpg'}
        alt={service.title}
        className="w-full h-48 object-cover"
      />
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{service.title}</h3>
          <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">
            ${service.price}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {service.description}
        </p>

        <div className="flex items-center mb-3">
          <div className="flex mr-2">
            {renderStars(service.rating)}
          </div>
          <span className="text-sm text-gray-600">
            ({service.reviewCount || 0} reviews)
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img
              src={service.provider?.profilePicture || '/default-avatar.png'}
              alt={service.provider?.name}
              className="w-8 h-8 rounded-full mr-2"
            />
            <span className="text-sm text-gray-700">{service.provider?.name}</span>
          </div>
          
          <span className="text-sm text-gray-500 capitalize">
            {service.category}
          </span>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {service.location?.city}, {service.location?.state}
          </span>
          <Link
            to={`/services/${service._id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;