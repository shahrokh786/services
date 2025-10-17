import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const categories = [
    { name: 'Plumbing', icon: '🔧', count: '150+ Providers' },
    { name: 'Electrical', icon: '⚡', count: '120+ Providers' },
    { name: 'Cleaning', icon: '🧹', count: '200+ Providers' },
    { name: 'Carpentry', icon: '🪚', count: '80+ Providers' },
    { name: 'Painting', icon: '🎨', count: '90+ Providers' },
    { name: 'Other', icon: '🔩', count: '100+ Providers' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">
            Find Trusted Local Service Providers
          </h1>
          <p className="text-xl mb-8">
            Connect with skilled professionals in your neighborhood
          </p>
          <Link 
            to="/services" 
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition"
          >
            Find Services
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Popular Service Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={`/services?category=${category.name.toLowerCase()}`}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer text-center"
              >
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                <p className="text-gray-600">{category.count}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Search Services</h3>
              <p className="text-gray-600">Find local service providers in your area</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📅</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Book Instantly</h3>
              <p className="text-gray-600">Schedule appointments that work for you</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Quality Service</h3>
              <p className="text-gray-600">Receive professional service with satisfaction guarantee</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;