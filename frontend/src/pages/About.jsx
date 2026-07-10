import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from "../components/common/Footer";
import { 
  FaArrowRight, 
  FaStar, 
  FaCrown, 
  FaShieldAlt, 
  FaUsers, 
  FaHeart,
  FaQuoteLeft,
  FaCheckCircle,
  FaRocket,
  FaClock,
  FaThumbsUp,
  FaGlobe,
  FaHandHoldingHeart,
  FaTree,
  FaChartLine,
  FaUserFriends,
  FaAward,
  FaBuilding,
  FaCalendarAlt
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import n11 from './img/n11.png';
import n10 from './img/n10.png';
import n12 from './img/n12.png';
import n13 from './img/n13.png';
import n14 from './img/n14.png';
import n15 from './img/n15.png';
import n9 from './img/n9.png';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ============================================
      HERO & TRUST SECTION
      ============================================ */}
      <section className="py-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-600 px-4 py-2 rounded-full text-sm font-semibold mb-5">
                🛡 Trusted Platform
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-10">
                A world of trusted care
                <br />
                starts here
              </h2>

              <div className="flex gap-5 mb-8">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <FaCheckCircle className="text-green-600 text-lg" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Verified Helpers
                  </h3>
                  <p className="text-gray-600 leading-8">
                    Every maid and nanny completes identity verification and
                    background screening before joining our platform.
                  </p>
                </div>
              </div>

              <div className="flex gap-5 mb-8">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <FaShieldAlt className="text-blue-600 text-lg" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Safe Hiring Experience
                  </h3>
                  <p className="text-gray-600 leading-8">
                    Browse verified profiles, communicate securely and hire trusted
                    caregivers with complete confidence.
                  </p>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <FaClock className="text-orange-500 text-lg" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Support Every Step
                  </h3>
                  <p className="text-gray-600 leading-8">
                    From childcare to housekeeping and senior care, we're here to
                    help you find the perfect helper for your family.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative h-[480px] flex justify-center">
              <div className="absolute top-0 left-28 z-30">
                <img
                  src={n14}
                  alt=""
                  className="w-40 h-28 rounded-[22px] object-cover shadow-xl"
                />
              </div>
              <div className="absolute top-10 left-44 z-10">
                <img
                  src={n10}
                  alt=""
                  className="w-[310px] h-[400px] rounded-[40px] object-cover shadow-2xl"
                />
              </div>
              <div className="absolute bottom-10 left-4 z-20">
                <img
                  src={n12}
                  alt=""
                  className="w-44 h-40 rounded-[22px] object-cover shadow-xl border-4 border-white"
                />
              </div>
              <div className="absolute bottom-0 right-8 z-30">
                <img
                  src={n13}
                  alt=""
                  className="w-40 h-48 rounded-[22px] object-cover shadow-xl border-4 border-white"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
      IMPACT SECTION - WITH BACKGROUND IMAGE (n15.png)
      ============================================ */}
      <section className="relative py-20 overflow-hidden bg-cover bg-center bg-no-repeat">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${n15})` }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Meaningful Impact Since the Beginning
            </h2>
            <p className="text-lg text-white/80 max-w-3xl mx-auto">
              Maid & Nanny has been trusted by millions of families and caregivers 
              since our founding—and our community is only growing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                45 Million+
              </div>
              <p className="text-white/80 text-sm">
                families and caregivers have turned to Maid & Nanny
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                700+
              </div>
              <p className="text-white/80 text-sm">
                employers partner with us to provide benefits to their workforce, including many of the Fortune 500
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                40+
              </div>
              <p className="text-white/80 text-sm">
                years of combined experience across our care brands
              </p>
            </div>
          </div>

          <p className="text-center text-white/60 text-sm mt-8">
            🌟 Trusted by millions. Growing every day.
          </p>
        </div>
      </section>

      {/* ================= WHY FAMILIES CHOOSE US ================= */}
    <section className="py-16 bg-gradient-to-b from-white to-slate-50">
    <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
        <span className="inline-block bg-primary/10 text-primary text-sm font-semibold px-4 py-2 rounded-full">
            ❤️ Trusted Platform
        </span>
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mt-4">
            Why Families Choose
            <span className="text-primary"> Maid & Nanny</span>
        </h2>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Find trusted domestic helpers with verified profiles, secure hiring,
            and ongoing support for every family.
        </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-center">
        <div className="grid gap-5">
            <div className="bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition duration-300 border border-gray-100">
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-2xl">
                ✓
                </div>
                <div>
                <h3 className="text-xl font-bold text-slate-900">
                    Verified Helpers
                </h3>
                <p className="text-gray-600 mt-2 text-sm leading-7">
                    Every maid and nanny completes identity verification and
                    background screening before joining our platform.
                </p>
                </div>
            </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition duration-300 border border-gray-100">
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-2xl">
                🛡️
                </div>
                <div>
                <h3 className="text-xl font-bold text-slate-900">
                    Safe Hiring
                </h3>
                <p className="text-gray-600 mt-2 text-sm leading-7">
                    Browse trusted caregiver profiles, communicate securely and hire
                    with complete confidence.
                </p>
                </div>
            </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition duration-300 border border-gray-100">
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-2xl">
                ❤️
                </div>
                <div>
                <h3 className="text-xl font-bold text-slate-900">
                    Dedicated Support
                </h3>
                <p className="text-gray-600 mt-2 text-sm leading-7">
                    From childcare and housekeeping to senior care, we're here to
                    help you find the perfect helper.
                </p>
                </div>
            </div>
            </div>

        </div>

        {/* RIGHT IMAGE */}
        <div className="relative flex justify-center">

            {/* Background Decoration */}
            <div className="absolute w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
            <img src={n9} alt="Trusted Helpers" className="relative rounded-3xl shadow-2xl object-cover w-full max-w-md" />
            <div className="absolute -top-5 -left-5 bg-white rounded-2xl shadow-lg px-5 py-4">
            <h3 className="text-2xl font-bold text-primary">
                500+
            </h3>
            <p className="text-xs text-gray-500">
                Verified Helpers
            </p>
            </div>
            <div className="absolute bottom-5 -right-5 bg-white rounded-2xl shadow-lg px-5 py-4">
            <h3 className="text-2xl font-bold text-green-600">
                4.9★
            </h3>
            <p className="text-xs text-gray-500">
                Family Rating
            </p>
            </div>
        </div>
        </div>
    </div>
    </section>
    <Footer />
    </div>
  );
};

export default About;