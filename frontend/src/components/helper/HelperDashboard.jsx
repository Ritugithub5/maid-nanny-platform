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
  FaStar,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaCalendarDay,
  FaClipboardCheck,
  FaExclamationTriangle
} from 'react-icons/fa';
import NotificationBell from '../common/NotificationBell';
import MobileNav from '../common/MobileNav';

const HelperDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [helperProfile, setHelperProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    completed: 0,
    revenue: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Get helper profile
      try {
        const profileResponse = await axios.get(
          'http://localhost:5000/api/helpers/me/profile',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setHelperProfile(profileResponse.data.data);
      } catch (err) {
        setHelperProfile(null);
      }

      // Get bookings
      const bookingsResponse = await axios.get(
        'http://localhost:5000/api/bookings/helper',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const data = bookingsResponse.data.data || [];
      setBookings(data);
      
      // Calculate stats
      const completedBookings = data.filter(b => b.status === 'completed');
      const totalRevenue = completedBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
      
      setStats({
        total: data.length,
        pending: data.filter(b => b.status === 'pending').length,
        accepted: data.filter(b => b.status === 'accepted' || b.status === 'in_progress').length,
        completed: completedBookings.length,
        revenue: totalRevenue
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingAction = async (id, action) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/bookings/${id}/${action}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const actionMessages = {
        accept: '✅ Booking accepted successfully!',
        reject: '❌ Booking rejected',
        complete: '✅ Booking completed successfully!'
      };
      
      alert(actionMessages[action] || 'Action completed successfully!');
      fetchData();
    } catch (error) {
      alert('❌ Error: ' + (error.response?.data?.message || 'Something went wrong'));
      console.error(error);
    }
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
      <nav className="bg-white shadow-md px-4 sm:px-6 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🧑‍🍳</div>
            <h1 className="text-xl font-bold text-gray-800">Helper Dashboard</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <NotificationBell />
            <span className="text-xs sm:text-sm text-gray-600 hidden sm:inline">Welcome, <span className="font-semibold">{user?.name}</span></span>
            <button onClick={() => navigate('/helper/profile')} className="bg-primary/10 text-primary px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-primary hover:text-white transition text-xs sm:text-sm">
              Profile
            </button>
            <button onClick={logout} className="bg-red-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-red-600 transition text-xs sm:text-sm">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Profile Status */}
        {!helperProfile && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 sm:p-6 mb-6">
            <p className="text-sm sm:text-base text-yellow-700">
              ⚠️ You don't have a helper profile yet. 
              <button
                onClick={() => navigate('/helper/profile')}
                className="ml-2 text-primary font-semibold hover:underline"
              >
                Click here to create one
              </button>
            </p>
          </div>
        )}

        {helperProfile && (
          <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={helperProfile.profilePic || `https://ui-avatars.com/api/?name=${helperProfile.fullName}&background=4F46E5&color=fff&size=60`}
                alt={helperProfile.fullName}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-gray-900 text-sm sm:text-base">{helperProfile.fullName}</p>
                <p className="text-xs sm:text-sm text-gray-500">
                  {helperProfile.serviceType?.join(', ') || 'No services'} • {helperProfile.yearsOfExperience || 0} years exp
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${
                helperProfile.verificationStatus === 'verified' 
                  ? 'bg-green-100 text-green-700' 
                  : helperProfile.verificationStatus === 'pending'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {helperProfile.verificationStatus === 'verified' ? '✅ Verified' : 
                 helperProfile.verificationStatus === 'pending' ? '⏳ Pending' : 
                 '❌ Rejected'}
              </span>
              <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${
                helperProfile.availability?.isAvailable 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {helperProfile.availability?.isAvailable ? '🟢 Available' : '🔴 Not Available'}
              </span>
            </div>
          </div>
        )}

        {/* Quick Actions - Mobile Friendly Scrollable */}
        <div className="overflow-x-auto pb-2 mb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-3 min-w-max sm:grid sm:grid-cols-4 sm:gap-4">
            <button
              onClick={() => navigate('/helper/attendance')}
              className="bg-white p-3 sm:p-4 rounded-xl shadow-md hover:shadow-lg transition flex items-center gap-3 group flex-shrink-0"
            >
              <div className="bg-green-500/10 p-2 sm:p-3 rounded-lg">
                <FaCalendarCheck className="text-green-500 text-lg sm:text-xl" />
              </div>
              <div className="text-left whitespace-nowrap">
                <p className="text-xs sm:text-sm text-gray-600">Track</p>
                <p className="font-semibold text-gray-800 text-sm sm:text-base">Attendance</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/helper/leaves')}
              className="bg-white p-3 sm:p-4 rounded-xl shadow-md hover:shadow-lg transition flex items-center gap-3 group flex-shrink-0"
            >
              <div className="bg-blue-500/10 p-2 sm:p-3 rounded-lg">
                <FaClipboardCheck className="text-blue-500 text-lg sm:text-xl" />
              </div>
              <div className="text-left whitespace-nowrap">
                <p className="text-xs sm:text-sm text-gray-600">Apply</p>
                <p className="font-semibold text-gray-800 text-sm sm:text-base">Leave</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/helper/salary')}
              className="bg-white p-3 sm:p-4 rounded-xl shadow-md hover:shadow-lg transition flex items-center gap-3 group flex-shrink-0"
            >
              <div className="bg-purple-500/10 p-2 sm:p-3 rounded-lg">
                <FaStar className="text-purple-500 text-lg sm:text-xl" />
              </div>
              <div className="text-left whitespace-nowrap">
                <p className="text-xs sm:text-sm text-gray-600">View</p>
                <p className="font-semibold text-gray-800 text-sm sm:text-base">Salary</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/sos/contacts')}
              className="bg-white p-3 sm:p-4 rounded-xl shadow-md hover:shadow-lg transition flex items-center gap-3 group flex-shrink-0"
            >
              <div className="bg-red-500/10 p-2 sm:p-3 rounded-lg">
                <FaExclamationTriangle className="text-red-500 text-lg sm:text-xl" />
              </div>
              <div className="text-left whitespace-nowrap">
                <p className="text-xs sm:text-sm text-gray-600">Manage</p>
                <p className="font-semibold text-gray-800 text-sm sm:text-base">SOS</p>
              </div>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl shadow-md p-3 sm:p-4 text-center">
            <p className="text-xl sm:text-2xl font-bold text-primary">{stats.total}</p>
            <p className="text-xs sm:text-sm text-gray-500">Total Bookings</p>
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
            <p className="text-xl sm:text-2xl font-bold text-green-600">₹{stats.revenue}</p>
            <p className="text-xs sm:text-sm text-gray-500">Total Earnings</p>
          </div>
        </div>

        {/* Quick Action - Find more work */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 text-white">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <div className="text-center sm:text-left">
              <h2 className="text-lg sm:text-xl font-bold">📈 Want More Work?</h2>
              <p className="text-white/80 text-sm sm:text-base">Update your availability and get more bookings</p>
            </div>
            <button
              onClick={() => navigate('/helper/profile')}
              className="bg-white text-primary px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg text-sm sm:text-base w-full sm:w-auto"
            >
              ✏️ Update Profile
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
              <p className="text-sm sm:text-base text-gray-500 mt-2">When households book you, they'll appear here</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {bookings.map(booking => (
                <div key={booking._id} className="p-4 sm:p-6 hover:bg-gray-50 transition">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
                    {/* Household Info */}
                    <div className="flex items-center gap-3 sm:gap-4">
                      <img
                        src={`https://ui-avatars.com/api/?name=${booking.householdUserId?.name}&background=4F46E5&color=fff&size=50`}
                        alt={booking.householdUserId?.name}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold text-gray-900 text-sm sm:text-base">
                          {booking.householdUserId?.name || 'Unknown User'}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500">
                          {booking.serviceType || 'N/A'} • {new Date(booking.serviceDate).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                        {booking.address?.city && (
                          <p className="text-xs text-gray-400">📍 {booking.address.city}</p>
                        )}
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4">
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

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      {booking.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleBookingAction(booking._id, 'accept')}
                            className="bg-green-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-green-600 transition text-xs sm:text-sm font-medium flex items-center gap-1"
                          >
                            ✅ Accept
                          </button>
                          <button
                            onClick={() => handleBookingAction(booking._id, 'reject')}
                            className="bg-red-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-red-600 transition text-xs sm:text-sm font-medium flex items-center gap-1"
                          >
                            ❌ Reject
                          </button>
                        </>
                      )}
                      {booking.status === 'accepted' && (
                        <button
                          onClick={() => handleBookingAction(booking._id, 'complete')}
                          className="bg-blue-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-blue-600 transition text-xs sm:text-sm font-medium flex items-center gap-1"
                        >
                          ✅ Complete
                        </button>
                      )}
                      {booking.status === 'completed' && (
                        <span className="text-green-600 text-xs sm:text-sm font-medium flex items-center gap-1">🎉 Done</span>
                      )}
                      {booking.status === 'rejected' && (
                        <span className="text-red-600 text-xs sm:text-sm font-medium flex items-center gap-1">❌ Rejected</span>
                      )}
                      {booking.status === 'cancelled' && (
                        <span className="text-gray-500 text-xs sm:text-sm font-medium flex items-center gap-1">🚫 Cancelled</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <MobileNav />
    </div>
  );
};

export default HelperDashboard;