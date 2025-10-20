import React from 'react';
import { Link } from 'react-router-dom';

// This component is now styled entirely with Tailwind CSS and has no external dependencies.
const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Main Links Section */}
        <div className="flex justify-center space-x-6 mb-4">
          <Link to="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link>
          <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link>
          <Link to="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link>
        </div>

        {/* Provider Link Section */}
        <div className="mb-4">
          <Link to="/provider-auth" className="text-gray-300 hover:text-white underline">
            Are you a Service Provider?
          </Link>
        </div>

        {/* Copyright Section */}
        <p className="text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} LocalServiceHub. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

