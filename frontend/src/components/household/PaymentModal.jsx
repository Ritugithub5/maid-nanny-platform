import React, { useState } from 'react';
import axios from 'axios';
import { FaTimes, FaRupeeSign, FaCreditCard, FaMobile, FaUniversity } from 'react-icons/fa';

const PaymentModal = ({ booking, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');

  const paymentMethods = [
    { id: 'card', label: '💳 Credit/Debit Card', icon: <FaCreditCard /> },
    { id: 'upi', label: '📱 UPI (GPay, PhonePe, Paytm)', icon: <FaMobile /> },
    { id: 'netbanking', label: '🏦 Net Banking', icon: <FaUniversity /> }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      
      // Create payment
      const response = await axios.post(
        'http://localhost:5000/api/payments',
        {
          bookingId: booking._id,
          paymentMethod,
          amount: booking.totalPrice
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Complete payment (simulate success)
      await axios.put(
        `http://localhost:5000/api/payments/${response.data.data._id}/complete`,
        {
          transactionId: 'TXN' + Date.now(),
          paymentId: 'PAY' + Date.now(),
          signature: 'SIG' + Date.now()
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('✅ Payment completed successfully!');
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            💳 Payment
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        <div className="p-6">
          {/* Booking Summary */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-500">Booking Details</p>
            <p className="font-semibold text-gray-900">{booking.helperId?.fullName}</p>
            <p className="text-sm text-gray-600">{booking.serviceType}</p>
            <p className="text-sm text-gray-500">
              {new Date(booking.serviceDate).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              })} • {booking.startTime} - {booking.endTime}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              ❌ {error}
            </div>
          )}

          {/* Amount */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (₹)
            </label>
            <div className="relative">
              <FaRupeeSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="number"
                value={booking.totalPrice}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary bg-gray-100"
                disabled
              />
            </div>
          </div>

          {/* Payment Methods */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method
            </label>
            <div className="space-y-2">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setPaymentMethod(method.id)}
                  className={`w-full p-3 rounded-lg border-2 text-left transition ${
                    paymentMethod === method.id
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{method.icon}</span>
                    <span className="text-sm font-medium text-gray-700">
                      {method.label}
                    </span>
                    {paymentMethod === method.id && (
                      <span className="ml-auto text-primary">✓</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="border-t pt-4 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">₹{booking.totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Platform Fee (10%)</span>
              <span className="font-medium text-red-500">-₹{(booking.totalPrice * 0.10).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t">
              <span>Total</span>
              <span className="text-primary">₹{booking.totalPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-lg hover:bg-secondary transition font-semibold disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Processing...
              </>
            ) : (
              '💳 Pay Now'
            )}
          </button>

          <p className="text-xs text-gray-500 text-center mt-4">
            🔒 Secure payment gateway. Your information is safe.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;