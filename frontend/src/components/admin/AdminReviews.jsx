import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { FaStar, FaArrowLeft, FaUser, FaEnvelope, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const AdminReviews = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Get all helpers with their reviews
      const response = await axios.get(
        'http://localhost:5000/api/helpers/admin/all',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const helpers = response.data.data || [];
      
      // Extract reviews from helpers
      const allReviews = [];
      helpers.forEach(helper => {
        if (helper.rating?.count > 0) {
          allReviews.push({
            helperId: helper._id,
            helperName: helper.fullName,
            email: helper.userId?.email || 'N/A',
            rating: helper.rating.average || 0,
            count: helper.rating.count || 0,
            serviceType: helper.serviceType?.join(', ') || 'N/A',
            verificationStatus: helper.verificationStatus || 'pending',
            profilePic: helper.profilePic || '',
            punctuality: helper.rating.punctuality || 0,
            professionalism: helper.rating.professionalism || 0,
            skills: helper.rating.skills || 0,
            communication: helper.rating.communication || 0
          });
        }
      });
      
      // Sort by rating (highest first)
      allReviews.sort((a, b) => b.rating - a.rating);
      setReviews(allReviews);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStar key="half" className="text-yellow-400" style={{ opacity: 0.5 }} />);
    }
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="text-gray-300" />);
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto"></div>
          <p className="mt-6 text-gray-600 text-lg">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/admin')}
              className="text-gray-500 hover:text-primary transition"
            >
              <FaArrowLeft />
            </button>
            <div className="text-2xl">⭐</div>
            <h1 className="text-xl font-bold text-gray-800">Admin - Reviews</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Welcome, <span className="font-semibold">{user?.name}</span>
            </span>
            <button
              onClick={() => navigate('/admin')}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition text-sm"
            >
              Dashboard
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <p className="text-2xl font-bold text-primary">{reviews.length}</p>
            <p className="text-sm text-gray-500">Total Reviews</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <p className="text-2xl font-bold text-green-600">
              {reviews.filter(r => r.rating >= 4).length}
            </p>
            <p className="text-sm text-gray-500">⭐ 4+ Star Reviews</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <p className="text-2xl font-bold text-orange-600">
              {reviews.length > 0 
                ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
                : '0.0'}
            </p>
            <p className="text-sm text-gray-500">Average Rating</p>
          </div>
        </div>

        {/* Reviews List */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              All Reviews ({reviews.length})
            </h2>
          </div>

          {reviews.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-700">No Reviews Yet</h3>
              <p className="text-gray-500 mt-2">
                Reviews will appear here once households submit them
              </p>
              <button
                onClick={() => navigate('/admin')}
                className="mt-4 bg-primary text-white px-6 py-2 rounded-lg hover:bg-secondary transition"
              >
                Go to Dashboard
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {reviews.map((review, index) => (
                <div key={index} className="px-6 py-4 hover:bg-gray-50 transition">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Helper Info */}
                    <div className="flex items-center gap-4">
                      <img
                        src={review.profilePic || `https://ui-avatars.com/api/?name=${review.helperName}&background=4F46E5&color=fff&size=50`}
                        alt={review.helperName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">{review.helperName}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-2">
                          <FaEnvelope className="text-gray-400 text-xs" />
                          {review.email}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                            {review.serviceType}
                          </span>
                          {review.verificationStatus === 'verified' ? (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1">
                              <FaCheckCircle className="w-3 h-3" /> Verified
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full flex items-center gap-1">
                              Pending
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Rating Details */}
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {renderStars(review.rating)}
                        </div>
                        <span className="font-bold text-lg text-gray-900">
                          {review.rating.toFixed(1)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {review.count} review{review.count > 1 ? 's' : ''}
                      </p>

                      {/* Category Ratings */}
                      <div className="flex flex-wrap gap-2 mt-1 text-xs">
                        {review.punctuality > 0 && (
                          <span className="bg-gray-100 px-2 py-0.5 rounded">
                            ⏰ {review.punctuality.toFixed(1)}
                          </span>
                        )}
                        {review.professionalism > 0 && (
                          <span className="bg-gray-100 px-2 py-0.5 rounded">
                            💼 {review.professionalism.toFixed(1)}
                          </span>
                        )}
                        {review.skills > 0 && (
                          <span className="bg-gray-100 px-2 py-0.5 rounded">
                            🛠️ {review.skills.toFixed(1)}
                          </span>
                        )}
                        {review.communication > 0 && (
                          <span className="bg-gray-100 px-2 py-0.5 rounded">
                            💬 {review.communication.toFixed(1)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>🛡️ Admin Panel - Maid & Nanny Service Management Platform</p>
          <p className="mt-1">© 2026 All rights reserved</p>
        </div>
      </div>
    </div>
  );
};

export default AdminReviews;