import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { FaArrowLeft, FaCheck, FaTimes } from 'react-icons/fa';

const AdminLeaves = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'http://localhost:5000/api/attendance/leaves/admin/all',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLeaves(response.data.data || []);
    } catch (error) {
      alert('Error fetching leaves');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm('Approve this leave?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/attendance/leaves/${id}/status`,
        { status: 'approved' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('✅ Leave Approved!');
      fetchLeaves();
    } catch (error) {
      alert('❌ Error approving leave');
    }
  };

  const handleReject = async (id) => {
    const reason = prompt('Enter rejection reason:');
    if (reason === null) return;
    if (!window.confirm('Reject this leave?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/attendance/leaves/${id}/status`,
        { status: 'rejected', rejectionReason: reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('❌ Leave Rejected');
      fetchLeaves();
    } catch (error) {
      alert('❌ Error rejecting leave');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-700',
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700'
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
            <div className="text-2xl">📅</div>
            <h1 className="text-xl font-bold text-gray-800">Admin - Leave Management</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Welcome, <span className="font-semibold">{user?.name}</span></span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <p className="text-2xl font-bold text-primary">{leaves.length}</p>
            <p className="text-sm text-gray-500">Total</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">{leaves.filter(l => l.status === 'pending').length}</p>
            <p className="text-sm text-gray-500">Pending</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{leaves.filter(l => l.status === 'approved').length}</p>
            <p className="text-sm text-gray-500">Approved</p>
          </div>
        </div>

        {/* Leaves Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Leave Requests</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Helper</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {leaves.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">No leave requests found</td>
                  </tr>
                ) : (
                  leaves.map(leave => (
                    <tr key={leave._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{leave.helperId?.fullName || 'Unknown'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm capitalize">{leave.type}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {new Date(leave.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                        {leave.endDate && leave.endDate !== leave.startDate && 
                          ` - ${new Date(leave.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}`
                        }
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                        {leave.reason}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(leave.status)}`}>
                          {leave.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {leave.status === 'pending' ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprove(leave._id)}
                              className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition text-sm flex items-center gap-1"
                            >
                              <FaCheck /> Approve
                            </button>
                            <button
                              onClick={() => handleReject(leave._id)}
                              className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition text-sm flex items-center gap-1"
                            >
                              <FaTimes /> Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">
                            {leave.status === 'approved' ? '✅ Approved' : '❌ Rejected'}
                          </span>
                        )}
                      </td>
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

export default AdminLeaves;