import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { FaSave, FaSpinner } from 'react-icons/fa';

const AdminContactInfo = () => {
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const [contactInfo, setContactInfo] = useState({
    phone: '',
    phoneHours: '',
    email: '',
    emailResponse: '',
    officeAddress: '',
    officeCity: '',
    hours: {
      weekdays: '',
      saturday: '',
      sunday: ''
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/contact/info`);
      if (response.data.success) {
        setContactInfo(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching:', error);
      // Set default values if API fails
      setContactInfo({
        phone: '+1 (737) 703-3620',
        phoneHours: 'Mon-Fri 9:00 AM - 6:00 PM EST',
        email: 'support@maidnanny.com',
        emailResponse: "We'll respond within 24 hours",
        officeAddress: '123 Care Street',
        officeCity: 'New York, NY 10001',
        hours: {
          weekdays: 'Mon-Fri: 9:00 AM - 8:00 PM',
          saturday: 'Sat: 10:00 AM - 6:00 PM',
          sunday: 'Sun: Closed'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('hours.')) {
      const hourField = name.split('.')[1];
      setContactInfo({
        ...contactInfo,
        hours: {
          ...contactInfo.hours,
          [hourField]: value
        }
      });
    } else {
      setContactInfo({
        ...contactInfo,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await axios.put(`${API_URL}/api/contact/info`, contactInfo);
      if (response.data.success) {
        setMessage({ type: 'success', text: '✅ Contact info updated successfully!' });
        // Update footer automatically after 2 seconds
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      console.error('Error updating:', error);
      setMessage({ type: 'error', text: '❌ Error updating contact info' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Update Contact Information</h1>
            <a href="/contact" className="text-blue-600 hover:text-blue-700 text-sm">
              View Contact Page →
            </a>
          </div>
          
          {message.text && (
            <div className={`p-3 rounded-xl mb-4 ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <input
                  type="text"
                  name="phone"
                  value={contactInfo.phone || ''}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+1 (737) 703-3620"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Hours</label>
                <input
                  type="text"
                  name="phoneHours"
                  value={contactInfo.phoneHours || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Mon-Fri 9:00 AM - 6:00 PM EST"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={contactInfo.email || ''}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="support@maidnanny.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Response</label>
                <input
                  type="text"
                  name="emailResponse"
                  value={contactInfo.emailResponse || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="We'll respond within 24 hours"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Office Address *</label>
                <input
                  type="text"
                  name="officeAddress"
                  value={contactInfo.officeAddress || ''}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="123 Care Street"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Office City *</label>
                <input
                  type="text"
                  name="officeCity"
                  value={contactInfo.officeCity || ''}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="New York, NY 10001"
                />
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold text-gray-900 mb-3">Hours of Operation</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weekdays</label>
                  <input
                    type="text"
                    name="hours.weekdays"
                    value={contactInfo.hours?.weekdays || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Mon-Fri: 9:00 AM - 8:00 PM"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Saturday</label>
                  <input
                    type="text"
                    name="hours.saturday"
                    value={contactInfo.hours?.saturday || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Sat: 10:00 AM - 6:00 PM"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sunday</label>
                  <input
                    type="text"
                    name="hours.sunday"
                    value={contactInfo.hours?.sunday || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Sun: Closed"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-70"
            >
              {saving ? (
                <><FaSpinner className="animate-spin" /> Updating...</>
              ) : (
                <><FaSave /> Update Contact Info</>
              )}
            </button>

            <p className="text-xs text-gray-400 text-center mt-2">
              This will update the contact information displayed on the footer and contact page
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminContactInfo;