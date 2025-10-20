
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/contact';

const sendMessage = (formData) => {
    return axios.post(API_URL, formData);
};

const contactService = {
    sendMessage,
};

export default contactService;
