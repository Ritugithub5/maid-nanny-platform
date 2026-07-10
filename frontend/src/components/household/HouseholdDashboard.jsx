import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { 
  FaCalendarCheck, 
  FaClock, 
  FaCheckCircle, 
  FaTimesCircle,
  FaUser,
  FaUserEdit,
  FaHome,
  FaBell,
  FaRupeeSign
} from 'react-icons/fa';
import MobileNav from '../common/MobileNav';
import NotificationBell from '../common/NotificationBell';
import PaymentModal from './PaymentModal';

const HouseholdDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [payments, setPayments] = useState({});
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    completed: 0,
    cancelled: 0
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'http://localhost:5000/api/bookings/me',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const data = response.data.data || [];
      setBookings(data);
      
      // Check payment status for each completed booking
      data.forEach(async (booking) => {
        if (booking.status === 'completed') {
          try {
            const paymentRes = await axios.get(
              `http://localhost:5000/api/payments/booking/${booking._id}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            setPayments(prev => ({
              ...prev,
              [booking._id]: paymentRes.data.data
            }));
          } catch (err) {
            // No payment found
            setPayments(prev => ({
              ...prev,
              [booking._id]: null
            }));
          }
        }
      });
      
      setStats({
        total: data.length,
        pending: data.filter(b => b.status === 'pending').length,
        accepted: data.filter(b => b.status === 'accepted' || b.status === 'in_progress').length,
        completed: data.filter(b => b.status === 'completed').length,
        cancelled: data.filter(b => b.status === 'cancelled' || b.status === 'rejected').length
      });
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/bookings/${id}/cancel`,
        { reason: 'Cancelled by household' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('✅ Booking cancelled successfully!');
      fetchBookings();
    } catch (error) {
      alert('❌ Error cancelling booking');
      console.error(error);
    }
  };

  const handlePaymentClick = (booking) => {
    setSelectedBooking(booking);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    fetchBookings();
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-700',
      accepted: 'bg-blue-100 text-blue-700',
      in_progress: 'bg-purple-100 text-purple-700',
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
      rejected: 'bg-red-100 text-red-700'
    };
    return badges[status] || 'bg-gray-100 text-gray-700';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: '⏳',
      accepted: '✅',
      in_progress: '🔄',
      completed: '🎉',
      cancelled: '❌',
      rejected: '🚫'
    };
    return icons[status] || '📌';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto"></div>
          <p className="mt-6 text-gray-600 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      {/* Navbar */}
      <nav className="bg-white shadow-md px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="text-2xl">🏠</div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-800">My Dashboard</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <NotificationBell />
            <span className="text-xs sm:text-sm text-gray-600 hidden sm:inline">
              Welcome, <span className="font-semibold">{user?.name}</span>
            </span>
            <button
              onClick={() => navigate('/household/profile')}
              className="bg-primary/10 text-primary px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-primary hover:text-white transition text-xs sm:text-sm flex items-center gap-1 sm:gap-2"
            >
              <FaUserEdit className="text-xs sm:text-sm" /> 
              <span className="hidden sm:inline">Profile</span>
            </button>
            <button
              onClick={() => navigate('/browse')}
              className="bg-primary text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-secondary transition text-xs sm:text-sm hidden sm:inline-block"
            >
              Find Helpers
            </button>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-red-600 transition text-xs sm:text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl shadow-md p-3 sm:p-4 text-center">
            <p className="text-xl sm:text-2xl font-bold text-primary">{stats.total}</p>
            <p className="text-xs sm:text-sm text-gray-500">Total</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-3 sm:p-4 text-center">
            <p className="text-xl sm:text-2xl font-bold text-yellow-600">{stats.pending}</p>
            <p className="text-xs sm:text-sm text-gray-500">Pending</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-3 sm:p-4 text-center">
            <p className="text-xl sm:text-2xl font-bold text-blue-600">{stats.accepted}</p>
            <p className="text-xs sm:text-sm text-gray-500">Active</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-3 sm:p-4 text-center">
            <p className="text-xl sm:text-2xl font-bold text-green-600">{stats.completed}</p>
            <p className="text-xs sm:text-sm text-gray-500">Completed</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-3 sm:p-4 text-center col-span-2 sm:col-span-1">
            <p className="text-xl sm:text-2xl font-bold text-red-600">{stats.cancelled}</p>
            <p className="text-xs sm:text-sm text-gray-500">Cancelled</p>
          </div>
        </div>

        {/* Quick Action */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 text-white">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <div className="text-center sm:text-left">
              <h2 className="text-lg sm:text-xl font-bold">Need Help? Find a Helper!</h2>
              <p className="text-white/80 text-sm sm:text-base">Browse verified helpers and book services instantly</p>
            </div>
            <button
              onClick={() => navigate('/browse')}
              className="bg-white text-primary px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg text-sm sm:text-base w-full sm:w-auto"
            >
              🔍 Browse Helpers
            </button>
          </div>
        </div>

        {/* Bookings List */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800">
              📋 My Bookings
            </h2>
            <span className="text-xs sm:text-sm text-gray-500">{bookings.length} bookings</span>
          </div>

          {bookings.length === 0 ? (
            <div className="p-8 sm:p-12 text-center">
              <div className="text-5xl sm:text-6xl mb-4">📅</div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-700">No bookings yet</h3>
              <p className="text-sm sm:text-base text-gray-500 mt-2">Browse helpers and book your first service today!</p>
              <button
                onClick={() => navigate('/browse')}
                className="mt-4 bg-primary text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-secondary transition text-sm sm:text-base"
              >
                Find Helpers
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {bookings.map(booking => {
                const payment = payments[booking._id];
                const isPaid = payment && payment.paymentStatus === 'completed';
                const needsPayment = booking.status === 'completed' && !isPaid;

                return (
                  <div key={booking._id} className="p-4 sm:p-6 hover:bg-gray-50 transition">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <img
                          src={booking.helperId?.profilePic || `https://ui-avatars.com/api/?name=${booking.helperId?.fullName}&background=4F46E5&color=fff&size=50`}
                          alt={booking.helperId?.fullName}
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-semibold text-gray-900 text-sm sm:text-base">
                            {booking.helperId?.fullName || 'Unknown Helper'}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500">
                            {booking.serviceType} • {booking.helperId?.yearsOfExperience || 0} years exp
                          </p>
                          {isPaid && (
                            <span className="text-xs text-green-600 font-medium">✅ Paid</span>
                          )}
                          {needsPayment && (
                            <span className="text-xs text-yellow-600 font-medium">⏳ Payment Pending</span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                        <div className="text-xs sm:text-sm">
                          <p className="text-gray-500">Date</p>
                          <p className="font-medium">
                            {new Date(booking.serviceDate).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                        <div className="text-xs sm:text-sm">
                          <p className="text-gray-500">Time</p>
                          <p className="font-medium">{booking.startTime} - {booking.endTime}</p>
                        </div>
                        <div className="text-xs sm:text-sm">
                          <p className="text-gray-500">Price</p>
                          <p className="font-medium text-green-600">₹{booking.totalPrice}</p>
                        </div>
                        <div>
                          <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(booking.status)}`}>
                            {getStatusIcon(booking.status)} {booking.status.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {booking.status === 'pending' && (
                          <button
                            onClick={() => cancelBooking(booking._id)}
                            className="text-red-500 hover:text-red-700 text-xs sm:text-sm font-medium"
                          >
                            Cancel
                          </button>
                        )}
                        {booking.status === 'completed' && (
                          <>
                            <button
                              onClick={() => navigate(`/review/${booking._id}`)}
                              className="text-primary hover:text-secondary text-xs sm:text-sm font-medium"
                            >
                              ⭐ Review
                            </button>
                            {needsPayment && (
                              <button
                                onClick={() => handlePaymentClick(booking)}
                                className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition text-xs sm:text-sm font-medium flex items-center gap-1"
                              >
                                <FaRupeeSign className="text-xs" /> Pay Now
                              </button>
                            )}
                            {isPaid && (
                              <span className="text-green-600 text-xs sm:text-sm font-medium flex items-center gap-1">
                                <FaCheckCircle /> Paid
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <MobileNav />

      {/* Payment Modal */}
      {showPaymentModal && selectedBooking && (
        <PaymentModal
          booking={selectedBooking}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedBooking(null);
          }}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default HouseholdDashboard;