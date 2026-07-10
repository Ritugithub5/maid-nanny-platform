import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { 
  FaArrowLeft, 
  FaUsers, 
  FaUserCheck, 
  FaCalendarCheck, 
  FaStar,
  FaChartLine,
  FaRupeeSign,
  FaMapMarkerAlt,
  FaBriefcase,
  FaPercent,
  FaClock
} from 'react-icons/fa';

const AdminAnalytics = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'http://localhost:5000/api/analytics',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAnalytics(response.data.data);
    } catch (err) {
      setError('Failed to load analytics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto"></div>
          <p className="mt-6 text-gray-600 text-lg">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Data</h2>
          <p className="text-gray-600 mb-6">{error || 'No analytics data available yet'}</p>
          <button onClick={() => navigate('/admin')} className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary transition">Go to Dashboard</button>
        </div>
      </div>
    );
  }

  const { users, helpers, bookings, revenue, ratings, monthlyStats } = analytics;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/admin')} className="text-gray-500 hover:text-primary transition"><FaArrowLeft /></button>
            <div className="text-2xl">📊</div>
            <h1 className="text-xl font-bold text-gray-800">Analytics Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Welcome, <span className="font-semibold">{user?.name}</span></span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-lg"><FaUsers className="text-blue-600 text-xl" /></div>
              <div><p className="text-2xl font-bold text-gray-900">{users.total}</p><p className="text-sm text-gray-500">Total Users</p></div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-3 rounded-lg"><FaUserCheck className="text-green-600 text-xl" /></div>
              <div><p className="text-2xl font-bold text-gray-900">{users.household}</p><p className="text-sm text-gray-500">Households</p></div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-3 rounded-lg"><FaBriefcase className="text-purple-600 text-xl" /></div>
              <div><p className="text-2xl font-bold text-gray-900">{users.helper}</p><p className="text-sm text-gray-500">Helpers</p></div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 p-3 rounded-lg"><FaStar className="text-orange-600 text-xl" /></div>
              <div><p className="text-2xl font-bold text-gray-900">{ratings.average.toFixed(1)}</p><p className="text-sm text-gray-500">Avg Rating</p></div>
            </div>
          </div>
        </div>

        {/* Helper Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <p className="text-2xl font-bold text-primary">{helpers.total}</p>
            <p className="text-sm text-gray-500">Total Helpers</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{helpers.verified}</p>
            <p className="text-sm text-gray-500">Verified</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">{helpers.pending}</p>
            <p className="text-sm text-gray-500">Pending</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <p className="text-2xl font-bold text-red-600">{helpers.rejected}</p>
            <p className="text-sm text-gray-500">Rejected</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{helpers.available}</p>
            <p className="text-sm text-gray-500">Available</p>
          </div>
        </div>

        {/* Booking Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <p className="text-2xl font-bold text-primary">{bookings.total}</p>
            <p className="text-sm text-gray-500">Total Bookings</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{bookings.completed}</p>
            <p className="text-sm text-gray-500">Completed</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">{bookings.pending}</p>
            <p className="text-sm text-gray-500">Pending</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">{bookings.completionRate.toFixed(1)}%</p>
            <p className="text-sm text-gray-500">Completion Rate</p>
          </div>
        </div>

        {/* Revenue Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-3 rounded-lg"><FaRupeeSign className="text-green-600 text-xl" /></div>
              <div><p className="text-2xl font-bold text-gray-900">₹{revenue.total.toLocaleString()}</p><p className="text-sm text-gray-500">Total Revenue</p></div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-lg"><FaChartLine className="text-blue-600 text-xl" /></div>
              <div><p className="text-2xl font-bold text-gray-900">₹{revenue.averageBookingValue.toFixed(0)}</p><p className="text-sm text-gray-500">Avg Booking Value</p></div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-3 rounded-lg"><FaCalendarCheck className="text-purple-600 text-xl" /></div>
              <div><p className="text-2xl font-bold text-gray-900">{monthlyStats?.length || 0}</p><p className="text-sm text-gray-500">Months Active</p></div>
            </div>
          </div>
        </div>

        {/* Service Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">🛠️ Service Distribution</h3>
            <div className="space-y-3">
              {Object.entries(helpers.serviceDistribution || {}).map(([key, value]) => (
                <div key={key}>
                  <div className="flex justify-between text-sm">
                    <span className="capitalize">{key}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary rounded-full h-2" style={{ width: `${helpers.total > 0 ? (value / helpers.total) * 100 : 0}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">📍 City Distribution</h3>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {Object.entries(helpers.cityDistribution || {})
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10)
                .map(([city, count]) => (
                  <div key={city} className="flex justify-between items-center border-b border-gray-100 py-1">
                    <span className="text-sm text-gray-700">{city}</span>
                    <span className="text-sm font-medium text-gray-900">{count} helpers</span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Monthly Stats Chart */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📈 Monthly Overview</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Month</th>
                  <th className="px-4 py-2 text-center text-sm font-medium text-gray-500">Bookings</th>
                  <th className="px-4 py-2 text-center text-sm font-medium text-gray-500">Revenue</th>
                  <th className="px-4 py-2 text-center text-sm font-medium text-gray-500">New Users</th>
                </tr>
              </thead>
              <tbody>
                {monthlyStats?.map((month, index) => (
                  <tr key={index} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-700">{month.month}</td>
                    <td className="px-4 py-2 text-center text-sm text-gray-700">{month.bookings}</td>
                    <td className="px-4 py-2 text-center text-sm text-green-600">₹{month.revenue.toLocaleString()}</td>
                    <td className="px-4 py-2 text-center text-sm text-blue-600">{month.users}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;