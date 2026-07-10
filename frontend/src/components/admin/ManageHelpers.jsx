import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaSearch, FaUser } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const ManageHelpers = () => {
  const { user } = useAuth();
  const [helpers, setHelpers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingHelper, setEditingHelper] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    bio: '',
    serviceType: [],
    yearsOfExperience: '',
    skills: '',
    languages: '',
    verificationStatus: 'pending',
    isAvailable: true,
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    workingHoursStart: '09:00',
    workingHoursEnd: '18:00',
    preferredCities: ''
  });

  const serviceOptions = ['maid', 'babysitter', 'nanny'];
  const dayOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Fetch all helpers
  const fetchHelpers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'http://localhost:5000/api/helpers/admin/all',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHelpers(response.data.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to load helpers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all users (for admin to create helpers)
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'http://localhost:5000/api/helpers/admin/users',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(response.data.data || []);
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  };

  useEffect(() => {
    fetchHelpers();
    fetchUsers();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else if (name === 'serviceType') {
      const selected = formData.serviceType.includes(value)
        ? formData.serviceType.filter(item => item !== value)
        : [...formData.serviceType, value];
      setFormData({ ...formData, serviceType: selected });
    } else if (name === 'workingDays') {
      const selected = formData.workingDays.includes(value)
        ? formData.workingDays.filter(item => item !== value)
        : [...formData.workingDays, value];
      setFormData({ ...formData, workingDays: selected });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      fullName: '',
      bio: '',
      serviceType: [],
      yearsOfExperience: '',
      skills: '',
      languages: '',
      verificationStatus: 'pending',
      isAvailable: true,
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      workingHoursStart: '09:00',
      workingHoursEnd: '18:00',
      preferredCities: ''
    });
    setSelectedUserId('');
    setEditingHelper(null);
    setShowForm(false);
  };

  // Edit helper - populate form
  const handleEdit = (helper) => {
    setEditingHelper(helper);
    setFormData({
      fullName: helper.fullName || '',
      bio: helper.bio || '',
      serviceType: helper.serviceType || [],
      yearsOfExperience: helper.yearsOfExperience || '',
      skills: helper.skills ? helper.skills.join(', ') : '',
      languages: helper.languages ? helper.languages.join(', ') : '',
      verificationStatus: helper.verificationStatus || 'pending',
      isAvailable: helper.availability?.isAvailable !== false,
      workingDays: helper.availability?.workingDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      workingHoursStart: helper.availability?.workingHours?.start || '09:00',
      workingHoursEnd: helper.availability?.workingHours?.end || '18:00',
      preferredCities: helper.preferredCities ? helper.preferredCities.join(', ') : ''
    });
    setSelectedUserId(helper.userId?._id || '');
    setShowForm(true);
  };

  // Submit form (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const payload = {
        fullName: formData.fullName,
        bio: formData.bio,
        serviceType: formData.serviceType,
        yearsOfExperience: parseInt(formData.yearsOfExperience) || 0,
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
        languages: formData.languages.split(',').map(s => s.trim()).filter(s => s),
        verificationStatus: formData.verificationStatus,
        availability: {
          isAvailable: formData.isAvailable,
          workingDays: formData.workingDays,
          workingHours: {
            start: formData.workingHoursStart,
            end: formData.workingHoursEnd
          }
        },
        preferredCities: formData.preferredCities.split(',').map(s => s.trim()).filter(s => s)
      };

      if (editingHelper) {
        // Update
        await axios.put(
          `http://localhost:5000/api/helpers/${editingHelper._id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert('✅ Helper updated successfully!');
        resetForm();
        fetchHelpers();
        return;
      }

      // Create new helper
      if (selectedUserId) {
        // Admin creating for specific user
        payload.userId = selectedUserId;
        await axios.post(
          'http://localhost:5000/api/helpers/admin/create',
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const userName = users.find(u => u._id === selectedUserId)?.name || 'user';
        alert(`✅ Helper profile created for ${userName}!`);
      } else {
        // Creating for self
        await axios.post(
          'http://localhost:5000/api/helpers/profile',
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert('✅ Helper profile created successfully! Waiting for admin verification.');
      }

      resetForm();
      fetchHelpers();
      fetchUsers(); // Refresh user list
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Something went wrong';
      alert(`❌ Error: ${errorMsg}`);
      console.error('Submit Error:', err);
    }
  };

  // Delete helper
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this helper?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://localhost:5000/api/helpers/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('✅ Helper deleted successfully!');
      fetchHelpers();
      fetchUsers();
    } catch (err) {
      alert('❌ Error deleting helper');
      console.error(err);
    }
  };

  // Toggle verification status (Admin only)
  const toggleVerification = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      const newStatus = currentStatus === 'verified' ? 'pending' : 'verified';
      await axios.put(
        `http://localhost:5000/api/helpers/admin/verify/${id}`,
        { verificationStatus: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`✅ Helper ${newStatus === 'verified' ? 'verified' : 'unverified'} successfully!`);
      fetchHelpers();
    } catch (err) {
      alert('❌ Error updating verification');
      console.error(err);
    }
  };

  // Filter helpers by search
  const filteredHelpers = helpers.filter(helper =>
    helper.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    helper.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    helper.serviceType?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
    helper.skills?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Get available users (users without helper profiles)
  const availableUsers = users.filter(u => {
    const hasHelper = helpers.some(h => h.userId?._id === u._id);
    return !hasHelper && u._id !== user?.id;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">👩‍🍳 Manage Helpers</h1>
            <p className="text-gray-600 mt-1">Add, edit, or remove helper profiles</p>
          </div>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-secondary transition flex items-center gap-2"
          >
            <FaPlus /> Add Helper
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, service type, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="text-sm text-gray-500">Total Helpers</span>
              <p className="text-2xl font-bold text-primary">{helpers.length}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Verified</span>
              <p className="text-2xl font-bold text-green-600">
                {helpers.filter(h => h.verificationStatus === 'verified').length}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Pending</span>
              <p className="text-2xl font-bold text-yellow-600">
                {helpers.filter(h => h.verificationStatus === 'pending').length}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Available Users</span>
              <p className="text-2xl font-bold text-blue-600">{availableUsers.length}</p>
            </div>
          </div>
        </div>

        {/* Add/Edit Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingHelper ? '✏️ Edit Helper' : '➕ Add New Helper'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Admin: Select User */}
                {user?.role === 'admin' && !editingHelper && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <FaUser className="inline mr-1" /> Select User
                    </label>
                    <select
                      value={selectedUserId}
                      onChange={(e) => setSelectedUserId(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    >
                      <option value="">-- Create for myself --</option>
                      {availableUsers.map(u => (
                        <option key={u._id} value={u._id}>
                          {u.name} ({u.email}) - {u.role}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      {availableUsers.length === 0 ? (
                        <span className="text-yellow-600">⚠️ All users already have helper profiles!</span>
                      ) : (
                        <span className="text-green-600">✅ {availableUsers.length} user(s) available to create helper profiles</span>
                      )}
                    </p>
                  </div>
                )}

                {/* Basic Info */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service Type *</label>
                  <div className="flex flex-wrap gap-2">
                    {serviceOptions.map(service => (
                      <button
                        key={service}
                        type="button"
                        onClick={() => {
                          const selected = formData.serviceType.includes(service)
                            ? formData.serviceType.filter(s => s !== service)
                            : [...formData.serviceType, service];
                          setFormData({ ...formData, serviceType: selected });
                        }}
                        className={`px-4 py-2 rounded-lg border transition ${
                          formData.serviceType.includes(service)
                            ? 'bg-primary text-white border-primary'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                        }`}
                      >
                        {service}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Experience (Years)</label>
                    <input
                      type="number"
                      name="yearsOfExperience"
                      value={formData.yearsOfExperience}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Verification Status</label>
                    <select
                      name="verificationStatus"
                      value={formData.verificationStatus}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    >
                      <option value="pending">Pending</option>
                      <option value="verified">Verified</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma separated)</label>
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleInputChange}
                    placeholder="e.g. Childcare, First Aid, Cooking"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Languages (comma separated)</label>
                  <input
                    type="text"
                    name="languages"
                    value={formData.languages}
                    onChange={handleInputChange}
                    placeholder="e.g. Hindi, English, Marathi"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Cities (comma separated)</label>
                  <input
                    type="text"
                    name="preferredCities"
                    value={formData.preferredCities}
                    onChange={handleInputChange}
                    placeholder="e.g. Mumbai, Pune, Delhi"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Availability */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Working Days</label>
                  <div className="flex flex-wrap gap-2">
                    {dayOptions.map(day => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => {
                          const selected = formData.workingDays.includes(day)
                            ? formData.workingDays.filter(d => d !== day)
                            : [...formData.workingDays, day];
                          setFormData({ ...formData, workingDays: selected });
                        }}
                        className={`px-3 py-1 text-sm rounded-lg border transition ${
                          formData.workingDays.includes(day)
                            ? 'bg-primary text-white border-primary'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                        }`}
                      >
                        {day.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                    <input
                      type="time"
                      name="workingHoursStart"
                      value={formData.workingHoursStart}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                    <input
                      type="time"
                      name="workingHoursEnd"
                      value={formData.workingHoursEnd}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={formData.isAvailable}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-primary"
                  />
                  <label className="text-sm font-medium text-gray-700">Available for work</label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-secondary transition"
                  >
                    {editingHelper ? 'Update Helper' : 'Create Helper'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Helpers Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        ) : filteredHelpers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">👩‍🍳</div>
            <h3 className="text-xl font-semibold text-gray-700">No helpers found</h3>
            <p className="text-gray-500 mt-2">
              {searchTerm ? 'Try adjusting your search' : 'Click "Add Helper" to create one'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Services</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Experience</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Verified</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredHelpers.map(helper => (
                  <tr key={helper._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={helper.profilePic || `https://ui-avatars.com/api/?name=${helper.fullName}&background=4F46E5&color=fff&size=40`}
                          alt={helper.fullName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-medium text-gray-900">{helper.fullName}</div>
                          <div className="text-sm text-gray-500">{helper.userId?.email || 'No email'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {helper.serviceType?.map(type => (
                          <span key={type} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                            {type}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {helper.yearsOfExperience || 0} years
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        helper.availability?.isAvailable !== false
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {helper.availability?.isAvailable !== false ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleVerification(helper._id, helper.verificationStatus)}
                        className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${
                          helper.verificationStatus === 'verified'
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : helper.verificationStatus === 'rejected'
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                        }`}
                      >
                        {helper.verificationStatus === 'verified' ? <FaCheck /> : <FaTimes />}
                        {helper.verificationStatus}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(helper)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(helper._id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageHelpers;