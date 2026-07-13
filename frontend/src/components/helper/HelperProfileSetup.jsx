import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaTools, 
  FaLanguage, 
  FaMapMarkerAlt, 
  FaClock,
  FaFileUpload,
  FaCheckCircle,
  FaTimesCircle,
  FaClock as FaClockIcon,
  FaUpload
} from 'react-icons/fa';

const HelperProfileSetup = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [profile, setProfile] = useState(null);
  const [docStatus, setDocStatus] = useState(null);
  
  const [formData, setFormData] = useState({
    fullName: '',
    bio: '',
    serviceType: [],
    yearsOfExperience: '',
    skills: '',
    languages: '',
    availability: {
      isAvailable: true,
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      workingHours: { start: '09:00', end: '18:00' }
    },
    preferredCities: ''
  });

  const serviceOptions = ['maid', 'babysitter', 'nanny'];
  const dayOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Fetch existing profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Get helper profile
        const profileResponse = await axios.get(
          'http://localhost:5000/api/helpers/me/profile',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProfile(profileResponse.data.data);
        
        // Populate form
        const data = profileResponse.data.data;
        
        // ✅ Ensure workingHours is properly structured
        let availabilityData = data.availability || {
          isAvailable: true,
          workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          workingHours: { start: '09:00', end: '18:00' }
        };
        
        // If workingHours is a string (shouldn't happen, but just in case)
        if (typeof availabilityData.workingHours === 'string') {
          availabilityData.workingHours = {
            start: availabilityData.workingHours,
            end: '18:00'
          };
        }
        
        // If workingHours is missing or invalid
        if (!availabilityData.workingHours || 
            typeof availabilityData.workingHours !== 'object') {
          availabilityData.workingHours = { start: '09:00', end: '18:00' };
        }
        
        setFormData({
          fullName: data.fullName || '',
          bio: data.bio || '',
          serviceType: data.serviceType || [],
          yearsOfExperience: data.yearsOfExperience || '',
          skills: data.skills ? data.skills.join(', ') : '',
          languages: data.languages ? data.languages.join(', ') : '',
          availability: availabilityData,
          preferredCities: data.preferredCities ? data.preferredCities.join(', ') : ''
        });

        // Get document status
        try {
          const docResponse = await axios.get(
            'http://localhost:5000/api/helpers/documents/status',
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setDocStatus(docResponse.data.data);
        } catch (docErr) {
          // No documents uploaded yet
          setDocStatus(null);
        }

        setLoading(false);
      } catch (err) {
        // No profile exists, that's fine
        setProfile(null);
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else if (name === 'serviceType') {
      const selected = formData.serviceType.includes(value)
        ? formData.serviceType.filter(item => item !== value)
        : [...formData.serviceType, value];
      setFormData({ ...formData, serviceType: selected });
    } else if (name === 'workingDays') {
      const selected = formData.availability.workingDays.includes(value)
        ? formData.availability.workingDays.filter(item => item !== value)
        : [...formData.availability.workingDays, value];
      setFormData({
        ...formData,
        availability: { ...formData.availability, workingDays: selected }
      });
    } else if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('token');
      
      // ✅ Ensure workingHours is properly structured before sending
      let availabilityData = { ...formData.availability };
      
      // If workingHours is a string (shouldn't happen, but just in case)
      if (typeof availabilityData.workingHours === 'string') {
        availabilityData.workingHours = {
          start: availabilityData.workingHours,
          end: '18:00'
        };
      }
      
      // If workingHours is missing or invalid
      if (!availabilityData.workingHours || 
          typeof availabilityData.workingHours !== 'object') {
        availabilityData.workingHours = { start: '09:00', end: '18:00' };
      }
      
      const payload = {
        fullName: formData.fullName,
        bio: formData.bio,
        serviceType: formData.serviceType,
        yearsOfExperience: parseInt(formData.yearsOfExperience) || 0,
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
        languages: formData.languages.split(',').map(s => s.trim()).filter(s => s),
        availability: availabilityData,
        preferredCities: formData.preferredCities.split(',').map(s => s.trim()).filter(s => s)
      };

      let response;
      if (profile) {
        // Update existing profile
        response = await axios.put(
          'http://localhost:5000/api/helpers/profile',
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSuccess('✅ Profile updated successfully!');
      } else {
        // Create new profile
        response = await axios.post(
          'http://localhost:5000/api/helpers/profile',
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSuccess('✅ Profile created successfully! Waiting for admin verification.');
      }

      setProfile(response.data.data);
      setSaving(false);
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save profile');
      setSaving(false);
    }
  };

  // Get document status badge
  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-700',
      uploaded: 'bg-blue-100 text-blue-700',
      verified: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700'
    };
    return badges[status] || 'bg-gray-100 text-gray-700';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: '⏳',
      uploaded: '📤',
      verified: '✅',
      rejected: '❌'
    };
    return icons[status] || '📌';
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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-6">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              {profile ? '✏️ Edit Helper Profile' : '📝 Create Helper Profile'}
            </h1>
            <p className="text-blue-100 mt-1">
              {profile 
                ? 'Update your helper profile information' 
                : 'Create your helper profile to start getting bookings'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* User Info */}
            <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <FaUser className="text-primary text-xl" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{user?.name}</p>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <FaEnvelope className="text-gray-400" /> {user?.email}
                </p>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <FaPhone className="text-gray-400" /> {user?.phone}
                </p>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                ❌ {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                {success}
              </div>
            )}

            {/* Profile Status */}
            {profile && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
                <p className="text-sm text-blue-700">
                  Status: <span className="font-semibold">
                    {profile.verificationStatus === 'verified' ? '✅ Verified' :
                     profile.verificationStatus === 'pending' ? '⏳ Pending Verification' :
                     '❌ Rejected'}
                  </span>
                </p>
                {profile.verificationStatus === 'verified' && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    Active
                  </span>
                )}
              </div>
            )}

            {/* ========== DOCUMENT UPLOAD SECTION ========== */}
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
                <FaFileUpload className="text-primary" /> Verification Documents
              </h2>
              
              {docStatus ? (
                <div className="space-y-3">
                  {/* Identity Proof */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-700">🪪 Identity Proof</p>
                      <p className="text-xs text-gray-500">
                        {docStatus.idProof?.status === 'verified' && '✅ Verified'}
                        {docStatus.idProof?.status === 'uploaded' && '📤 Uploaded - Pending Review'}
                        {docStatus.idProof?.status === 'pending' && '⏳ Not Uploaded'}
                        {docStatus.idProof?.status === 'rejected' && '❌ Rejected'}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(docStatus.idProof?.status)}`}>
                      {getStatusIcon(docStatus.idProof?.status)} {docStatus.idProof?.status || 'pending'}
                    </span>
                  </div>

                  {/* Address Proof */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-700">🏠 Address Proof</p>
                      <p className="text-xs text-gray-500">
                        {docStatus.addressProof?.status === 'verified' && '✅ Verified'}
                        {docStatus.addressProof?.status === 'uploaded' && '📤 Uploaded - Pending Review'}
                        {docStatus.addressProof?.status === 'pending' && '⏳ Not Uploaded'}
                        {docStatus.addressProof?.status === 'rejected' && '❌ Rejected'}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(docStatus.addressProof?.status)}`}>
                      {getStatusIcon(docStatus.addressProof?.status)} {docStatus.addressProof?.status || 'pending'}
                    </span>
                  </div>

                  {/* Background Check */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-700">🔍 Background Check</p>
                      <p className="text-xs text-gray-500">
                        {docStatus.backgroundCheck?.status === 'verified' && '✅ Verified'}
                        {docStatus.backgroundCheck?.status === 'uploaded' && '📤 Uploaded - Pending Review'}
                        {docStatus.backgroundCheck?.status === 'pending' && '⏳ Not Uploaded'}
                        {docStatus.backgroundCheck?.status === 'rejected' && '❌ Rejected'}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(docStatus.backgroundCheck?.status)}`}>
                      {getStatusIcon(docStatus.backgroundCheck?.status)} {docStatus.backgroundCheck?.status || 'pending'}
                    </span>
                  </div>

                  {/* Overall Progress */}
                  <div className="mt-3">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Overall Progress</span>
                      <span>{docStatus.overallProgress || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary rounded-full h-2 transition-all duration-500"
                        style={{ width: `${docStatus.overallProgress || 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                  <p className="text-yellow-700">📌 No documents uploaded yet</p>
                  <p className="text-sm text-yellow-600 mt-1">
                    Upload your documents for verification
                  </p>
                </div>
              )}

              {/* Upload Button */}
              <button
                type="button"
                onClick={() => navigate('/helper/documents')}
                className="mt-3 w-full bg-primary/10 text-primary py-2 rounded-lg hover:bg-primary/20 transition font-medium flex items-center justify-center gap-2"
              >
                <FaUpload /> {docStatus ? 'Update Documents' : 'Upload Documents'}
              </button>
            </div>

            {/* ========== REST OF THE FORM ========== */}
            
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="3"
                placeholder="Tell households about yourself, your experience, and what makes you special..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            {/* Service Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Type * <span className="text-xs text-gray-400">(Select all that apply)</span>
              </label>
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

            {/* Experience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Years of Experience
              </label>
              <input
                type="number"
                name="yearsOfExperience"
                value={formData.yearsOfExperience}
                onChange={handleChange}
                min="0"
                max="50"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FaTools className="inline mr-2" /> Skills (comma separated)
              </label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="e.g. Childcare, First Aid, Cooking, Cleaning"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            {/* Languages */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FaLanguage className="inline mr-2" /> Languages (comma separated)
              </label>
              <input
                type="text"
                name="languages"
                value={formData.languages}
                onChange={handleChange}
                placeholder="e.g. Hindi, English, Marathi"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            {/* Preferred Cities */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FaMapMarkerAlt className="inline mr-2" /> Preferred Cities (comma separated)
              </label>
              <input
                type="text"
                name="preferredCities"
                value={formData.preferredCities}
                onChange={handleChange}
                placeholder="e.g. Mumbai, Pune, Delhi"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            {/* Working Days */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaClock className="inline mr-2" /> Working Days
              </label>
              <div className="flex flex-wrap gap-2">
                {dayOptions.map(day => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => {
                      const selected = formData.availability.workingDays.includes(day)
                        ? formData.availability.workingDays.filter(d => d !== day)
                        : [...formData.availability.workingDays, day];
                      setFormData({
                        ...formData,
                        availability: { ...formData.availability, workingDays: selected }
                      });
                    }}
                    className={`px-3 py-1 text-sm rounded-lg border transition ${
                      formData.availability.workingDays.includes(day)
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                    }`}
                  >
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            {/* Working Hours */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  name="availability.workingHours.start"
                  value={formData.availability.workingHours.start}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  name="availability.workingHours.end"
                  value={formData.availability.workingHours.end}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>

            {/* Available for work */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="availability.isAvailable"
                checked={formData.availability.isAvailable}
                onChange={handleChange}
                className="w-4 h-4 text-primary"
              />
              <label className="text-sm font-medium text-gray-700">
                Available for work
              </label>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-primary text-white py-3 rounded-lg hover:bg-secondary transition font-semibold disabled:opacity-70"
              >
                {saving ? 'Saving...' : profile ? 'Update Profile' : 'Create Profile'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HelperProfileSetup;