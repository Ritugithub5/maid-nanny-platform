import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  FaStar, 
  FaMapMarkerAlt, 
  FaBriefcase, 
  FaCheckCircle, 
  FaClock,
  FaPhone,
  FaEnvelope,
  FaUser,
  FaLanguage,
  FaTools,
  FaCalendar,
  FaArrowLeft,
  FaThumbsUp,
  FaAward,
  FaInfoCircle
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import BookingModal from './BookingModal';

const HelperProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  const [helper, setHelper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBooking, setShowBooking] = useState(false);

  // Fetch helper data
  useEffect(() => {
    const fetchHelper = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/helpers/${id}`);
        setHelper(response.data.data);
        setError(null);
      } catch (err) {
        setError('Failed to load helper profile. Please try again.');
        console.error('Error fetching helper:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHelper();
    window.scrollTo(0, 0);
  }, [id]);

  // Get service type emoji
  const getServiceEmoji = (type) => {
    const emojis = {
      maid: '🧹',
      babysitter: '👶',
      nanny: '👩‍🍼'
    };
    return emojis[type] || '🧑‍🍳';
  };

  // Get rating stars
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`star-${i}`} className="text-yellow-400" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStar key="half-star" className="text-yellow-400" style={{ opacity: 0.5 }} />);
    }
    return stars;
  };

  // Handle book now click
  const handleBookNow = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/helper/${id}` } });
      return;
    }
    
    if (user?.role === 'helper') {
      alert('👋 Helpers cannot book services for themselves. Please create a household account to book.');
      return;
    }
    
    setShowBooking(true);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto"></div>
          <p className="mt-6 text-gray-600 text-lg">Loading helper profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/browse')}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary transition"
          >
            Browse Helpers
          </button>
        </div>
      </div>
    );
  }

  // Not found
  if (!helper) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Helper Not Found</h2>
          <p className="text-gray-600 mb-6">The helper you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/browse')}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary transition"
          >
            Browse Helpers
          </button>
        </div>
      </div>
    );
  }

  const { 
    fullName, 
    userId, 
    profilePic, 
    bio, 
    serviceType, 
    yearsOfExperience, 
    skills, 
    languages,
    verificationStatus,
    availability,
    rating,
    totalJobsCompleted,
    preferredCities
  } = helper;

  const avgRating = rating?.average || 0;
  const ratingCount = rating?.count || 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/browse')}
          className="mb-6 flex items-center text-gray-600 hover:text-primary transition"
        >
          <FaArrowLeft className="mr-2" /> Back to Browse
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 p-8 text-white">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Profile Image */}
              <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden flex-shrink-0">
                <img
                  src={profilePic || `https://ui-avatars.com/api/?name=${fullName}&background=4F46E5&color=fff&size=200`}
                  alt={fullName}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Basic Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start">
                  <h1 className="text-3xl font-bold">{fullName}</h1>
                  {verificationStatus === 'verified' && (
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                      <FaCheckCircle /> Verified
                    </span>
                  )}
                  {availability?.isAvailable !== false && (
                    <span className="bg-green-400 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                      <FaClock /> Available
                    </span>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-3 mt-2 justify-center md:justify-start">
                  {serviceType?.map((type, index) => (
                    <span key={index} className="bg-white/20 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                      {getServiceEmoji(type)} {type.charAt(0).toUpperCase() + type.slice(1)}
                    </span>
                  ))}
                </div>

                {/* Ratings */}
                <div className="flex items-center gap-2 mt-3 justify-center md:justify-start">
                  <div className="flex items-center gap-1 text-yellow-300">
                    {renderStars(avgRating)}
                  </div>
                  <span className="font-semibold">{avgRating.toFixed(1)}</span>
                  <span className="text-white/70">({ratingCount} reviews)</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex-shrink-0">
                <button
                  onClick={handleBookNow}
                  className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg flex items-center gap-2"
                >
                  📅 Book Now
                </button>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* About */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FaInfoCircle className="text-primary" /> About
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {bio || 'No bio provided yet.'}
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-4 rounded-xl text-center">
                    <div className="text-2xl mb-1">💼</div>
                    <p className="text-lg font-bold text-gray-900">{yearsOfExperience || 0}</p>
                    <p className="text-sm text-gray-600">Years Experience</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl text-center">
                    <div className="text-2xl mb-1">🏆</div>
                    <p className="text-lg font-bold text-gray-900">{totalJobsCompleted || 0}</p>
                    <p className="text-sm text-gray-600">Jobs Completed</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl text-center">
                    <div className="text-2xl mb-1">⭐</div>
                    <p className="text-lg font-bold text-gray-900">{avgRating.toFixed(1)}</p>
                    <p className="text-sm text-gray-600">Average Rating</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl text-center">
                    <div className="text-2xl mb-1">📍</div>
                    <p className="text-lg font-bold text-gray-900">{preferredCities?.length || 0}</p>
                    <p className="text-sm text-gray-600">Cities</p>
                  </div>
                </div>

                {/* Skills */}
                {skills && skills.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <FaTools className="text-primary" /> Skills
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Languages */}
                {languages && languages.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <FaLanguage className="text-primary" /> Languages
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {languages.map((lang, index) => (
                        <span
                          key={index}
                          className="bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-sm font-medium"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Sidebar */}
              <div className="space-y-6">
                {/* Contact Info */}
                {userId && (
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-gray-700">
                        <FaUser className="text-primary" />
                        <span>{userId.name || 'Name not provided'}</span>
                      </div>
                      {userId.email && (
                        <div className="flex items-center gap-3 text-gray-700">
                          <FaEnvelope className="text-primary" />
                          <span>{userId.email}</span>
                        </div>
                      )}
                      {userId.phone && (
                        <div className="flex items-center gap-3 text-gray-700">
                          <FaPhone className="text-primary" />
                          <span>{userId.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Availability */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Availability</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Status</span>
                      <span className={`font-semibold ${availability?.isAvailable !== false ? 'text-green-600' : 'text-red-600'}`}>
                        {availability?.isAvailable !== false ? '✅ Available' : '❌ Not Available'}
                      </span>
                    </div>
                    {availability?.workingDays && (
                      <div>
                        <p className="text-gray-600 text-sm">Working Days</p>
                        <p className="text-gray-900 text-sm font-medium">
                          {availability.workingDays.join(', ')}
                        </p>
                      </div>
                    )}
                    {availability?.workingHours && (
                      <div>
                        <p className="text-gray-600 text-sm">Working Hours</p>
                        <p className="text-gray-900 text-sm font-medium">
                          {availability.workingHours.start} - {availability.workingHours.end}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-3">
                  <button
                    onClick={handleBookNow}
                    className="w-full bg-primary text-white py-3 rounded-xl hover:bg-secondary transition font-semibold flex items-center justify-center gap-2"
                  >
                    📅 Book Now
                  </button>
                  <Link
                    to="/browse"
                    className="w-full block text-center bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition font-medium"
                  >
                    Browse More Helpers
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Modal */}
        {showBooking && (
          <BookingModal
            helper={helper}
            onClose={() => setShowBooking(false)}
            onSuccess={() => {
              setShowBooking(false);
              navigate('/dashboard');
            }}
          />
        )}
      </div>
    </div>
  );
};

export default HelperProfile;