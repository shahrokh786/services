import axios from 'axios';

// The base URL for the upload endpoint
const API_URL = 'http://localhost:5000/api/upload';

/**
 * Uploads an image file to the backend.
 * @param {FormData} formData - The form data object containing the image file.
 * @returns {Promise} An axios promise for the request.
 */
const uploadImage = (formData) => {
    // For file uploads, we need to specify a special 'Content-Type' header
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    };

    return axios.post(API_URL, formData, config);
};

const uploadService = {
    uploadImage,
};

export default uploadService;
