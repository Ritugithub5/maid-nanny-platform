import React, { useState } from 'react';
import axios from 'axios';
import { FaTimes, FaCalendar, FaClock, FaMapMarkerAlt, FaInfoCircle } from 'react-icons/fa';

const BookingModal = ({ helper, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    serviceDate: '',
    startTime: '09:00',
    endTime: '18:00',
    specialInstructions: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      landmark: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const payload = {
        helperId: helper._id,
        serviceType: helper.serviceType?.[0] || 'maid',
        serviceDate: formData.serviceDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        specialInstructions: formData.specialInstructions,
        address: formData.address
      };

      await axios.post(
        'http://localhost:5000/api/bookings',
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('✅ Booking created successfully! Waiting for helper to accept.');
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking');
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
            📅 Book {helper.fullName}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Helper Info */}
          <div className="bg-blue-50 rounded-xl p-4 flex items-center gap-4">
            <img
              src={helper.profilePic || `https://ui-avatars.com/api/?name=${helper.fullName}&background=4F46E5&color=fff&size=50`}
              alt={helper.fullName}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-gray-900">{helper.fullName}</p>
              <p className="text-sm text-gray-600">
                {helper.serviceType?.join(', ')} • {helper.yearsOfExperience} years exp
              </p>
              <p className="text-sm text-green-600">
                ⭐ {helper.rating?.average?.toFixed(1) || '0.0'} ({helper.rating?.count || 0} reviews)
              </p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              ❌ {error}
            </div>
          )}

          {/* Service Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FaCalendar className="inline mr-2" /> Service Date *
            </label>
            <input
              type="date"
              name="serviceDate"
              value={formData.serviceDate}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FaClock className="inline mr-2" /> Start Time *
              </label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FaClock className="inline mr-2" /> End Time *
              </label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FaMapMarkerAlt className="inline mr-2" /> Address
            </label>
            <input
              type="text"
              name="address.street"
              value={formData.address.street}
              onChange={handleChange}
              placeholder="Street address"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary mb-2"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                name="address.city"
                value={formData.address.city}
                onChange={handleChange}
                placeholder="City"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              />
              <input
                type="text"
                name="address.pincode"
                value={formData.address.pincode}
                onChange={handleChange}
                placeholder="Pincode"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Special Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FaInfoCircle className="inline mr-2" /> Special Instructions
            </label>
            <textarea
              name="specialInstructions"
              value={formData.specialInstructions}
              onChange={handleChange}
              rows="3"
              placeholder="Any special requirements or instructions..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary text-white py-3 rounded-lg hover:bg-secondary transition font-semibold disabled:opacity-70"
            >
              {loading ? 'Creating Booking...' : '📅 Confirm Booking'}
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

export default BookingModal;