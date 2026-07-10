import axios from 'axios';

// Get the API URL from environment or use default
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log error for debugging
    console.error('API Error:', error.message);
    // Return a standardized error
    return Promise.reject({
      message: error.response?.data?.message || error.message || 'Network error',
      status: error.response?.status || 500,
      data: error.response?.data || null,
    });
  }
);

// Contact API calls
export const contactService = {
  // Submit contact form
  submitContact: async (data) => {
    try {
      const response = await api.post('/api/contact/submit', data);
      return response.data;
    } catch (error) {
      console.error('Submit contact error:', error);
      throw error;
    }
  },

  // Get all contacts
  getAllContacts: async () => {
    try {
      const response = await api.get('/api/contact/all');
      return response.data;
    } catch (error) {
      console.error('Get all contacts error:', error);
      // Return empty array on error to prevent breaking UI
      return { success: false, data: [], error: error.message };
    }
  },

  // Get contact info
  getContactInfo: async () => {
    try {
      const response = await api.get('/api/contact/info');
      return response.data;
    } catch (error) {
      console.error('Get contact info error:', error);
      // Return null on error to use defaults
      return { success: false, data: null, error: error.message };
    }
  },

  // Delete contact
  deleteContact: async (id) => {
    try {
      const response = await api.delete(`/api/contact/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete contact error:', error);
      throw error;
    }
  },

  // Update contact status
  updateContactStatus: async (id, status) => {
    try {
      const response = await api.put(`/api/contact/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Update contact status error:', error);
      throw error;
    }
  },
};

export default api;