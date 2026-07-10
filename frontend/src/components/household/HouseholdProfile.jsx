import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaHome, 
  FaMapMarkerAlt, 
  FaChild, 
  FaPaw,
  FaSave,
  FaArrowLeft,
  FaEdit,
  FaCheckCircle,
  FaUsers,
  FaLanguage,
  FaClock,
  FaCalendar
} from 'react-icons/fa';

const HouseholdProfile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    householdProfile: {
      familyName: '',
      familyMembers: 0,
      children: 0,
      childrenAges: [],
      pets: false,
      petDetails: '',
      specialRequirements: '',
      preferredLanguage: 'English',
      aboutFamily: ''
    },
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India',
      landmark: ''
    },
    preferences: {
      preferredServiceType: [],
      preferredLanguage: '',
      budgetRange: { min: 0, max: 0 },
      preferredDays: [],
      preferredTiming: ''
    }
  });

  const serviceOptions = ['maid', 'babysitter', 'nanny'];
  const dayOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const languageOptions = ['English', 'Hindi', 'Marathi', 'Gujarati', 'Bengali', 'Tamil', 'Telugu', 'Malayalam'];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'http://localhost:5000/api/users/profile',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const userData = response.data.data;
      setProfile(userData);
      
      setFormData({
        name: userData.name || '',
        phone: userData.phone || '',
        householdProfile: userData.householdProfile || {
          familyName: '',
          familyMembers: 0,
          children: 0,
          childrenAges: [],
          pets: false,
          petDetails: '',
          specialRequirements: '',
          preferredLanguage: 'English',
          aboutFamily: ''
        },
        address: userData.address || {
          street: '',
          city: '',
          state: '',
          pincode: '',
          country: 'India',
          landmark: ''
        },
        preferences: userData.preferences || {
          preferredServiceType: [],
          preferredLanguage: '',
          budgetRange: { min: 0, max: 0 },
          preferredDays: [],
          preferredTiming: ''
        }
      });
      
      setLoading(false);
    } catch (err) {
      setError('Failed to load profile');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const parts = name.split('.');
      if (parts.length === 2) {
        setFormData({
          ...formData,
          [parts[0]]: {
            ...formData[parts[0]],
            [parts[1]]: type === 'checkbox' ? checked : value
          }
        });
      } else if (parts.length === 3) {
        setFormData({
          ...formData,
          [parts[0]]: {
            ...formData[parts[0]],
            [parts[1]]: {
              ...formData[parts[0]][parts[1]],
              [parts[2]]: type === 'checkbox' ? checked : value
            }
          }
        });
      }
    } else {
      setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    }
  };

  const handleArrayChange = (field, value) => {
    const current = formData.preferences[field] || [];
    const updated = current.includes(value)
      ? current.filter(item => item !== value)
      : [...current, value];
    setFormData({
      ...formData,
      preferences: {
        ...formData.preferences,
        [field]: updated
      }
    });
  };

  const handleChildrenAgesChange = (e) => {
    const ages = e.target.value.split(',').map(a => parseInt(a.trim())).filter(a => !isNaN(a));
    setFormData({
      ...formData,
      householdProfile: {
        ...formData.householdProfile,
        childrenAges: ages
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('token');
      
      const payload = {
        name: formData.name,
        phone: formData.phone,
        householdProfile: formData.householdProfile,
        address: formData.address,
        preferences: formData.preferences,
        isProfileComplete: true
      };

      await axios.put(
        'http://localhost:5000/api/users/profile',
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess('✅ Profile updated successfully!');
      setIsEditing(false);
      fetchProfile();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto"></div>
          <p className="mt-6 text-gray-600 text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="mb-6 flex items-center text-gray-600 hover:text-primary transition"
        >
          <FaArrowLeft className="mr-2" /> Back to Dashboard
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  <FaHome /> Household Profile
                </h1>
                <p className="text-blue-100 mt-1">
                  Manage your household information and preferences
                </p>
              </div>
              {!isEditing && profile?.isProfileComplete && (
                <span className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
                  <FaCheckCircle /> Complete
                </span>
              )}
            </div>
          </div>

          <div className="p-8">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                ❌ {error}
              </div>
            )}

            {success && (
              <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                {success}
              </div>
            )}

            {!isEditing ? (
              // View Mode
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-semibold text-gray-900">{profile?.name || 'Not set'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-semibold text-gray-900">{profile?.email}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-semibold text-gray-900">{profile?.phone || 'Not set'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500">Role</p>
                    <p className="font-semibold text-gray-900 capitalize">{profile?.role}</p>
                  </div>
                </div>

                {/* Household Details */}
                <div className="border-t pt-4">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">🏠 Household Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-500">Family Name</p>
                      <p className="font-semibold text-gray-900">
                        {profile?.householdProfile?.familyName || 'Not set'}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-500">Family Members</p>
                      <p className="font-semibold text-gray-900">
                        {profile?.householdProfile?.familyMembers || 0}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-500">Children</p>
                      <p className="font-semibold text-gray-900">
                        {profile?.householdProfile?.children || 0}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-500">Pets</p>
                      <p className="font-semibold text-gray-900">
                        {profile?.householdProfile?.pets ? 'Yes' : 'No'}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 md:col-span-2">
                      <p className="text-sm text-gray-500">Special Requirements</p>
                      <p className="font-semibold text-gray-900">
                        {profile?.householdProfile?.specialRequirements || 'None'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="border-t pt-4">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">📍 Address</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4 md:col-span-2">
                      <p className="text-sm text-gray-500">Street</p>
                      <p className="font-semibold text-gray-900">
                        {profile?.address?.street || 'Not set'}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-500">City</p>
                      <p className="font-semibold text-gray-900">
                        {profile?.address?.city || 'Not set'}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-500">State</p>
                      <p className="font-semibold text-gray-900">
                        {profile?.address?.state || 'Not set'}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-500">Pincode</p>
                      <p className="font-semibold text-gray-900">
                        {profile?.address?.pincode || 'Not set'}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-500">Country</p>
                      <p className="font-semibold text-gray-900">
                        {profile?.address?.country || 'India'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Preferences */}
                <div className="border-t pt-4">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">⚙️ Preferences</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-500">Preferred Service</p>
                      <p className="font-semibold text-gray-900">
                        {profile?.preferences?.preferredServiceType?.join(', ') || 'Not set'}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-500">Preferred Language</p>
                      <p className="font-semibold text-gray-900">
                        {profile?.preferences?.preferredLanguage || 'Not set'}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-500">Preferred Days</p>
                      <p className="font-semibold text-gray-900">
                        {profile?.preferences?.preferredDays?.join(', ') || 'Not set'}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-500">Preferred Timing</p>
                      <p className="font-semibold text-gray-900">
                        {profile?.preferences?.preferredTiming || 'Not set'}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full bg-primary text-white py-3 rounded-lg hover:bg-secondary transition font-semibold flex items-center justify-center gap-2"
                >
                  <FaEdit /> Edit Profile
                </button>
              </div>
            ) : (
              // Edit Mode
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone *
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Household Details */}
                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">🏠 Household Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Family Name
                      </label>
                      <input
                        type="text"
                        name="householdProfile.familyName"
                        value={formData.householdProfile.familyName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Family Members
                      </label>
                      <input
                        type="number"
                        name="householdProfile.familyMembers"
                        value={formData.householdProfile.familyMembers}
                        onChange={handleChange}
                        min="0"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Children Count
                      </label>
                      <input
                        type="number"
                        name="householdProfile.children"
                        value={formData.householdProfile.children}
                        onChange={handleChange}
                        min="0"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Children Ages (comma separated)
                      </label>
                      <input
                        type="text"
                        value={formData.householdProfile.childrenAges.join(', ')}
                        onChange={handleChildrenAgesChange}
                        placeholder="e.g. 2, 5, 8"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="householdProfile.pets"
                        checked={formData.householdProfile.pets}
                        onChange={handleChange}
                        className="w-4 h-4 text-primary"
                      />
                      <label className="text-sm font-medium text-gray-700">Pets in household</label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pet Details (if any)
                      </label>
                      <input
                        type="text"
                        name="householdProfile.petDetails"
                        value={formData.householdProfile.petDetails}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Special Requirements
                      </label>
                      <textarea
                        name="householdProfile.specialRequirements"
                        value={formData.householdProfile.specialRequirements}
                        onChange={handleChange}
                        rows="2"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Preferred Language
                      </label>
                      <select
                        name="householdProfile.preferredLanguage"
                        value={formData.householdProfile.preferredLanguage}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                      >
                        {languageOptions.map(lang => (
                          <option key={lang} value={lang}>{lang}</option>
                        ))}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        About Your Family
                      </label>
                      <textarea
                        name="householdProfile.aboutFamily"
                        value={formData.householdProfile.aboutFamily}
                        onChange={handleChange}
                        rows="2"
                        placeholder="Tell us about your family..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">📍 Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address
                      </label>
                      <input
                        type="text"
                        name="address.street"
                        value={formData.address.street}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        name="address.city"
                        value={formData.address.city}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        name="address.state"
                        value={formData.address.state}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pincode
                      </label>
                      <input
                        type="text"
                        name="address.pincode"
                        value={formData.address.pincode}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Landmark
                      </label>
                      <input
                        type="text"
                        name="address.landmark"
                        value={formData.address.landmark}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>

                {/* Preferences */}
                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">⚙️ Preferences</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Service Types
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {serviceOptions.map(service => (
                          <button
                            key={service}
                            type="button"
                            onClick={() => handleArrayChange('preferredServiceType', service)}
                            className={`px-4 py-2 rounded-lg border transition ${
                              formData.preferences.preferredServiceType.includes(service)
                                ? 'bg-primary text-white border-primary'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                            }`}
                          >
                            {service}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Preferred Language
                      </label>
                      <select
                        name="preferences.preferredLanguage"
                        value={formData.preferences.preferredLanguage}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Select language</option>
                        {languageOptions.map(lang => (
                          <option key={lang} value={lang}>{lang}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Days
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {dayOptions.map(day => (
                          <button
                            key={day}
                            type="button"
                            onClick={() => handleArrayChange('preferredDays', day)}
                            className={`px-3 py-1 text-sm rounded-lg border transition ${
                              formData.preferences.preferredDays.includes(day)
                                ? 'bg-primary text-white border-primary'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                            }`}
                          >
                            {day.slice(0, 3)}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Preferred Timing
                      </label>
                      <input
                        type="text"
                        name="preferences.preferredTiming"
                        value={formData.preferences.preferredTiming}
                        onChange={handleChange}
                        placeholder="e.g. Morning, Afternoon, Evening"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Budget Range (₹)
                      </label>
                      <div className="flex gap-4">
                        <input
                          type="number"
                          name="preferences.budgetRange.min"
                          value={formData.preferences.budgetRange.min}
                          onChange={handleChange}
                          placeholder="Min"
                          className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                        />
                        <input
                          type="number"
                          name="preferences.budgetRange.max"
                          value={formData.preferences.budgetRange.max}
                          onChange={handleChange}
                          placeholder="Max"
                          className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-primary text-white py-3 rounded-lg hover:bg-secondary transition font-semibold disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    <FaSave /> {saving ? 'Saving...' : 'Save Profile'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HouseholdProfile;