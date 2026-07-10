import React, { useState } from 'react';
import axios from 'axios';
import { FaStar, FaTimes } from 'react-icons/fa';

const ReviewForm = ({ booking, onClose, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const handleCategoryChange = (category, value) => {
    setCategoryRatings({
      ...categoryRatings,
      [category]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (comment.length < 10) {
      setError('Please write at least 10 characters');
      return;
    }

    setLoading(true);
    setError(null);

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

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            ⭐ Rate Your Experience
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Helper Info */}
          <div className="bg-blue-50 rounded-xl p-4 flex items-center gap-4">
            <img
              src={booking.helperId?.profilePic || `https://ui-avatars.com/api/?name=${booking.helperId?.fullName}&background=4F46E5&color=fff&size=50`}
              alt={booking.helperId?.fullName}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-gray-900">{booking.helperId?.fullName}</p>
              <p className="text-sm text-gray-600">
                {booking.serviceType} • {new Date(booking.serviceDate).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              ❌ {error}
            </div>
          )}

          {/* Overall Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Overall Rating *
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  className="text-3xl focus:outline-none transition-transform hover:scale-110"
                >
                  <FaStar
                    className={`${
                      star <= (hover || rating)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    } transition-colors`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-500 flex items-center">
                {rating > 0 ? `${rating} / 5` : 'Select rating'}
              </span>
            </div>
          </div>

          {/* Category Ratings */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rate Specific Areas
            </label>
            <div className="space-y-3">
              {categories.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{cat.label}</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleCategoryChange(cat.name, star)}
                        className="text-lg focus:outline-none"
                      >
                        <FaStar
                          className={`${
                            star <= categoryRatings[cat.name]
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          } transition-colors`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Review *
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="4"
              placeholder="Share your experience with this helper..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
            <p className="text-xs text-gray-500 mt-1">
              {comment.length}/500 characters
            </p>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary text-white py-3 rounded-lg hover:bg-secondary transition font-semibold disabled:opacity-70"
            >
              {loading ? 'Submitting...' : '⭐ Submit Review'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;