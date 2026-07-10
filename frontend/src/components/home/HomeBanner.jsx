import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaShieldAlt, FaClock } from 'react-icons/fa';

const HomeBanner = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-[600px] flex items-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 text-7xl opacity-20 animate-bounce">👩‍🍳</div>
      <div className="absolute bottom-20 right-10 text-7xl opacity-20 animate-bounce delay-200">👶</div>
      <div className="absolute top-1/2 left-1/4 text-5xl opacity-10 animate-pulse">🧹</div>
      
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `radial-gradient(circle at 20px 20px, #4F46E5 2px, transparent 2px)`,
        backgroundSize: '40px 40px'
      }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center bg-primary/10 px-4 py-2 rounded-full mb-6">
              <span className="text-primary text-sm font-semibold">🌟 Trusted by 10,000+ Families</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Connecting Families with
              <span className="text-primary block mt-2">Quality, Local Caregivers</span>
            </h1>
            
            <p className="text-lg text-gray-600 mt-4 max-w-lg">
              Verified maids, babysitters, and nannies at your fingertips. 
              Safe, reliable, and background-checked professionals.
            </p>

            {/* Stats */}
            <div className="flex gap-6 mt-6">
              <div>
                <p className="text-2xl font-bold text-gray-900">500+</p>
                <p className="text-sm text-gray-500">Verified Helpers</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">4.9⭐</p>
                <p className="text-sm text-gray-500">Average Rating</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">98%</p>
                <p className="text-sm text-gray-500">Satisfaction</p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 mt-8">
              <button
                onClick={() => navigate('/register')}
                className="bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-secondary transition shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                Find Your Helper →
              </button>
              <button
                onClick={() => navigate('/browse')}
                className="border-2 border-primary text-primary px-8 py-3 rounded-xl font-semibold hover:bg-primary hover:text-white transition"
              >
                Browse All
              </button>
            </div>
          </div>

          {/* Right Side - Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <FaShieldAlt className="text-primary text-2xl" />
              </div>
              <h3 className="font-bold text-gray-900">100% Verified</h3>
              <p className="text-sm text-gray-500 mt-1">Every helper is thoroughly verified</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-4">
                <FaStar className="text-yellow-500 text-2xl" />
              </div>
              <h3 className="font-bold text-gray-900">Rated & Reviewed</h3>
              <p className="text-sm text-gray-500 mt-1">Real reviews from real families</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100 md:col-span-2">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <FaClock className="text-green-500 text-2xl" />
              </div>
              <h3 className="font-bold text-gray-900">Quick & Easy Booking</h3>
              <p className="text-sm text-gray-500 mt-1">Book trusted helpers in minutes, not days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeBanner;