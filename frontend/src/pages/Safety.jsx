import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from '../components/common/Footer';
import {
  FaArrowRight,
  FaFlag,
  FaCheckCircle,
  FaUserShield ,
  FaShieldVirus,
  FaEye,
  FaClipboardCheck,
  FaUsers,
  
} from "react-icons/fa";

import { motion } from "framer-motion";
import n16 from "./img/n16.png";
import n17 from './img/n17.png';
import n18 from './img/n18.png';

const Safety = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ============================================
    SAFETY HERO - SPLIT LAYOUT WITH IMAGE
    ============================================ */}
      <section className="relative min-h-[60vh] flex items-center bg-gradient-to-r from-yellow-400 via-orange-600 to-stone-700 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzR2LTRoLTJ2NGgtNHYyaDR2NGgydi00aDR2LTJoLTR6bTAtMzBWMGgtMnY0aC00djJoNHY0aDJWNmg0VjRoLTR6TTYgMzR2LTRINHY0SDB2Mmg0djRoMnYtNGg0di0ySDZ6TTYgNFYwSDR2NEgwdjJoNHY0aDJWNmg0VjRINnoiLz48L2c+PC9nPjwvc3ZnPg==')]"></div>
        </div>

        {/* Glow Effects */}
        <div className="absolute top-10 right-1/4 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                Hire With Complete Confidence
              </h1>
              <p className="text-lg text-white/80 mt-4 max-w-lg leading-relaxed">
                From verified identities to secure communication and trusted
                reviews, we provide the tools and protections you need for a
                safer hiring experience.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative flex justify-center lg:justify-end"
            >
              <div className="relative">
                <img
                  src={n16}
                  alt="Safety"
                  className="w-full max-w-md rounded-2xl shadow-2xl border-4 border-black/20"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================
      LEADING THE WAY ON SAFETY
      ============================================ */}
      <section id="safety-features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
              🔒 Leading the Way on Safety
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Your Safety is Our Priority
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Background Checks */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <FaClipboardCheck className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Background Checks
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Individual caregivers start with a required background check,
                with additional checks available for purchase.
              </p>
            </motion.div>

            {/* Card 2: Always-on Monitoring */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <FaEye className="text-green-600 text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Always-on Monitoring
              </h3>
              <p className="text-gray-600 leading-relaxed">
                We use leading technology to continually monitor our
                platform—including messages, reviews, job posts and more.
              </p>
            </motion.div>

            {/* Card 3: Empowering You */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <FaUserShield className="text-purple-600 text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Empowering You to Stay Safe
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Tips and resources to help you make safer hiring choices—plus a
                safety hotline available 24/7 to respond to your concerns.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

       {/* ============================================
        EMPOWERING YOU SECTION - COMPLETE
        ============================================ */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                  <span className="inline-block bg-green-100 text-green-700 px-4 py-2 border-0 no-underline">
                    🛡️ Empowering You
                  </span>
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                    Every Family Deserves Trusted Care
                  </h2>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    We bring together verified professionals and families through a secure,
                    transparent platform that makes finding reliable home care simple, safe,
                    and stress-free.
                  </p>
                  <div className="grid grid-cols-2 gap-3 mt-6">
                    <div className="flex items-center gap-2">
                        <FaCheckCircle className="text-orange-500 text-sm" />
                        <span className="text-sm text-gray-700">Verified Professionals</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaCheckCircle className="text-orange-500 text-sm" />
                        <span className="text-sm text-gray-700">Secure Platform</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaCheckCircle className="text-orange-500 text-sm" />
                        <span className="text-sm text-gray-700">Stress-Free Hiring</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaCheckCircle className="text-orange-500 text-sm" />
                        <span className="text-sm text-gray-700">24/7 Support</span>
                    </div>
                  </div>
                  <button onClick={() => navigate('/register')} className="mt-6 bg-gradient-to-r from-slate-400 to-amber-600 text-white px-8 py-3 rounded-xl font-semibold inline-flex items-center gap-2" >
                  Find Your Trusted Caregiver <FaArrowRight />
                  </button>
              </div>
              <div className="relative flex justify-center lg:justify-end">
                  <div className="relative">
                    <img src={n17} alt="Trusted Care" className="w-full max-w-md rounded-2xl shadow-2xl border-2 border-white/50" />
                  </div>
              </div>
            </div>
          </div>
        </section>

      {/* ================= PIONEERING SAFETY SECTION ================= */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">

          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* LEFT IMAGE */}
            <div className="flex justify-center">
              <img
                src={n18}
                alt="Safety Technology"
                className="w-full max-w-[500px] h-[500px] object-cover rounded-[30px] shadow-lg"
              />
            </div>

            {/* RIGHT CONTENT */}
            <div>
              <span className="inline-block bg-lime-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
                💫 Empowering You
              </span>
              <h2 className="text-4xl lg:text-5xl font-bold leading-tight text-black"> Verified people.<br /> Protected families.</h2>

              <p className="mt-5 text-lg text-gray-600 leading-8 max-w-lg">
                We use leading tools and technology to continually monitor our
                platform for fraud and safety concerns.
              </p>

              <div className="mt-8 space-y-8">

                {/* Item 1 */}
                <div className="flex gap-4">

                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <FaFlag className="text-xl text-gray-800" />
                  </div>

                  <div>
                    <h4 className="text-xl font-bold text-gray-900">
                      Text & Photo Moderation
                    </h4>

                    <p className="mt-1 text-gray-600 leading-7">
                      AI-powered moderation flags inappropriate conversations,
                      images and suspicious content to help keep families safe.
                    </p>
                  </div>

                </div>

                {/* Item 2 */}
                <div className="flex gap-4">

                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <FaShieldVirus className="text-xl text-gray-800" />
                  </div>

                  <div>
                    <h4 className="text-xl font-bold text-gray-900">
                      Automated Fraud Detection
                    </h4>

                    <p className="mt-1 text-gray-600 leading-7">
                      Intelligent systems identify suspicious behaviour and block
                      scammers before they reach families.
                    </p>
                  </div>

                </div>

                {/* Item 3 */}
                <div className="flex gap-4">

                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <FaUsers className="text-xl text-gray-800" />
                  </div>

                  <div>
                    <h4 className="text-xl font-bold text-gray-900">
                      Dedicated Safety Team
                    </h4>

                    <p className="mt-1 text-gray-600 leading-7">
                      Our safety specialists monitor reports, review alerts and
                      respond quickly to keep the platform secure.
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Safety;
