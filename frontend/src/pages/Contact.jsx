import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import axios from 'axios';
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaArrowRight,
  FaCheckCircle,
  FaPaperPlane,
  FaChevronDown,
  FaQuestionCircle,
  FaMapSigns,
  FaSpinner,
  FaBuilding,
  FaAccusoft
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Contact = () => {
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    address: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submittedData, setSubmittedData] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  
  // Contact info
  const [contactInfo, setContactInfo] = useState({
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
  
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // FAQ state
  const [faqSession, setFaqSession] = useState({
    isActive: false,
    lastVisited: null,
    visitCount: 0,
  });
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const faqData = [
    {
      question: "What services does Maid & Nanny offer?",
      answer: "Maid & Nanny offers comprehensive home care services including professional maid services, experienced nannies, childcare, housekeeping, and personalized home management solutions."
    },
    {
      question: "How do I get started with Maid & Nanny?",
      answer: "Fill out the contact form, call our support team, or visit our office. We'll schedule a consultation to understand your needs."
    },
    {
      question: "Are your services available nationwide?",
      answer: "Yes, Maid & Nanny services are available across the United States."
    },
    {
      question: "How do you vet your staff?",
      answer: "All our maids and nannies undergo thorough background checks, reference verification, and professional training."
    },
    {
      question: "How much do your services cost?",
      answer: "We offer flexible pricing plans starting from $25/hour. Contact us for a personalized quote."
    }
  ];

  // Load FAQ session
  useEffect(() => {
    const savedFaqSession = localStorage.getItem('faqSession');
    if (savedFaqSession) {
      try {
        setFaqSession(JSON.parse(savedFaqSession));
      } catch (error) {
        console.error('Error loading FAQ session:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('faqSession', JSON.stringify(faqSession));
  }, [faqSession]);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load contact info
        const infoResponse = await axios.get(`${API_URL}/api/contact/info`);
        if (infoResponse.data.success) {
          setContactInfo(infoResponse.data.data);
        }
        
        // Load submissions
        const submissionsResponse = await axios.get(`${API_URL}/api/contact/all`);
        if (submissionsResponse.data.success) {
          setRecentSubmissions(submissionsResponse.data.data.slice(0, 5));
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [API_URL]);

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }
    if (!formData.phone.trim()) errors.phone = 'Phone is required';
    else if (!/^[0-9]{10,15}$/.test(formData.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }
    if (!formData.subject.trim()) errors.subject = 'Subject is required';
    if (!formData.address.trim()) errors.address = 'Address is required';
    if (!formData.message.trim()) errors.message = 'Message is required';
    else if (formData.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (error) setError(null);
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/api/contact/submit`, formData);
      
      if (response.data.success) {
        setSubmittedData(response.data.data);
        setIsSubmitted(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          address: "",
          message: "",
        });
        setFormErrors({});

        // Immediately fetch updated data
        const submissionsResponse = await axios.get(`${API_URL}/api/contact/all`);
        if (submissionsResponse.data.success) {
          setRecentSubmissions(submissionsResponse.data.data.slice(0, 5));
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });

        setTimeout(() => {
          setIsSubmitted(false);
          setSubmittedData(null);
        }, 5000);
      }
    } catch (err) {
      console.error('Submit error:', err);
      setError('Failed to submit form. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFaqToggle = (index) => {
    const now = new Date().toISOString();
    if (faqSession.visitCount === 0) {
      setFaqSession({ isActive: true, lastVisited: now, visitCount: 1 });
    }
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleFaqView = () => {
    if (!faqSession.isActive) {
      const now = new Date().toISOString();
      setFaqSession({ isActive: true, lastVisited: now, visitCount: 1 });
    }
  };

  const displaySubmittedData = () => {
    if (!submittedData) return null;
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200 text-left"
      >
        <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
          <FaCheckCircle className="text-green-500" />
          Submission Details:
        </h4>
        <div className="space-y-1 text-sm">
          <p><span className="font-medium text-gray-700">Name:</span> <span className="text-gray-600">{submittedData.name}</span></p>
          <p><span className="font-medium text-gray-700">Email:</span> <span className="text-gray-600">{submittedData.email}</span></p>
          <p><span className="font-medium text-gray-700">Phone:</span> <span className="text-gray-600">{submittedData.phone}</span></p>
          <p><span className="font-medium text-gray-700">Subject:</span> <span className="text-gray-600">{submittedData.subject}</span></p>
          <p><span className="font-medium text-gray-700">Address:</span> <span className="text-gray-600">{submittedData.address}</span></p>
          <p><span className="font-medium text-gray-700">Message:</span> <span className="text-gray-600">{submittedData.message}</span></p>
          <p className="text-xs text-gray-500 mt-2">
            📅 Submitted at: {new Date(submittedData.submittedAt).toLocaleString()}
          </p>
        </div>
      </motion.div>
    );
  };

  const contactInfoArray = [
    {
      icon: <FaPhone className="text-xl" />,
      title: "Phone",
      details: [contactInfo.phone, contactInfo.phoneHours],
      color: "from-blue-300 to-blue-600",
      action: `tel:${contactInfo.phone.replace(/\s/g, '')}`,
    },
    {
      icon: <FaEnvelope className="text-xl" />,
      title: "Email",
      details: [contactInfo.email, contactInfo.emailResponse],
      color: "from-green-300 to-green-600",
      action: `mailto:${contactInfo.email}`,
    },
    {
      icon: <FaMapMarkerAlt className="text-xl" />,
      title: "Office",
      details: [contactInfo.officeAddress, contactInfo.officeCity],
      color: "from-purple-300 to-purple-600",
      action: "https://maps.google.com",
    },
    {
      icon: <FaClock className="text-xl" />,
      title: "Hours of Operation",
      details: [
        contactInfo.hours?.weekdays || "Mon-Fri: 9:00 AM - 8:00 PM",
        contactInfo.hours?.saturday || "Sat: 10:00 AM - 6:00 PM",
        contactInfo.hours?.sunday || "Sun: Closed",
      ],
      color: "from-orange-300 to-orange-600",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="relative py-24 bg-gradient-to-br from-gray-300 via-blue-500 to-blue-900 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-block bg-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-full font-semibold text-sm mb-6 border border-white/30"
            >
              📬 Get in Touch
            </motion.span>
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              We're Here to <br />
              <span className="text-yellow-300">Help You</span>
            </h1>
            <p className="text-lg text-blue-100 leading-relaxed max-w-2xl mx-auto">
              Have questions, feedback, or need support? Our dedicated team is ready to assist you 24/7.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="relative -mt-12 z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfoArray.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 text-center group cursor-pointer"
                onClick={() => info.action && window.open(info.action, '_blank')}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${info.color} rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {info.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{info.title}</h3>
                <div className="space-y-1">
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-sm text-gray-600">{detail}</p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 mt-8" id="contact-form">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl shadow-xl p-8 lg:p-10"
            >
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Send Us a Message</h2>
                <p className="text-gray-500 text-sm">
                  Fill out the form below and we'll get back to you within 24 hours.
                </p>
              </div>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-8 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <FaCheckCircle className="text-4xl text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent Successfully! 🎉</h3>
                  <p className="text-gray-600">Thank you for reaching out. We'll respond shortly.</p>
                  {displaySubmittedData()}
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                      {error}
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className={`w-full px-5 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition outline-none ${
                        formErrors.name ? 'border-red-500 bg-red-50' : 'border-gray-200'
                      }`}
                      placeholder="John Doe"
                    />
                    {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={`w-full px-5 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition outline-none ${
                        formErrors.email ? 'border-red-500 bg-red-50' : 'border-gray-200'
                      }`}
                      placeholder="john@example.com"
                    />
                    {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className={`w-full px-5 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition outline-none ${
                        formErrors.phone ? 'border-red-500 bg-red-50' : 'border-gray-200'
                      }`}
                      placeholder="1234567890"
                    />
                    {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className={`w-full px-5 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition outline-none ${
                        formErrors.subject ? 'border-red-500 bg-red-50' : 'border-gray-200'
                      }`}
                      placeholder="How can we help?"
                    />
                    {formErrors.subject && <p className="text-red-500 text-xs mt-1">{formErrors.subject}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className={`w-full px-5 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition outline-none ${
                        formErrors.address ? 'border-red-500 bg-red-50' : 'border-gray-200'
                      }`}
                      placeholder="Enter your address"
                    />
                    {formErrors.address && <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="5"
                      className={`w-full px-5 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition outline-none resize-none ${
                        formErrors.message ? 'border-red-500 bg-red-50' : 'border-gray-200'
                      }`}
                      placeholder="Tell us how we can assist you..."
                    />
                    {formErrors.message && <p className="text-red-500 text-xs mt-1">{formErrors.message}</p>}
                    <p className="text-xs text-gray-400 mt-1">
                      {formData.message.length}/1000 characters
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <><FaSpinner className="animate-spin" /> Sending...</>
                    ) : (
                      <><FaPaperPlane /> Send Message</>
                    )}
                  </button>
                </form>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                <div className="h-96 w-full bg-gray-200 relative">
                  <iframe
                    title="Maid & Nanny Office Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.2219901290355!2d-74.00369368400567!3d40.71312937933038!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a316bb7a1b5%3A0x9e8ecb7a2d7c4a4e!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sus!4v1647898765432!5m2!1sen!2sus"
                    className="w-full h-full border-0"
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <FaMapMarkerAlt className="text-blue-600 text-lg" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Visit Our Office</h3>
                      <p className="text-gray-500 text-sm">
                        {contactInfo.officeAddress}, {contactInfo.officeCity}
                      </p>
                    </div>
                  </div>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium mt-2"
                  >
                    Get Directions <FaArrowRight className="text-xs" />
                  </a>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-400 to-blue-700 rounded-3xl p-6 text-white shadow-xl">
  <div className="text-center mb-4">
    <FaAccusoft className="text-3xl text-teal-400 mx-auto mb-1" />
    <h3 className="text-xl font-bold">Service Locations</h3>
  </div>
  <div className="flex flex-wrap gap-2 justify-center">
    <span className="bg-white/20 px-3 py-1 rounded-full text-sm hover:bg-white/30 transition-colors">🗽 NYC</span>
    <span className="bg-white/20 px-3 py-1 rounded-full text-sm hover:bg-white/30 transition-colors">🌴 LA</span>
    <span className="bg-white/20 px-3 py-1 rounded-full text-sm hover:bg-white/30 transition-colors">🌆 Chicago</span>
    <span className="bg-white/20 px-3 py-1 rounded-full text-sm hover:bg-white/30 transition-colors">🤠 Houston</span>
    <span className="bg-white/20 px-3 py-1 rounded-full text-sm hover:bg-white/30 transition-colors">🏛️ DC</span>
    <span className="bg-white/20 px-3 py-1 rounded-full text-sm hover:bg-white/30 transition-colors">🏖️ Miami</span>
    <span className="bg-white/20 px-3 py-1 rounded-full text-sm hover:bg-white/30 transition-colors">🌉 SF</span>
    <span className="bg-white/20 px-3 py-1 rounded-full text-sm hover:bg-white/30 transition-colors">🎵 Nashville</span>
    <span className="bg-white/20 px-3 py-1 rounded-full text-sm hover:bg-white/30 transition-colors">⛰️ Denver</span>
    <span className="bg-white/20 px-3 py-1 rounded-full text-sm hover:bg-white/30 transition-colors">🌵 Phoenix</span>
  </div>
  <p className="text-center text-xs text-blue-200 mt-3">+ Many more cities nationwide</p>
  <button className="w-full mt-3 bg-white/20 hover:bg-white/30 text-white font-semibold py-2 rounded-xl transition text-sm">
    Check Your City
  </button>
</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Recent Submissions - Shows latest submissions */}
      {recentSubmissions.length > 0 && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Submissions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentSubmissions.map((contact, index) => (
                <div key={contact._id || index} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-sm font-bold">
                        {contact.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <span className="font-semibold text-gray-900">{contact.name}</span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>📞 {contact.phone}</div>
                    <div>✉️ {contact.email}</div>
                    <div>📍 {contact.address}</div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2 truncate">{contact.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(contact.submittedAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section 
        className="py-20 bg-gradient-to-br from-gray-50 to-white"
        onMouseEnter={handleFaqView}
        id="faq"
      >
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-3 bg-blue-50 text-blue-700 px-6 py-2 rounded-full mb-4">
              <FaQuestionCircle className="text-xl" />
              <span className="font-semibold text-sm">FAQ</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          </motion.div>

          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden"
              >
                <button
                  onClick={() => handleFaqToggle(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors group"
                >
                  <span className="text-gray-900 font-semibold text-lg group-hover:text-blue-600 transition-colors">
                    {faq.question}
                  </span>
                  <span className={`ml-4 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    openFaqIndex === index 
                      ? 'bg-blue-600 text-white rotate-180' 
                      : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600'
                  }`}>
                    <FaChevronDown className="text-sm" />
                  </span>
                </button>
                
                <AnimatePresence>
                  {openFaqIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 pt-2 bg-gradient-to-br from-blue-50/50 to-white border-t border-gray-100">
                        <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Contact;