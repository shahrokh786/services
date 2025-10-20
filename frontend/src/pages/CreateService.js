import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import serviceService from '../services/serviceService'; // <-- Import our dedicated services
import uploadService from '../services/uploadService';

const CreateService = () => {
    const [formData, setFormData] = useState({
        title: '',
        category: 'plumbing',
        price: '',
        priceType: 'per hour',
        city: '',
        state: '',
        description: '',
        experience: ''
    });
    const [images, setImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            // The component now DELEGATES the image upload to the uploadService.
            const imageUrl = await uploadService.uploadImage(file);
            setImages([...images, imageUrl]);
        } catch (error) {
            console.error('Image upload failed:', error);
            alert('Image upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const serviceData = {
                ...formData,
                location: { city: formData.city, state: formData.state },
                images: images
            };
            // The component now DELEGATES the service creation to the serviceService.
            const response = await serviceService.createService(serviceData);
            alert('Service created successfully!');
            navigate(`/service/${response.data._id}`);
        } catch (error) {
            console.error('Failed to create service:', error);
            alert('Error creating service: ' + (error.response?.data?.message || 'Please try again.'));
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">Create a New Service</h1>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Image Upload Section */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Service Images</label>
                            <input
                                type="file"
                                onChange={handleImageUpload}
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            {uploading && <p className="text-sm text-gray-500 mt-2">Uploading image...</p>}
                            <div className="mt-4 flex flex-wrap gap-4">
                                {images.map((imgUrl, index) => (
                                    <img key={index} src={imgUrl} alt={`Service preview ${index + 1}`} className="w-24 h-24 rounded-md object-cover" />
                                ))}
                            </div>
                        </div>

                        {/* Form Fields */}
                        <input name="title" value={formData.title} onChange={handleChange} placeholder="Service Title (e.g., 'Emergency Plumbing')" required className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="plumbing">Plumbing</option>
                            <option value="electrical">Electrical</option>
                            <option value="cleaning">Cleaning</option>
                            <option value="carpentry">Carpentry</option>
                            <option value="painting">Painting</option>
                        </select>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <input name="price" type="number" value={formData.price} onChange={handleChange} placeholder="Price" required className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            <select name="priceType" value={formData.priceType} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="per hour">Per Hour</option>
                                <option value="fixed">Fixed Price</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <input name="city" value={formData.city} onChange={handleChange} placeholder="City (e.g., New York)" required className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            <input name="state" value={formData.state} onChange={handleChange} placeholder="State (e.g., NY)" required className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <input name="experience" value={formData.experience} onChange={handleChange} placeholder="Experience (e.g., 5+ years)" className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Detailed Service Description" rows="5" required className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        
                        <button type="submit" disabled={uploading} className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300 disabled:bg-gray-400">
                            {uploading ? 'Waiting for upload...' : 'Create Service'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateService;

