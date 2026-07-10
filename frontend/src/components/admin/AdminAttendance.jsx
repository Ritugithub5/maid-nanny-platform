import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { FaArrowLeft, FaCalendar, FaUser, FaClock } from 'react-icons/fa';

const AdminAttendance = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    fetchAttendance();
  }, [filterDate]);

  const fetchAttendance = async () => {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (filterDate) params.append('date', filterDate);

      const response = await axios.get(
        `http://localhost:5000/api/attendance/admin/all?${params}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAttendance(response.data.data || []);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      present: 'bg-green-100 text-green-700',
      absent: 'bg-red-100 text-red-700',
      'half-day': 'bg-yellow-100 text-yellow-700',
      leave: 'bg-blue-100 text-blue-700',
      holiday: 'bg-purple-100 text-purple-700'
    };
    return badges[status] || 'bg-gray-100 text-gray-700';
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

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/admin')} className="text-gray-500 hover:text-primary transition">
              <FaArrowLeft />
            </button>
            <div className="text-2xl">📋</div>
            <h1 className="text-xl font-bold text-gray-800">Admin - Attendance</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Welcome, <span className="font-semibold">{user?.name}</span></span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <label className="text-sm font-medium text-gray-700">Filter by Date:</label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={() => setFilterDate('')}
              className="text-sm text-primary hover:text-secondary"
            >
              Clear Filter
            </button>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              All Attendance Records ({attendance.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Helper</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check In</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check Out</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hours</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Overtime</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {attendance.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">No attendance records found</td>
                  </tr>
                ) : (
                  attendance.map(record => (
                    <tr key={record._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{record.helperId?.fullName || 'Unknown'}</p>
                          <p className="text-sm text-gray-500">{record.helperId?.serviceType?.join(', ')}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {new Date(record.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(record.status)}`}>
                          {record.status?.toUpperCase() || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{record.checkInTime || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{record.checkOutTime || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{record.workingHours?.toFixed(1) || 0}h</td>
                      <td className="px-6 py-4 text-sm text-orange-600">{record.overtime?.toFixed(1) || 0}h</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAttendance;