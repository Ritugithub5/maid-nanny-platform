import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaStar, FaArrowLeft, FaCalendar, FaClock } from 'react-icons/fa';

const ReviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const categories = [
    { name: 'punctuality', label: '⏰ Punctuality' },
    { name: 'professionalism', label: '💼 Professionalism' },
    { name: 'skills', label: '🛠️ Skills' },
    { name: 'communication', label: '💬 Communication' }
  ];

  const [categoryRatings, setCategoryRatings] = useState({
    punctuality: 0,
    professionalism: 0,
    skills: 0,
    communication: 0
  });

  const fetchBooking = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'http://localhost:5000/api/bookings/me',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const foundBooking = response.data.data.find(b => b._id === id);
      if (foundBooking) {
        setBooking(foundBooking);
      } else {
        setError('Booking not found');
      }
    } catch (err) {
      setError('Failed to load booking');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBooking();
  }, [fetchBooking]);

  const handleCategoryChange = (category, value) => {
    setCategoryRatings({
      ...categoryRatings,
      [category]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    if (comment.length < 10) {
      alert('Please write at least 10 characters');
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/reviews',
        {
          bookingId: booking._id,
          rating,
          comment,
          categories: categoryRatings
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto"></div>
          <p className="mt-6 text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'This booking does not exist'}</p>
          <button onClick={() => navigate('/dashboard')} className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary transition">Go to Dashboard</button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-green-600 mb-2">Review Submitted!</h2>
          <p className="text-gray-600">Thank you for your feedback!</p>
          <p className="text-sm text-gray-500 mt-2">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => navigate('/dashboard')} className="mb-6 flex items-center text-gray-600 hover:text-primary transition">
          <FaArrowLeft className="mr-2" /> Back to Dashboard
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-6">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">⭐ Rate Your Experience</h1>
            <p className="text-blue-100 mt-1">Share your feedback about the service</p>
          </div>

          <div className="p-8">
            <div className="bg-gray-50 rounded-xl p-4 mb-6 flex items-center gap-4">
              <img src={booking.helperId?.profilePic || `https://ui-avatars.com/api/?name=${booking.helperId?.fullName}&background=4F46E5&color=fff&size=50`} alt={booking.helperId?.fullName} className="w-12 h-12 rounded-full object-cover" />
              <div>
                <p className="font-semibold text-gray-900">{booking.helperId?.fullName}</p>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <FaCalendar className="text-gray-400" />
                  {new Date(booking.serviceDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  <FaClock className="text-gray-400 ml-2" />
                  {booking.startTime} - {booking.endTime}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Overall Rating *</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => setRating(star)} onMouseEnter={() => setHover(star)} onMouseLeave={() => setHover(0)} className="text-3xl focus:outline-none transition-transform hover:scale-110">
                      <FaStar className={`${star <= (hover || rating) ? 'text-yellow-400' : 'text-gray-300'} transition-colors`} />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-500 flex items-center">{rating > 0 ? `${rating} / 5` : 'Select rating'}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rate Specific Areas</label>
                <div className="space-y-3">
                  {categories.map((cat) => (
                    <div key={cat.name} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{cat.label}</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button key={star} type="button" onClick={() => handleCategoryChange(cat.name, star)} className="text-lg focus:outline-none">
                            <FaStar className={`${star <= categoryRatings[cat.name] ? 'text-yellow-400' : 'text-gray-300'} transition-colors`} />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Review *</label>
                <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows="4" placeholder="Share your experience with this helper..." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
                <p className="text-xs text-gray-500 mt-1">{comment.length}/500 characters</p>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button type="submit" disabled={submitting} className="flex-1 bg-primary text-white py-3 rounded-lg hover:bg-secondary transition font-semibold disabled:opacity-70">
                  {submitting ? 'Submitting...' : '⭐ Submit Review'}
                </button>
                <button type="button" onClick={() => navigate('/dashboard')} className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;