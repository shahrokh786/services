import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud } from 'lucide-react';

const CreateService = () => {
    const navigate = useNavigate();
    const [serviceData, setServiceData] = useState({
        title: '',
        description: '',
        category: 'plumbing',
        price: '',
        priceType: 'hourly',
        city: '',
        state: '',
        experience: '',
        image: null,
    });
    const [fileName, setFileName] = useState('No file chosen');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setServiceData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            setServiceData(prevData => ({ ...prevData, image: e.target.files[0] }));
            setFileName(e.target.files[0].name);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, you would use FormData to send this to your backend API
        console.log("Submitting new service:", serviceData);
        alert('Service created successfully! (See console for data)');
        navigate('/dashboard');
    };

    const inputStyle = "w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
    const labelStyle = "block text-sm font-medium text-gray-700 mb-2";

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-8">
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-10">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Create a New Service</h1>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className={labelStyle}>Service Images</label>
                        <label htmlFor="service-image" className="w-full flex items-center justify-center px-4 py-3 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
                            <UploadCloud className="w-6 h-6 text-gray-500 mr-3" />
                            <span className="text-gray-600">{fileName}</span>
                        </label>
                        <input type="file" id="service-image" onChange={handleFileChange} className="sr-only" />
                    </div>

                    <div>
                        <label htmlFor="title" className={labelStyle}>Service Title</label>
                        <input type="text" id="title" name="title" value={serviceData.title} onChange={handleChange} placeholder="e.g., Emergency Plumbing" required className={inputStyle} />
                    </div>
                    
                    <div>
                         <label htmlFor="category" className={labelStyle}>Category</label>
                         <select id="category" name="category" value={serviceData.category} onChange={handleChange} required className={inputStyle}>
                            <option value="plumbing">Plumbing</option>
                            <option value="electrical">Electrical</option>
                            <option value="cleaning">Cleaning</option>
                            <option value="painting">Painting</option>
                            <option value="carpentry">Carpentry</option>
                            <option value="other">Other</option>
                         </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="price" className={labelStyle}>Price ($)</label>
                            <input type="number" id="price" name="price" value={serviceData.price} onChange={handleChange} min="0" placeholder="50" required className={inputStyle} />
                        </div>
                        <div>
                             <label htmlFor="priceType" className={labelStyle}>Rate</label>
                             <select id="priceType" name="priceType" value={serviceData.priceType} onChange={handleChange} required className={inputStyle}>
                                <option value="hourly">Per Hour</option>
                                <option value="fixed">Fixed Price</option>
                             </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="city" className={labelStyle}>City</label>
                            <input type="text" id="city" name="city" value={serviceData.city} onChange={handleChange} placeholder="e.g., New York" required className={inputStyle} />
                        </div>
                        <div>
                            <label htmlFor="state" className={labelStyle}>State</label>
                            <input type="text" id="state" name="state" value={serviceData.state} onChange={handleChange} placeholder="e.g., NY" required className={inputStyle} />
                        </div>
                    </div>

                     <div>
                        <label htmlFor="experience" className={labelStyle}>Experience</label>
                        <input type="text" id="experience" name="experience" value={serviceData.experience} onChange={handleChange} placeholder="e.g., 5+ years" required className={inputStyle} />
                    </div>
                    
                    <div>
                        <label htmlFor="description" className={labelStyle}>Detailed Service Description</label>
                        <textarea id="description" name="description" value={serviceData.description} onChange={handleChange} rows="5" placeholder="Describe your service..." required className={inputStyle}></textarea>
                    </div>
                    
                    <div className="flex justify-center pt-4">
                        <button type="submit" className="w-full md:w-auto px-10 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700">Create Service</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateService;

