import axios from 'axios';

// Create axios instance with base URL
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if it exists
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const registerUser = (userData) => API.post('/auth/register', userData);
export const loginUser = (userData) => API.post('/auth/login', userData);
export const getCurrentUser = () => API.get('/auth/me');

// Helper APIs (will add later)
// export const getHelpers = () => API.get('/helpers');
// export const getHelperById = (id) => API.get(`/helpers/${id}`);

// Booking APIs (will add later)
// export const createBooking = (data) => API.post('/bookings', data);
// export const getMyBookings = () => API.get('/bookings/me');

export default API;