import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { 
  FaSearch, 
  FaUser, 
  FaUserCheck, 
  FaUserTimes,
  FaEdit,
  FaTrash,
  FaEnvelope,
  FaPhone,
  FaArrowLeft,
  FaHome
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AdminUsers = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'http://localhost:5000/api/users',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const changeUserRole = async (userId, newRole) => {
    if (!window.confirm(`Change this user's role to "${newRole}"?`)) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/users/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('✅ User role updated successfully!');
      fetchUsers();
    } catch (error) {
      alert('❌ Error updating user role: ' + (error.response?.data?.message || 'Unknown error'));
      console.error(error);
    }
  };

  const deleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"?`)) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://localhost:5000/api/users/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('✅ User deleted successfully!');
      fetchUsers();
    } catch (error) {
      alert('❌ Error deleting user: ' + (error.response?.data?.message || 'Unknown error'));
      console.error(error);
    }
  };

  // Filter users
  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats
  const stats = {
    total: users.length,
    household: users.filter(u => u.role === 'household').length,
    helper: users.filter(u => u.role === 'helper').length,
    admin: users.filter(u => u.role === 'admin').length
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto"></div>
          <p className="mt-6 text-gray-600 text-lg">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Navbar */}
      <nav className="bg-white shadow-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/admin')}
              className="text-gray-500 hover:text-primary transition"
              title="Back to Dashboard"
            >
              <FaArrowLeft />
            </button>
            <div className="text-2xl">👑</div>
            <h1 className="text-xl font-bold text-gray-800">Admin - Users</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Welcome, <span className="font-semibold">{user?.name}</span>
            </span>
            <button
              onClick={() => navigate('/admin')}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition text-sm flex items-center gap-2"
            >
              <FaHome /> Dashboard
            </button>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <p className="text-2xl font-bold text-primary">{stats.total}</p>
            <p className="text-sm text-gray-500">Total Users</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.household}</p>
            <p className="text-sm text-gray-500">Households</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{stats.helper}</p>
            <p className="text-sm text-gray-500">Helpers</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">{stats.admin}</p>
            <p className="text-sm text-gray-500">Admins</p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                      {searchTerm ? 'No users match your search' : 'No users found'}
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map(u => (
                    <tr key={u._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            u.role === 'admin' ? 'bg-purple-100' :
                            u.role === 'helper' ? 'bg-green-100' :
                            'bg-blue-100'
                          }`}>
                            <FaUser className={`${
                              u.role === 'admin' ? 'text-purple-600' :
                              u.role === 'helper' ? 'text-green-600' :
                              'text-blue-600'
                            }`} />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{u.name}</p>
                            <p className="text-xs text-gray-500">ID: {u._id.slice(-6)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FaEnvelope className="text-gray-400 text-sm" />
                          <span className="text-gray-700">{u.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FaPhone className="text-gray-400 text-sm" />
                          <span className="text-gray-700">{u.phone || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                          u.role === 'helper' ? 'bg-green-100 text-green-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {u.role || 'household'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <select
                            onChange={(e) => changeUserRole(u._id, e.target.value)}
                            className="text-xs px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-primary"
                            defaultValue={u.role}
                            disabled={u._id === user?.id}
                          >
                            <option value="household">Household</option>
                            <option value="helper">Helper</option>
                            <option value="admin">Admin</option>
                          </select>
                          {u._id !== user?.id && (
                            <button
                              onClick={() => deleteUser(u._id, u.name)}
                              className="text-red-500 hover:text-red-700 transition"
                              title="Delete User"
                            >
                              <FaTrash />
                            </button>
                          )}
                        </div>
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

export default AdminUsers;