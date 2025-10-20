import React, { useState } from 'react';
import contactService from '../services/contactService'; // <-- Import our dedicated service

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // The component now cleanly delegates the API call to the contactService.
      await contactService.sendMessage(formData);
      alert('Thank you for your message! We will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' }); // Clear the form on success
    } catch (error) {
      console.error('Error submitting contact form:', error);
      alert('An error occurred while sending your message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white text-center py-16">
        <h1 className="text-4xl font-bold">Contact Us</h1>
        <p className="text-lg text-blue-200 mt-2">We'd love to hear from you.</p>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Contact Information Side */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Get In Touch</h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <span className="text-2xl mt-1">📍</span>
                <div>
                  <h3 className="font-semibold">Address</h3>
                  <p className="text-gray-600">123 Service Street<br />New York, NY 10001</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <span className="text-2xl mt-1">📞</span>
                <div>
                  <h3 className="font-semibold">Phone</h3>
                  <p className="text-gray-600">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <span className="text-2xl mt-1">✉️</span>
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p className="text-gray-600">support@localservicehub.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form Side */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                type="text" name="name" placeholder="Your Name" required
                value={formData.name} onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email" name="email" placeholder="Your Email" required
                value={formData.email} onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text" name="subject" placeholder="Subject" required
                value={formData.subject} onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                name="message" placeholder="Your Message" rows="5" required
                value={formData.message} onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-md hover:bg-blue-700 transition-colors duration-300 disabled:bg-gray-400"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

