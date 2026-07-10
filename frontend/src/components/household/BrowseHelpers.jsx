import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FaSearch, FaFilter } from 'react-icons/fa';
import HelperCard from './HelperCard';

const BrowseHelpers = () => {
  const [helpers, setHelpers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    serviceType: '',
    experience: '',
    city: '',
    minRating: '',
    search: ''
  });

  const [showFilters, setShowFilters] = useState(false);

  // Service types
  const serviceTypes = ['maid', 'babysitter', 'nanny'];
  const experienceLevels = ['0-2', '3-5', '5+'];
  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata'];

  // Fetch helpers with filters
  const fetchHelpers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query string
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });

      console.log('Fetching helpers with params:', params.toString());
      
      const response = await axios.get(`http://localhost:5000/api/helpers?${params}`);
      console.log('API Response:', response.data);
      
      setHelpers(response.data.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching helpers:', err);
      setError('Failed to load helpers. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchHelpers();
  }, [fetchHelpers]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchHelpers();
  };

  const clearFilters = () => {
    setFilters({
      serviceType: '',
      experience: '',
      city: '',
      minRating: '',
      search: ''
    });
    setTimeout(fetchHelpers, 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            🧑‍🍳 Find Your Perfect Helper
          </h1>
          <p className="text-gray-600 mt-2">
            Browse verified and trusted domestic helpers in your area
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search by name, skills, or keywords..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition"
              />
            </div>
            <button
              type="submit"
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-secondary transition"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition flex items-center gap-2"
            >
              <FaFilter /> Filters
            </button>
            {Object.values(filters).some(f => f) && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-red-500 hover:text-red-600 px-4 py-2"
              >
                Clear All
              </button>
            )}
          </form>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service Type
              </label>
              <select
                name="serviceType"
                value={filters.serviceType}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="">All Types</option>
                {serviceTypes.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Experience
              </label>
              <select
                name="experience"
                value={filters.experience}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="">Any Experience</option>
                {experienceLevels.map(level => (
                  <option key={level} value={level}>
                    {level} years
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <select
                name="city"
                value={filters.city}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="">Any City</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Rating
              </label>
              <select
                name="minRating"
                value={filters.minRating}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="">Any Rating</option>
                <option value="4">⭐ 4+ Stars</option>
                <option value="3">⭐ 3+ Stars</option>
                <option value="2">⭐ 2+ Stars</option>
              </select>
            </div>
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        ) : helpers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700">No helpers found</h3>
            <p className="text-gray-500 mt-2">
              Try adjusting your filters or search terms
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {helpers.map(helper => (
              <HelperCard key={helper._id} helper={helper} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseHelpers;