import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt, FaBriefcase, FaCheckCircle, FaClock } from 'react-icons/fa';

const HelperCard = ({ helper }) => {
  // Log the helper data to see what's coming
  console.log('HelperCard received:', helper);

  const { 
    _id, 
    fullName, 
    profilePic, 
    serviceType, 
    yearsOfExperience, 
    rating, 
    verificationStatus,
    availability,
    preferredCities,
    skills,
    bio,
    userId
  } = helper || {};

  const displayName = fullName || userId?.name || 'Helper';
  const city = preferredCities?.[0] || 'Location not specified';
  const avgRating = rating?.average || 0;
  const ratingCount = rating?.count || 0;

  // Get service type emoji
  const getServiceEmoji = (type) => {
    const emojis = {
      maid: '🧹',
      babysitter: '👶',
      nanny: '👩‍🍼'
    };
    return emojis[type] || '🧑‍🍳';
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      {/* Profile Image */}
      <div className="relative h-48 bg-gradient-to-r from-blue-100 to-indigo-100">
        <img
          src={profilePic || `https://ui-avatars.com/api/?name=${displayName}&background=4F46E5&color=fff&size=200`}
          alt={displayName}
          className="w-full h-full object-cover"
        />
        {verificationStatus === 'verified' && (
          <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <FaCheckCircle className="w-3 h-3" />
            Verified
          </div>
        )}
        {availability?.isAvailable !== false && (
          <div className="absolute bottom-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <FaClock className="w-3 h-3" />
            Available
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {displayName}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              {serviceType?.map((type, index) => (
                <span key={index} className="text-sm text-gray-600 flex items-center gap-1">
                  {getServiceEmoji(type)} {type}
                  {index < serviceType.length - 1 && ' • '}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
            <FaStar className="text-yellow-400 w-4 h-4 mr-1" />
            <span className="font-semibold text-gray-900">{avgRating.toFixed(1)}</span>
            <span className="text-xs text-gray-500 ml-1">({ratingCount})</span>
          </div>
        </div>

        {/* Experience & Location */}
        <div className="mt-3 space-y-1.5">
          <div className="flex items-center text-sm text-gray-600">
            <FaBriefcase className="w-4 h-4 mr-2 text-gray-400" />
            {yearsOfExperience || 0} years experience
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <FaMapMarkerAlt className="w-4 h-4 mr-2 text-gray-400" />
            {city}
          </div>
        </div>

        {/* Skills */}
        {skills && skills.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {skills.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
              >
                {skill}
              </span>
            ))}
            {skills.length > 3 && (
              <span className="text-xs text-gray-500">
                +{skills.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Bio */}
        {bio && (
          <p className="mt-3 text-sm text-gray-600 line-clamp-2">
            {bio}
          </p>
        )}

        {/* Action Button */}
        <Link
          to={`/helper/${_id}`}
          className="mt-4 block w-full text-center bg-primary text-white py-2.5 rounded-lg hover:bg-secondary transition font-medium"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
};

export default HelperCard;