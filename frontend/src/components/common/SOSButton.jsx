import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaExclamationTriangle, FaTimes, FaPhone } from 'react-icons/fa';

const SOSButton = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [sending, setSending] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [sentContacts, setSentContacts] = useState([]);

  useEffect(() => {
    fetchContacts();
    // Refresh contacts every 30 seconds
    const interval = setInterval(fetchContacts, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const response = await axios.get(
        'http://localhost:5000/api/sos/contacts',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setContacts(response.data.data || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const handleSOS = () => {
    if (!isActive) {
      setIsActive(true);
      setCountdown(5);
      
      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            sendSOS();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return;
    }

    setIsActive(false);
    setCountdown(5);
  };

  const sendSOS = async () => {
    setSending(true);
    try {
      const token = localStorage.getItem('token');
      
      let location = 'Location not available';
      try {
        const pos = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            resolve, 
            reject,
            { enableHighAccuracy: true, timeout: 10000 }
          );
        });
        location = `https://www.google.com/maps?q=${pos.coords.latitude},${pos.coords.longitude}`;
      } catch (err) {
        console.log('Geolocation not available:', err);
      }

      const response = await axios.post(
        'http://localhost:5000/api/sos/alert',
        {
          location,
          message: '🚨 EMERGENCY! I need immediate help. Please contact me as soon as possible.'
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSentContacts(response.data.data?.sentTo || contacts);
      setShowSuccess(true);
      setIsActive(false);
      setCountdown(5);
      
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    } catch (error) {
      if (error.response?.status === 400) {
        alert('❌ No emergency contacts found. Please add contacts first.');
        navigate('/sos/contacts');
      } else {
        alert('❌ Error sending SOS: ' + (error.response?.data?.message || 'Unknown error'));
      }
      setIsActive(false);
      setCountdown(5);
    } finally {
      setSending(false);
    }
  };

  // Show button only when logged in and has contacts
  const hasToken = !!localStorage.getItem('token');
  
  if (!hasToken || contacts.length === 0) {
    return null;
  }

  return (
    <>
      {/* SOS Button - Fixed position with highest z-index */}
      <div className="fixed bottom-24 right-4 z-[99999]">
        <button
          onClick={handleSOS}
          disabled={sending}
          className={`w-16 h-16 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center border-4 ${
            isActive 
              ? 'bg-red-600 border-red-700 animate-pulse scale-110' 
              : 'bg-red-500 border-red-600 hover:bg-red-600 hover:scale-110'
          }`}
          style={{ boxShadow: '0 0 30px rgba(239, 68, 68, 0.6)' }}
        >
          {isActive ? (
            <span className="text-white font-bold text-2xl">{countdown > 0 ? countdown : 'SOS'}</span>
          ) : (
            <FaExclamationTriangle className="text-white text-3xl" />
          )}
        </button>
      </div>

      {/* Countdown Status */}
      {isActive && countdown > 0 && (
        <div className="fixed bottom-36 right-4 z-[99998] bg-red-100 border-2 border-red-300 text-red-700 px-4 py-2 rounded-lg shadow-lg text-sm max-w-xs animate-pulse">
          🚨 Sending in {countdown}s... Tap again to cancel
        </div>
      )}

      {/* SOS Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[999999] p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center shadow-2xl">
            <div className="text-7xl mb-4 animate-bounce">🚨</div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">SOS Alert Sent!</h2>
            <p className="text-gray-600 mb-4">
              Emergency contacts have been notified with your location.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4 text-left max-h-40 overflow-y-auto">
              <p className="text-sm font-semibold text-gray-700 mb-2">Notified Contacts:</p>
              {(sentContacts.length > 0 ? sentContacts : contacts).slice(0, 3).map((c, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-600 py-1 border-b border-gray-100 last:border-0">
                  <FaPhone className="text-green-500 text-xs" />
                  <span className="font-medium">{c.name || 'Contact'}</span>
                  <span className="text-gray-400">•</span>
                  <span>{c.phone || 'N/A'}</span>
                  {c.isPrimary && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 rounded-full ml-auto">Primary</span>
                  )}
                </div>
              ))}
              {contacts.length > 3 && (
                <p className="text-xs text-gray-400 mt-2">+{contacts.length - 3} more contacts notified</p>
              )}
            </div>
            
            <button
              onClick={() => setShowSuccess(false)}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-secondary transition"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SOSButton;