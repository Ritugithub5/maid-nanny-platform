import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { 
  FaArrowRight, 
  FaStar,  
  FaUsers, 
  FaHeart,
  FaQuoteLeft,
  FaCheckCircle,
  FaThumbsUp,
  FaMapMarkerAlt
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import n1 from './img/n1.png';
import n3 from './img/n3.png';
import n4 from './img/n4.png';
import n5 from './img/n5.png';
import n6 from './img/n6.png';
import n7 from './img/n7.png';
import n8 from './img/n8.png';
import n11 from './img/n11.png';

// CAREGIVER DATA WITH YOUR IMAGES
const caregivers = [
  {
    id: 1,
    name: 'Sarah',
    title: 'Queen of the Playground',
    experience: '10 years experience',
    image: n3,
    testimonial: {
      text: '"Sarah is amazing! She is very interactive with the kids. They ask for her to come back over and over again."',
      author: 'Jennifer M.'
    },
    details: {
      specialties: ['Childcare', 'Play Activities', 'Meal Prep'],
      canHelp: ['Respite care', 'Companion care', 'Dementia care', 'Transportation', 'Light housecleaning', '+11 more'],
      rating: 4.9,
      reviews: 128,
      location: 'Mumbai',
      availability: 'Available Now',
      services: [
        { icon: '✈️', label: 'Travel' },
        { icon: '🍳', label: 'Meal preparation' },
        { icon: '🐕', label: 'Help with pets' },
        { icon: '🛒', label: 'Groceries/Errands' },
        { icon: '🧹', label: 'Light housecleaning' },
        { icon: '➕', label: '+11 more' }
      ]
    }
  },
  {
    id: 2,
    name: 'Alexus',
    title: 'Newborn Care Specialist',
    experience: '7 years experience',
    image: n4,
    details: {
      specialties: ['Newborn Care', 'Infant Massage', 'Feeding'],
      canHelp: ['Respite care', 'Companion care', 'Dementia care', 'Transportation', 'Light housecleaning', '+11 more'],
      rating: 4.8,
      reviews: 95,
      location: 'Delhi',
      availability: 'Available Now'
    }
  },
  {
    id: 3,
    name: 'Kelly',
    title: 'Dementia Care Helper',
    experience: '10 years experience',
    image: n5,
    details: {
      specialties: ['Dementia Care', 'Senior Care', 'Companionship'],
      canHelp: ['Respite care', 'Companion care', 'Dementia care', 'Transportation', 'Light housecleaning', '+11 more'],
      rating: 4.7,
      reviews: 203,
      location: 'Bangalore',
      availability: 'Available Now'
    }
  },
  {
    id: 4,
    name: 'Gail M.',
    title: 'Senior Caregiver',
    experience: '10 years experience',
    image: n6,
    details: {
      specialties: ['Senior Care', 'Medication Reminders', 'Companionship'],
      canHelp: ['Respite care', 'Companion care', 'Dementia care', 'Transportation', 'Light housecleaning', '+11 more'],
      rating: 4.9,
      reviews: 156,
      location: 'Chennai',
      availability: 'Available Now'
    }
  }
];

const HomeLuxury = () => {
  const navigate = useNavigate();
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const [hoveredId, setHoveredId] = useState(null);
  const [selectedCaregiver, setSelectedCaregiver] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const testimonials = [
    { name: 'Priya Sharma', text: 'Found the perfect nanny for my baby in just 2 days! The verification process gave us complete peace of mind.', rating: 5, image: '👩‍💼' },
    { name: 'Rahul Verma', text: 'Best platform for finding reliable domestic help. The helpers are professional and trustworthy.', rating: 5, image: '👨‍💼' },
    { name: 'Sneha Patel', text: 'I was skeptical at first, but now I recommend this to all my friends. Absolutely amazing service!', rating: 5, image: '👩‍🎓' },
  ];

  const stats = [
    { number: '500+', label: 'Verified Helpers', icon: <FaUsers /> },
    { number: '4.9⭐', label: 'Average Rating', icon: <FaStar /> },
    { number: '10K+', label: 'Happy Families', icon: <FaHeart /> },
    { number: '98%', label: 'Satisfaction Rate', icon: <FaThumbsUp /> },
  ];

  const features = [
    // { icon: <FaStar />, title: 'Top Rated', desc: '4.9 average rating from real families' },
    // { icon: <FaClock />, title: 'Quick Booking', desc: 'Book trusted helpers in minutes' },
    // { icon: <FaAward />, title: 'Award Winning', desc: 'Recognized as India\'s best platform' },
  ];

  const openDetailModal = (caregiver) => {
    setSelectedCaregiver(caregiver);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedCaregiver(null);
  };
  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ============ HERO SECTION ============ */}
      <div 
        className="relative min-h-[100vh] flex items-center bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: `url(${n1})`,
        }} >
        {/* Enhanced Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        
        {/* Animated Particles/Glow Effects */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-blue-500/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
        
        {/* Floating Decorative Elements */}
        <div className="absolute top-20 right-20 text-7xl opacity-20 animate-float">✦</div>
        <div className="absolute bottom-40 left-10 text-5xl opacity-10 animate-float delay-1000">✦</div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* LEFT CONTENT */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-white"
            >
              {/* Badge with Animation */}
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex items-center gap-3 mb-6">
                
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-4xl md:text-6xl font-bold leading-[1.1]"
              >
                Your Trusted
                <span className="block bg-gradient-to-r from-rose-300 to-amber-600 bg-clip-text text-transparent mt-2">
                  Domestic Help Partner
                </span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-xl text-white/80 mt-6 max-w-lg leading-relaxed" >
                Connecting families with verified, experienced caregivers for reliable home and childcare services.
              </motion.p>

              {/* Stats with Glass Cards */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="grid grid-cols-3 gap-4 mt-8"
              >
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 text-center border border-white/10 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1">
                    <div className="text-2xl text-amber-600 mb-1">{stat.icon}</div>
                    <p className="text-2xl font-bold text-white">{stat.number}</p>
                    <p className="text-xs text-white/60">{stat.label}</p>
                  </div>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="flex flex-wrap gap-4 mt-8"
              >
                <button 
                  onClick={() => navigate('/register')} 
                  className="group relative overflow-hidden bg-gradient-to-r from-rose-500 to-yellow-600 text-gray-900 px-10 py-4 rounded-2xl font-bold hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 flex items-center gap-2 shadow-2xl shadow-yellow-500/30 text-lg hover:scale-105"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Get Started <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent group-hover:translate-x-full transition-transform duration-700"></div>
                </button>
              </motion.div>
            </motion.div>

            {/* RIGHT CONTENT - Enhanced Cards */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="grid grid-cols-2 gap-4"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className={`bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 ${
                    index === 2 || index === 3 ? 'col-span-1' : ''
                  }`}
                >
                  <div className="text-amber-400 text-3xl mb-3">{feature.icon}</div>
                  <h4 className="font-bold text-white text-lg">{feature.title}</h4>
                  <p className="text-sm text-white/70 mt-1">{feature.desc}</p>
                  <div className="mt-3 flex items-center gap-1">
                    <FaCheckCircle className="text-amber-400 text-xs" />
                    <span className="text-xs text-white/50">Verified</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
      {/* ============ SERVICES SECTION - PREMIUM LUXURY ============ */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-400/5 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900">
              One Membership for Every Season of Life
            </h3>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              From childcare to senior care, one membership covers all your family's needs.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { icon: '👶', label: 'Child Care', color: 'from-gray-400 to-pink-500' },
              { icon: '👴', label: 'Senior Care', color: 'from-gray-400 to-blue-500' },
              { icon: '👨', label: 'Adult Care', color: 'from-gray-400 to-green-500' },
              { icon: '🧹', label: 'Housekeeping', color: 'from-gray-400 to-purple-500' },
              { icon: '🐾', label: 'Pet Care', color: 'from-gray-400 to-yellow-500' },
              { icon: '📚', label: 'Tutoring', color: 'from-gray-400 to-orange-500' },
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.05 }}
                className={`bg-gradient-to-br ${service.color} rounded-2xl p-6 text-center text-white shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer`}
              >
                <div className="text-5xl mb-3">{service.icon}</div>
                <h4 className="font-bold text-lg">{service.label}</h4>
                <p className="text-white/80 text-xs mt-1">Verified professionals</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <div className="mt-4">
              <button 
                onClick={() => navigate('/register')}
                className="bg-gradient-to-r from-gray-400 to-yellow-500 text-gray-900 px-8 py-3 rounded-xl font-bold hover:shadow-xl transition-all duration-300 inline-flex items-center gap-2"
              >
                Get Started <FaArrowRight />
              </button>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* ===== CAREGIVER CARDS WITH TESTIMONIALS ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              When it's not you, it's{' '}
              <span className="text-primary">Maid & Nanny</span>
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Find the perfect caregiver for your family's needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {caregivers.map((caregiver) => (
              <div
                key={caregiver.id}
                onMouseEnter={() => setHoveredId(caregiver.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => openDetailModal(caregiver)}
                className="relative group cursor-pointer"
              >
                <div className={`relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 ${
                  hoveredId === caregiver.id ? 'scale-105' : 'scale-100'
                }`}>
                  <div className="relative h-80 overflow-hidden">
                    <img 
                      src={caregiver.image} 
                      alt={caregiver.name}
                      className={`w-full h-full object-cover transition-all duration-700 ${
                        hoveredId === caregiver.id ? 'scale-110 blur-sm' : 'scale-100'
                      }`}
                    />
                    
                    <div className={`absolute inset-0 bg-gradient-to-t transition-opacity duration-500 ${
                      hoveredId === caregiver.id ? 'opacity-90' : 'opacity-60'
                    }`}></div>

                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-2xl font-bold">{caregiver.name}</h3>
                      <p className="text-sm text-white/90">{caregiver.title}</p>
                      <p className="text-xs text-white/70 mt-1">{caregiver.experience}</p>
                    </div>

                    <div className={`absolute inset-0 p-6 flex flex-col justify-between text-black transition-all duration-500 ${
                      hoveredId === caregiver.id ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
                            ⭐ {caregiver.details.rating} ({caregiver.details.reviews} reviews)
                          </span>
                          <span className="bg-green-400/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
                            {caregiver.details.availability}
                          </span>
                        </div>
                        <p className="text-sm text-black/90 mb-2 flex items-center gap-1">
                          <FaMapMarkerAlt className="text-xs" /> {caregiver.details.location}
                        </p>
                        
                        <div className="flex flex-wrap gap-1 mb-3">
                          {caregiver.details.specialties.map((spec, idx) => (
                            <span key={idx} className="bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded text-xs">
                              {spec}
                            </span>
                          ))}
                        </div>

                        <div className="mb-2">
                          <p className="text-xs font-semibold text-black/80 mb-1">Can help with:</p>
                          <div className="flex flex-wrap gap-1">
                            {caregiver.details.canHelp.slice(0, 3).map((help, idx) => (
                              <span key={idx} className="bg-white/10 backdrop-blur-sm px-2 py-0.5 rounded text-xs">
                                {help}
                              </span>
                            ))}
                            <span className="bg-white/10 backdrop-blur-sm px-2 py-0.5 rounded text-xs">
                              {caregiver.details.canHelp[caregiver.details.canHelp.length - 1]}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button onClick={(e) => { e.stopPropagation(); navigate('/login'); }} className="bg-white text-gray-900 px-6 py-2.5 rounded-xl font-semibold hover:bg-gray-100 transition flex items-center justify-center gap-2 w-full">
                        Get Started <FaArrowRight className="text-sm" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>    

      {/* ================= SAFETY SECTION ================= */}
      <section className="py-14 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">

          <div className="grid lg:grid-cols-2 gap-8 items-center">

            {/* LEFT */}
            <div className="relative h-[420px]">

              {/* Main Image */}
              <div className="absolute right-0 top-0 w-[320px] h-[300px] rounded-[24px] overflow-hidden shadow-xl">
                <img
                  src={n7}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Bottom Image */}
              <div className="absolute left-6 bottom-0 w-[220px] h-[260px] rounded-[24px] overflow-hidden shadow-lg border-[6px] border-white">
                <img
                  src={n8}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Leading Badge */}
              <div className="absolute left-0 top-24 bg-gradient-to-r from-gray-300 to-amber-500 rounded-xl px-5 py-2 shadow-lg">
                <h3 className="text-2xl font-bold text-teal-900">
                  Leading the way
                </h3>
              </div>

              {/* Protection Badge */}
              <div className="absolute left-36 top-[230px] bg-gradient-to-r from-gray-300 to-lime-500 rounded-xl px-3 py-1 shadow-lg">
                <h3 className="text-2xl font-bold text-teal-900">
                  with MaidProtect
                </h3>
              </div>

            </div>

            {/* RIGHT */}
            <div>

              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Safety is at the
                <br />
                heart of our
                <br />
                community
              </h2>

              <div className="space-y-6 mt-8">

                <div className="flex gap-4">
                  <FaCheckCircle className="text-green-700 text-xl mt-1 shrink-0" />

                  <p className="text-lg text-gray-700 leading-8">
                    Every maid and nanny completes a
                    <span className="font-semibold">
                      {" "}verified background check
                    </span>
                    {" "}before joining our platform.
                  </p>
                </div>

                <div className="flex gap-4">
                  <FaCheckCircle className="text-green-700 text-xl mt-1 shrink-0" />

                  <p className="text-lg text-gray-700 leading-8">
                    Secure messaging,
                    <span className="font-semibold">
                      {" "}24/7 customer support
                    </span>
                    {" "}and monitored service requests.
                  </p>
                </div>

                <div className="flex gap-4">
                  <FaCheckCircle className="text-green-700 text-xl mt-1 shrink-0" />

                  <p className="text-lg text-gray-700 leading-8">
                    Helpful hiring guides and safety tips so families can hire with confidence.
                  </p>
                </div>

              </div>

              <button onClick={() => navigate('/about')} className="mt-8 bg-gradient-to-r from-gray-400 to-green-700 hover:bg-gradient-to-r hover:from-gray-500 hover:to-green-700 transition text-white px-8 py-3 rounded-full font-semibold text-lg flex items-center gap-3">
                Learn More
                <FaArrowRight />
              </button>

            </div>

          </div>

        </div>
      </section>

      {/* ============ TESTIMONIALS SECTION ============ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-3">
              💬 Testimonials
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              What Our Families Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="bg-gradient-to-r from-gray-200 to-gray-600 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>

                {/* Testimonial Text */}
                <div className="relative">
                  <FaQuoteLeft className="text-primary/10 text-4xl absolute -top-2 -left-2" />
                  <p className="text-gray-700 leading-relaxed pl-6">"{testimonial.text}"</p>
                </div>

                {/* User Info */}
                <div className="flex items-center gap-4 mt-6 pt-6 border-t border-gray-100">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-gray-300 to-purple-700 flex items-center justify-center text-2xl text-white">
                    {testimonial.image}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">⭐ Verified Family</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Trust Badges */}
          <div className="text-center mt-12">
            <div className="inline-flex flex-wrap items-center justify-center gap-6 bg-white rounded-2xl px-6 py-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2">
                <FaStar className="text-yellow-400" />
                <span className="font-bold text-gray-900">4.9</span>
                <span className="text-gray-500 text-sm">(2,500+ reviews)</span>
              </div>
              <div className="w-px h-6 bg-gray-200 hidden sm:block"></div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🏆</span>
                <span className="text-gray-700 text-sm">Trusted Since 2020</span>
              </div>
              <div className="w-px h-6 bg-gray-200 hidden sm:block"></div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">👨‍👩‍👧‍👦</span>
                <span className="text-gray-700 text-sm">10,000+ Families</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CTA SECTION - WITH TAILWIND GRADIENT ============ */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center rounded-3xl p-8 lg:p-12 relative overflow-hidden bg-gradient-to-br from-orange-300 to-slate-600"
          >
            {/* Pattern Overlay */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23333333' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px'
            }}></div>

            {/* Left Content */}
            <div className="relative z-10">
              <span className="inline-block bg-white/50 backdrop-blur-sm text-orange-500 px-4 py-1.5 rounded-full text-sm font-semibold mb-4 border border-white/30">
                🚀 Get Started Today
              </span>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Ready to Find Your Perfect Helper?
              </h2>
              <p className="text-gray-700 mb-6">
                Join 10,000+ happy families who found their trusted domestic help through our platform.
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => navigate('/register')} 
                  className="bg-gradient-to-r from-orange-200 to-orange-400 text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-2"
                >
                  Get Started Now <FaArrowRight />
                </button>
              </div>
            </div>

            {/* Right Side - Image */}
            <div className="relative z-10">
              <img 
                src={n11} 
                alt="Happy Family"
                className="w-full h-[300px] lg:h-[350px] object-cover rounded-2xl shadow-xl"
              />
              <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-2xl p-4 hidden sm:block">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <FaCheckCircle className="text-green-600 text-xl" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">10,000+</p>
                    <p className="text-xs text-gray-500">Happy Families</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default HomeLuxury;