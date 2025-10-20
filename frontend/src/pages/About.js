import React from 'react';

// 1. ARCHITECTURAL UPGRADE: We create a reusable sub-component for our feature cards.
// This enforces the DRY (Don't Repeat Yourself) principle.
const FeatureCard = ({ icon, title, children }) => (
  <div className="text-center p-8 bg-white rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
    <div className="flex items-center justify-center h-16 w-16 mx-auto mb-6 bg-blue-100 rounded-full">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{children}</p>
  </div>
);

const About = () => {
  // We define our features as data, separating content from presentation.
  const features = [
    {
      // 2. ARCHITECTURAL UPGRADE: Emojis are replaced with professional, scalable SVG icons.
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
      title: 'Verified Providers',
      description: 'Every provider on our platform is background-checked and vetted by our team to ensure the highest quality and safety for our users.',
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
      title: 'Secure Payments',
      description: 'Our integrated payment system uses industry-leading encryption to ensure your transactions are safe, secure, and transparent every time.',
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" /></svg>,
      title: 'Satisfaction Guarantee',
      description: 'We stand by the quality of our providers. We offer a 100% satisfaction guarantee on all services booked through our platform.',
    },
  ];

  return (
    <div className="bg-gray-50">
      {/* Main Header Section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl lg:text-6xl">
          About LocalServiceHub
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600">
          Our mission is to connect communities with trusted, skilled, and reliable service providers, making life easier one service at a time.
        </p>
      </div>

      {/* Core Promises Section */}
      <div className="bg-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Our Core Promises</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
              We are built on a foundation of trust, quality, and security.
            </p>
          </div>
          {/* 3. We now map over our data and render our reusable component. This is clean and scalable. */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <FeatureCard key={feature.title} icon={feature.icon} title={feature.title}>
                {feature.description}
              </FeatureCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

