import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FaUsers, 
  FaUserCheck, 
  FaCalendarCheck, 
  FaStar,
  FaUserPlus,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaArrowRight,
  FaComments,
  FaChartLine,
  FaRupeeSign,
  FaExclamationTriangle,
  FaCalendarAlt  // ADD THIS FOR LEAVES
} from 'react-icons/fa';
import axios from 'axios';
import NotificationBell from '../common/NotificationBell';
import MobileNav from '../common/MobileNav';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalHelpers: 0,
    verifiedHelpers: 0,
    pendingVerifications: 0,
    totalBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
    pendingBookings: 0,
    averageRating: 0,
    totalReviews: 0
  });
  const [recentHelpers, setRecentHelpers] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const helpersResponse = await axios.get(
        'http://localhost:5000/api/helpers/admin/all',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const helpers = helpersResponse.data.data || [];
      
      const bookingsResponse = await axios.get(
        'http://localhost:5000/api/bookings/admin/all',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const bookings = bookingsResponse.data.data || [];
      
      const usersResponse = await axios.get(
        'http://localhost:5000/api/helpers/admin/users',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const users = usersResponse.data.data || [];
      
      const totalHelpers = helpers.length;
      const verifiedHelpers = helpers.filter(h => h.verificationStatus === 'verified').length;
      const pendingVerifications = helpers.filter(h => h.verificationStatus === 'pending').length;
      
      const completedBookings = bookings.filter(b => b.status === 'completed').length;
      const cancelledBookings = bookings.filter(b => b.status === 'cancelled' || b.status === 'rejected').length;
      const pendingBookings = bookings.filter(b => b.status === 'pending').length;
      
      const ratings = helpers
        .filter(h => h.rating?.average > 0)
        .map(h => h.rating.average);
      const avgRating = ratings.length > 0 
        ? (ratings.reduce((a, b) => a + b, 0) / ratings.length)
        : 0;

      const totalReviews = helpers.reduce((sum, h) => sum + (h.rating?.count || 0), 0);

      setStats({
        totalUsers: users.length,
        totalHelpers,
        verifiedHelpers,
        pendingVerifications,
        totalBookings: bookings.length,
        completedBookings,
        cancelledBookings,
        pendingBookings,
        averageRating: avgRating,
        totalReviews
      });

      setRecentHelpers(helpers.slice(0, 5));
      setRecentBookings(bookings.slice(0, 5));

      const helpersWithReviews = helpers
        .filter(h => h.rating?.count > 0)
        .slice(0, 5)
        .map(h => ({
          helperName: h.fullName,
          rating: h.rating?.average || 0,
          count: h.rating?.count || 0,
          serviceType: h.serviceType?.join(', ') || 'N/A'
        }));
      setRecentReviews(helpersWithReviews);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: <FaUsers className="text-3xl text-blue-500" />,
      color: 'bg-blue-50 border-blue-200',
      textColor: 'text-blue-600'
    },
    {
      title: 'Total Helpers',
      value: stats.totalHelpers,
      icon: <FaUserCheck className="text-3xl text-green-500" />,
      color: 'bg-green-50 border-green-200',
      textColor: 'text-green-600'
    },
    {
      title: 'Pending Verification',
      value: stats.pendingVerifications,
      icon: <FaClock className="text-3xl text-yellow-500" />,
      color: 'bg-yellow-50 border-yellow-200',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: <FaCalendarCheck className="text-3xl text-purple-500" />,
      color: 'bg-purple-50 border-purple-200',
      textColor: 'text-purple-600'
    },
    {
      title: 'Average Rating',
      value: stats.averageRating.toFixed(1),
      icon: <FaStar className="text-3xl text-orange-500" />,
      color: 'bg-orange-50 border-orange-200',
      textColor: 'text-orange-600'
    },
    {
      title: 'Total Reviews',
      value: stats.totalReviews,
      icon: <FaComments className="text-3xl text-pink-500" />,
      color: 'bg-pink-50 border-pink-200',
      textColor: 'text-pink-600'
    }
  ];

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
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      {/* Navbar */}
      <nav className="bg-white shadow-md px-4 sm:px-6 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="text-2xl">👑</div>
            <h1 className="text-xl font-bold text-gray-800 hidden sm:block">Admin Dashboard</h1>
            <h1 className="text-lg font-bold text-gray-800 sm:hidden">Admin</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <NotificationBell />
            <span className="text-xs sm:text-sm text-gray-600 hidden sm:inline">
              Welcome, <span className="font-semibold">{user?.name}</span>
            </span>
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
        {/* Quick Actions */}
        <div className="overflow-x-auto pb-2 mb-4 sm:mb-8 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-3 sm:grid sm:grid-cols-8 sm:gap-4 min-w-max sm:min-w-0">
            <button
              onClick={() => navigate('/admin/helpers')}
              className="bg-white p-3 sm:p-4 rounded-xl shadow-md hover:shadow-lg transition flex items-center gap-3 group flex-shrink-0"
            >
              <div className="bg-primary/10 p-2 sm:p-3 rounded-lg">
                <FaUserPlus className="text-primary text-lg sm:text-xl" />
              </div>
              <div className="text-left whitespace-nowrap">
                <p className="text-xs sm:text-sm text-gray-600">Manage</p>
                <p className="font-semibold text-gray-800 text-sm sm:text-base">Helpers</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/admin/bookings')}
              className="bg-white p-3 sm:p-4 rounded-xl shadow-md hover:shadow-lg transition flex items-center gap-3 group flex-shrink-0"
            >
              <div className="bg-green-500/10 p-2 sm:p-3 rounded-lg">
                <FaCalendarCheck className="text-green-500 text-lg sm:text-xl" />
              </div>
              <div className="text-left whitespace-nowrap">
                <p className="text-xs sm:text-sm text-gray-600">View</p>
                <p className="font-semibold text-gray-800 text-sm sm:text-base">Bookings</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/admin/users')}
              className="bg-white p-3 sm:p-4 rounded-xl shadow-md hover:shadow-lg transition flex items-center gap-3 group flex-shrink-0"
            >
              <div className="bg-purple-500/10 p-2 sm:p-3 rounded-lg">
                <FaUsers className="text-purple-500 text-lg sm:text-xl" />
              </div>
              <div className="text-left whitespace-nowrap">
                <p className="text-xs sm:text-sm text-gray-600">Manage</p>
                <p className="font-semibold text-gray-800 text-sm sm:text-base">Users</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/admin/reviews')}
              className="bg-white p-3 sm:p-4 rounded-xl shadow-md hover:shadow-lg transition flex items-center gap-3 group flex-shrink-0"
            >
              <div className="bg-pink-500/10 p-2 sm:p-3 rounded-lg">
                <FaComments className="text-pink-500 text-lg sm:text-xl" />
              </div>
              <div className="text-left whitespace-nowrap">
                <p className="text-xs sm:text-sm text-gray-600">View</p>
                <p className="font-semibold text-gray-800 text-sm sm:text-base">Reviews</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/admin/analytics')}
              className="bg-white p-3 sm:p-4 rounded-xl shadow-md hover:shadow-lg transition flex items-center gap-3 group flex-shrink-0"
            >
              <div className="bg-orange-500/10 p-2 sm:p-3 rounded-lg">
                <FaChartLine className="text-orange-500 text-lg sm:text-xl" />
              </div>
              <div className="text-left whitespace-nowrap">
                <p className="text-xs sm:text-sm text-gray-600">View</p>
                <p className="font-semibold text-gray-800 text-sm sm:text-base">Analytics</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/admin/payments')}
              className="bg-white p-3 sm:p-4 rounded-xl shadow-md hover:shadow-lg transition flex items-center gap-3 group flex-shrink-0"
            >
              <div className="bg-green-500/10 p-2 sm:p-3 rounded-lg">
                <FaRupeeSign className="text-green-500 text-lg sm:text-xl" />
              </div>
              <div className="text-left whitespace-nowrap">
                <p className="text-xs sm:text-sm text-gray-600">Manage</p>
                <p className="font-semibold text-gray-800 text-sm sm:text-base">Payments</p>
              </div>
            </button>

            {/* ====== SOS BUTTON ====== */}
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

            {/* ====== LEAVES BUTTON (NEW) ====== */}
            <button
              onClick={() => navigate('/admin/leaves')}
              className="bg-white p-3 sm:p-4 rounded-xl shadow-md hover:shadow-lg transition flex items-center gap-3 group flex-shrink-0"
            >
              <div className="bg-blue-500/10 p-2 sm:p-3 rounded-lg">
                <FaCalendarAlt className="text-blue-500 text-lg sm:text-xl" />
              </div>
              <div className="text-left whitespace-nowrap">
                <p className="text-xs sm:text-sm text-gray-600">Manage</p>
                <p className="font-semibold text-gray-800 text-sm sm:text-base">Leaves</p>
              </div>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-4 sm:mb-8">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className={`${stat.color} border rounded-xl p-3 sm:p-4 transition hover:shadow-lg`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] sm:text-xs text-gray-600">{stat.title}</p>
                  <p className={`text-lg sm:text-2xl font-bold ${stat.textColor} mt-0.5 sm:mt-1`}>
                    {stat.value}
                  </p>
                </div>
                <div className="bg-white/50 p-1.5 sm:p-2 rounded-full">
                  <span className="text-xl sm:text-3xl">{stat.icon}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Helpers */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800">📋 Recent Helpers</h2>
            <button onClick={() => navigate('/admin/helpers')} className="text-primary hover:text-secondary text-xs sm:text-sm font-medium">
              View All →
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase">Helper</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase">Services</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase">Experience</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentHelpers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-4 sm:px-6 py-6 sm:py-8 text-center text-gray-500 text-sm">No helpers registered yet</td>
                  </tr>
                ) : (
                  recentHelpers.map(helper => (
                    <tr key={helper._id} className="hover:bg-gray-50">
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <img src={helper.profilePic || `https://ui-avatars.com/api/?name=${helper.fullName}&background=4F46E5&color=fff&size=40`} alt={helper.fullName} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover" />
                          <div className="min-w-0">
                            <div className="font-medium text-gray-900 text-sm sm:text-base truncate">{helper.fullName}</div>
                            <div className="text-xs sm:text-sm text-gray-500 truncate">{helper.userId?.email || 'No email'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <div className="flex flex-wrap gap-1">
                          {helper.serviceType?.slice(0, 2).map(type => (
                            <span key={type} className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-blue-100 text-blue-700 text-[10px] sm:text-xs rounded-full">{type}</span>
                          ))}
                          {helper.serviceType?.length > 2 && (
                            <span className="text-[10px] sm:text-xs text-gray-500">+{helper.serviceType.length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-gray-700">{helper.yearsOfExperience || 0} years</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        {helper.verificationStatus === 'verified' ? (
                          <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-green-100 text-green-700 text-[10px] sm:text-xs rounded-full flex items-center gap-0.5 sm:gap-1 w-fit"><FaCheckCircle className="w-2 h-2 sm:w-3 sm:h-3" /> Verified</span>
                        ) : helper.verificationStatus === 'pending' ? (
                          <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-yellow-100 text-yellow-700 text-[10px] sm:text-xs rounded-full flex items-center gap-0.5 sm:gap-1 w-fit"><FaClock className="w-2 h-2 sm:w-3 sm:h-3" /> Pending</span>
                        ) : (
                          <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-red-100 text-red-700 text-[10px] sm:text-xs rounded-full flex items-center gap-0.5 sm:gap-1 w-fit"><FaTimesCircle className="w-2 h-2 sm:w-3 sm:h-3" /> Rejected</span>
                        )}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <div className="flex items-center gap-0.5 sm:gap-1">
                          <FaStar className="text-yellow-400 w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="font-medium text-sm sm:text-base">{helper.rating?.average?.toFixed(1) || '0.0'}</span>
                          <span className="text-gray-400 text-[10px] sm:text-sm">({helper.rating?.count || 0})</span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Reviews & Bookings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Reviews */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800">⭐ Recent Reviews</h2>
              <button onClick={() => navigate('/admin/reviews')} className="text-primary hover:text-secondary text-xs sm:text-sm font-medium">
                View All →
              </button>
            </div>
            
            <div className="divide-y divide-gray-200">
              {recentReviews.length === 0 ? (
                <div className="p-4 sm:p-6 text-center text-gray-500">
                  <div className="text-3xl sm:text-4xl mb-2">📝</div>
                  <p className="text-sm">No reviews yet</p>
                </div>
              ) : (
                recentReviews.map((review, index) => (
                  <div key={index} className="px-4 sm:px-6 py-3 sm:py-4 hover:bg-gray-50 transition">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <FaUserCheck className="text-primary text-sm sm:text-base" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm sm:text-base">{review.helperName}</p>
                          <p className="text-xs sm:text-sm text-gray-500">{review.serviceType}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <div className="flex items-center gap-0.5 sm:gap-1">
                          <FaStar className="text-yellow-400 w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="font-medium text-sm sm:text-base">{review.rating.toFixed(1)}</span>
                        </div>
                        <span className="text-gray-400 text-[10px] sm:text-sm">({review.count})</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800">📅 Recent Bookings</h2>
              <button onClick={() => navigate('/admin/bookings')} className="text-primary hover:text-secondary text-xs sm:text-sm font-medium">
                View All →
              </button>
            </div>
            
            <div className="divide-y divide-gray-200">
              {recentBookings.length === 0 ? (
                <div className="p-4 sm:p-6 text-center text-gray-500">
                  <div className="text-3xl sm:text-4xl mb-2">📅</div>
                  <p className="text-sm">No bookings yet</p>
                </div>
              ) : (
                recentBookings.map(booking => (
                  <div key={booking._id} className="px-4 sm:px-6 py-3 sm:py-4 hover:bg-gray-50 transition">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                          <FaCalendarCheck className="text-green-600 text-sm sm:text-base" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 text-sm sm:text-base truncate">
                            {booking.householdUserId?.name || 'Unknown'} → {booking.helperId?.fullName || 'Unknown'}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500 truncate">
                            {booking.serviceType} • {new Date(booking.serviceDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                        <span className="text-xs sm:text-sm font-medium text-green-600">₹{booking.totalPrice || 0}</span>
                        <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 text-[9px] sm:text-xs rounded-full whitespace-nowrap ${
                          booking.status === 'completed' ? 'bg-green-100 text-green-700' :
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          booking.status === 'accepted' ? 'bg-blue-100 text-blue-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {booking.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 sm:mt-8 text-center text-[10px] sm:text-sm text-gray-500">
          <p>🛡️ Admin Panel - Maid & Nanny Service Management Platform</p>
          <p className="mt-1">© 2026 All rights reserved</p>
        </div>
      </div>

      <MobileNav />
    </div>
  );
};

export default AdminDashboard;