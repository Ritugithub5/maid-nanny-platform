import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  FaFacebook, 
  FaTwitter, 
  FaLinkedin, 
  FaInstagram, 
  FaYoutube,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [contactInfo, setContactInfo] = useState({
    phone: '+91 12345 67890',
    email: 'info@travelbharat.com',
    officeAddress: '123, Travel Street',
    officeCity: 'New Delhi, India'
  });
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const fetchLatestContact = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/contact/latest`);
      if (response.data && response.data.success && response.data.data) {
        // Update contact info with fetched data
        setContactInfo({
          phone: response.data.data.phone || '+91 12345 67890',
          email: response.data.data.email || 'info@travelbharat.com',
          officeAddress: response.data.data.address || '123, Travel Street',
          officeCity: response.data.data.city || 'New Delhi, India'
        });
      }
    } catch (error) {
      console.error('Error fetching latest contact:', error);
      // Keep default contact info
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestContact();
  }, []);

  const footerLinks = {
    company: [
      { name: 'About Us', path: '/about' },
      { name: 'States', path: '/states' },
      { name: 'Experiences', path: '/experience' },
    ],
    legal: [
      { name: 'Terms of Service', path: '/terms' },
      { name: 'Privacy Policy', path: '/privacy' },
    ],
  };

  const socialLinks = [
    { icon: <FaFacebook className="text-lg" />, url: '#', label: 'Facebook' },
    { icon: <FaTwitter className="text-lg" />, url: '#', label: 'Twitter' },
    { icon: <FaLinkedin className="text-lg" />, url: '#', label: 'LinkedIn' },
    { icon: <FaInstagram className="text-lg" />, url: '#', label: 'Instagram' },
    { icon: <FaYoutube className="text-lg" />, url: '#', label: 'YouTube' },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-300 bg-clip-text text-transparent">
                TravelBharat
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4 max-w-xs">
              Explore India state by state. Your complete guide to Indian tourist destinations, 
              heritage sites, cultural experiences, and hidden gems across the country.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gradient-to-r from-orange-400 to-orange-300 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:text-gray-900"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="md:pl-8 lg:pl-12">
            <h3 className="text-white font-bold text-lg mb-4 relative">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-orange-400"></span>
            </h3>
            <ul className="space-y-3 mt-4">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <Link to={link.path} className="text-gray-400 hover:text-orange-400 transition-colors text-sm flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-orange-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:pl-4">
            <h3 className="text-white font-bold text-lg mb-4 relative">
              Contact Us
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-orange-400"></span>
            </h3>
            <div className="space-y-3 mt-4">
              <div className="flex items-center gap-2 text-gray-400 text-sm hover:text-orange-400 transition-colors group">
                <FaPhone className="text-orange-400 text-xs flex-shrink-0" />
                <span>{contactInfo?.phone || '+91 12345 67890'}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm hover:text-orange-400 transition-colors group">
                <FaEnvelope className="text-orange-400 text-xs flex-shrink-0" />
                <span>{contactInfo?.email || 'info@travelbharat.com'}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm hover:text-orange-400 transition-colors group">
                <FaMapMarkerAlt className="text-orange-400 text-xs flex-shrink-0" />
                <span className="text-xs">
                  {contactInfo?.officeAddress || '123, Travel Street'}, {contactInfo?.officeCity || 'New Delhi, India'}
                </span>
              </div>
            </div>
            <ul className="space-y-3 mt-4">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <Link to={link.path} className="text-gray-400 hover:text-orange-400 transition-colors text-sm flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-orange-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4 md:mb-0">
              <span>© {currentYear} TravelBharat. All rights reserved.</span>
              <span className="hidden md:inline text-gray-700">|</span>
              <span className="flex items-center gap-1">
                Made with <span className="text-red-500 animate-pulse">❤️</span> for India
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;