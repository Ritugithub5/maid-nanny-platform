import React, { createContext, useState, useContext, useEffect } from 'react';
import { loginUser, registerUser, getCurrentUser } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await getCurrentUser();
          if (response.data.success) {
            setUser(response.data.user);
          } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        } catch (err) {
          console.error('Auth check error:', err);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  // Register
  const register = async (userData) => {
    try {
      setError(null);
      const response = await registerUser(userData);
      
      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        return { success: true, user };
      } else {
        setError(response.data.message || 'Registration failed');
        return { success: false, error: response.data.message };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      setError(null);
      
      if (!email || !password) {
        setError('Please provide email and password');
        return { success: false, error: 'Please provide email and password' };
      }
      
      const response = await loginUser({ email, password });
      
      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        return { success: true, user };
      } else {
        setError(response.data.message || 'Login failed');
        return { success: false, error: response.data.message };
      }
    } catch (err) {
      // Handle different error scenarios
      let errorMessage = 'Login failed. Please try again.';
      
      if (err.response) {
        // Server responded with an error
        errorMessage = err.response.data?.message || errorMessage;
      } else if (err.request) {
        // Request was made but no response
        errorMessage = 'Server not responding. Please check your connection.';
      } else {
        // Something else happened
        errorMessage = err.message || errorMessage;
      }
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setError(null);
  };

  // Clear error
  const clearError = () => setError(null);

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    clearError,
    isAuthenticated: !!user,
    isHousehold: user?.role === 'household',
    isHelper: user?.role === 'helper',
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;