import React from 'react';
import { Link } from 'react-router-dom';

// This is a self-contained UI component. Its only job is to display the data it receives.
// All styling is done via Tailwind CSS classes for maximum portability and maintainability.
const ServiceCard = ({ service }) => {
  // Helper function to render star ratings visually
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const starArray = [];
    for (let i = 0; i < 5; i++) {
      starArray.push(
        <span key={i} className={i < fullStars ? 'text-yellow-400' : 'text-gray-300'}>
          &#9733; {/* Unicode star character */}
        </span>
      );
    }
    return starArray;
  };

  return (
    // The entire card is a clickable link to the detailed service page
    <Link to={`/service/${service._id}`} className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out overflow-hidden group">
      <div className="relative">
        {/* Service Image: Uses the first image from the service or a professional placeholder */}
        <img 
          src={service.images?.[0] || `https://placehold.co/600x400/3b82f6/white?text=${service.category}`} 
          alt={service.title} 
          className="w-full h-48 object-cover"
        />
        {/* Price Badge: Positioned neatly in the corner */}
        <div className="absolute top-2 right-2 bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-full shadow-lg">
          ${service.price} {service.priceType === 'per hour' ? '/hr' : ''}
        </div>
      </div>

      <div className="p-4">
        {/* Top line: Category and Location */}
        <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
          <span className="font-semibold capitalize">{service.category}</span>
          <span>{service.location?.city}, {service.location?.state}</span>
        </div>

        {/* Service Title: Truncated to prevent overflowing */}
        <h3 className="text-lg font-bold text-gray-900 truncate mb-2 group-hover:text-blue-600 transition-colors">{service.title}</h3>
        
        {/* Description: Limited to 2 lines for a consistent layout */}
        <p className="text-gray-700 text-sm h-10 overflow-hidden line-clamp-2 mb-3">
          {service.description}
        </p>

        {/* Ratings Section */}
        <div className="flex items-center mb-4">
          <div className="flex items-center">
            {renderStars(service.rating)}
          </div>
          <span className="text-gray-600 text-sm ml-2">({service.numReviews || 0} reviews)</span>
        </div>

        {/* Provider Info at the bottom */}
        <div className="flex items-center pt-3 border-t border-gray-200">
          <img 
            src={service.user?.profilePicture || `https://placehold.co/40x40/cccccc/ffffff?text=${service.user?.name.charAt(0)}`}
            alt={service.user?.name} 
            className="w-8 h-8 rounded-full mr-3 object-cover"
          />
          <span className="text-gray-800 font-semibold">{service.user?.name}</span>
        </div>
      </div>
    </Link>
  );
};

export default ServiceCard;

