// File: frontend/src/api/axiosConfig.js
import axios from 'axios';

// Base URL for your backend API
const API_BASE_URL = 'http://localhost:5000/api';

// Create a configured instance of axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // IMPORTANT: Sends cookies (like auth tokens) with requests
});

// Optional: Add request/response interceptors here later if needed
// apiClient.interceptors.request.use(...)
// apiClient.interceptors.response.use(...)

export default apiClient;