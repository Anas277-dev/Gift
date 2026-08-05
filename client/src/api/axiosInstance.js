import axios from 'axios';

// In production, fallback to live Vercel backend URL if VITE_API_URL env variable is omitted
const isProduction = import.meta.env.PROD;
const FALLBACK_API_URL = isProduction
  ? 'https://gift-backend-three.vercel.app/api'
  : '/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || FALLBACK_API_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('gifto_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
    }
    return Promise.reject(error.response ? error.response.data : error);
  }
);

export default axiosInstance;
