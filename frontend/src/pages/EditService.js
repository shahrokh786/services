import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import serviceService from '../services/serviceService'; // <-- 1. IMPORT our dedicated services
import uploadService from '../services/uploadService';

const EditService = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        price: '',
        priceType: '',
        city: '',
        state: '',
        description: '',
        experience: ''
    });
    const [images, setImages] = useState([]);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const fetchService = async () => {
            try {
                // 2. The component now DELEGATES the data fetching to the service.
                const { data } = await serviceService.getServiceById(id);
                setFormData({
                    title: data.title,
                    category: data.category,
                    price: data.price,
                    priceType: data.priceType,
                    city: data.location.city,
                    state: data.location.state,
                    description: data.description,
                    experience: data.experience || ''
                });
                setImages(data.images || []);
            } catch (error) {
                console.error("Failed to fetch service for editing:", error);
                alert("Could not load service data.");
                navigate('/my-services');
            } finally {
                setLoading(false);
            }
        };
        fetchService();
    }, [id, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        try {
            // 3. Image uploads are also delegated to the uploadService.
            const imageUrl = await uploadService.uploadImage(file);
            setImages([...images, imageUrl]);
        } catch (error) {
            alert('Image upload failed.');
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
            // 4. Updating the service is also delegated to the serviceService.
            await serviceService.updateService(id, serviceData);
            alert('Service updated successfully!');
            navigate('/my-services');
        } catch (error) {
            alert('Error updating service: ' + (error.response?.data?.message || 'Please try again.'));
        }
    };

    if (loading) {
        return <div className="text-center py-20">Loading service for editing...</div>;
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">Edit Your Service</h1>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Image Management Section */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Service Images</label>
                            <div className="mt-4 flex flex-wrap gap-4 mb-4">
                                {images.map((imgUrl, index) => (
                                    <img key={index} src={imgUrl} alt={`Service preview ${index + 1}`} className="w-24 h-24 rounded-md object-cover" />
                                ))}
                            </div>
                            <input
                                type="file"
                                onChange={handleImageUpload}
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            {uploading && <p className="text-sm text-gray-500 mt-2">Uploading image...</p>}
                        </div>

                        {/* Form Fields */}
                        <input name="title" value={formData.title} onChange={handleChange} placeholder="Service Title" required className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="plumbing">Plumbing</option>
                            <option value="electrical">Electrical</option>
                            <option value="cleaning">Cleaning</option>
                            <option value="carpentry">Carpentry</option>
                            <option value="painting">Painting</option>
                        </select>
                        {/* Other form fields can be added here as needed */}
                        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Detailed Service Description" rows="5" required className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        
                        <div className="flex gap-4 pt-4">
                             <button type="button" onClick={() => navigate('/my-services')} className="w-full bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors">
                                Cancel
                            </button>
                            <button type="submit" disabled={uploading} className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400">
                                {uploading ? 'Waiting for upload...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditService;

