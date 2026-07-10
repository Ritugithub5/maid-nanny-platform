import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { FaArrowLeft, FaRupeeSign, FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';

const PaymentsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    amount: 0
  });

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'http://localhost:5000/api/payments/me',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const data = response.data.data || [];
      setPayments(data);
      
      setSummary({
        total: data.length,
        completed: data.filter(p => p.paymentStatus === 'completed').length,
        pending: data.filter(p => p.paymentStatus === 'pending').length,
        amount: data.filter(p => p.paymentStatus === 'completed').reduce((sum, p) => sum + p.amount, 0)
      });
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      completed: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      processing: 'bg-blue-100 text-blue-700',
      failed: 'bg-red-100 text-red-700',
      refunded: 'bg-gray-100 text-gray-700'
    };
    return badges[status] || 'bg-gray-100 text-gray-700';
  };

  const getStatusIcon = (status) => {
    const icons = {
      completed: <FaCheckCircle className="text-green-500" />,
      pending: <FaClock className="text-yellow-500" />,
      processing: <FaClock className="text-blue-500" />,
      failed: <FaTimesCircle className="text-red-500" />,
      refunded: <FaTimesCircle className="text-gray-500" />
    };
    return icons[status] || <FaClock className="text-gray-500" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto"></div>
          <p className="mt-6 text-gray-600 text-lg">Loading payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-gray-600 hover:text-primary transition"
          >
            <FaArrowLeft className="text-xl" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaRupeeSign /> Payments
          </h1>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <p className="text-2xl font-bold text-primary">{summary.total}</p>
            <p className="text-sm text-gray-500">Total Payments</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{summary.completed}</p>
            <p className="text-sm text-gray-500">Completed</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">{summary.pending}</p>
            <p className="text-sm text-gray-500">Pending</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">₹{summary.amount.toFixed(0)}</p>
            <p className="text-sm text-gray-500">Total Spent</p>
          </div>
        </div>

        {/* Payments List */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Payment History</h2>
          </div>

          {payments.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">💳</div>
              <h3 className="text-xl font-semibold text-gray-700">No payments yet</h3>
              <p className="text-gray-500 mt-2">Complete a booking and make a payment</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {payments.map(payment => (
                <div key={payment._id} className="p-4 hover:bg-gray-50 transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {payment.helperId?.fullName || 'Unknown Helper'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {payment.bookingId?.serviceType || 'Service'} • 
                        {payment.bookingId?.serviceDate && new Date(payment.bookingId.serviceDate).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(payment.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">₹{payment.amount}</p>
                      <div className="flex items-center gap-1 justify-end">
                        {getStatusIcon(payment.paymentStatus)}
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(payment.paymentStatus)}`}>
                          {payment.paymentStatus.toUpperCase()}
                        </span>
                      </div>
                      {payment.paymentMethod && (
                        <p className="text-xs text-gray-400 capitalize">{payment.paymentMethod}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;