import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { FaArrowRight, FaShieldAlt, FaLock, FaUserSecret, FaCookie, FaGavel } from "react-icons/fa";
import { motion } from "framer-motion";

const Terms = () => {
  const navigate = useNavigate();

  // Terms sections data
  const termsSections = [
    {
      title: "Acceptance of Terms",
      content:
        "By using CareProtect's platform, you agree to comply with and be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our services.",
    },
    {
      title: "User Accounts",
      content:
        "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.",
    },
    {
      title: "Services Provided",
      content:
        "CareProtect connects families with professional caregivers including nannies, maids, and caregivers. We provide a platform for communication and booking but do not directly employ caregivers.",
    },
    {
      title: "User Responsibilities",
      content:
        "Users agree to provide accurate information, treat others with respect, and use the platform in accordance with applicable laws. Any misuse of the platform may result in account termination.",
    },
    {
      title: "Payment and Fees",
      content:
        "Services may require payment of fees. All fees are clearly displayed before confirmation. Users are responsible for timely payment of all fees associated with their account.",
    },
    {
      title: "Cancellation and Refunds",
      content:
        "Cancellation policies vary by service. Refunds are processed according to our refund policy, which is available upon request or within your account settings.",
    },
    {
      title: "Limitation of Liability",
      content:
        "CareProtect is not liable for any indirect, incidental, or consequential damages arising from the use of our platform. Our total liability is limited to the fees paid by you in the last 12 months.",
    },
    {
      title: "Governing Law",
      content:
        "These terms are governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.",
    },
  ];

  // Privacy sections data
  const privacySections = [
    {
      icon: <FaUserSecret className="text-2xl" />,
      title: "Information We Collect",
      content:
        "We collect information you provide directly, such as your name, email, phone number, payment details, and any information you share in your profile or communications.",
    },
    {
      icon: <FaLock className="text-2xl" />,
      title: "How We Use Your Information",
      content:
        "We use your information to provide and improve our services, process transactions, communicate with you, personalize your experience, and ensure platform safety and security.",
    },
    {
      icon: <FaCookie className="text-2xl" />,
      title: "Cookies and Tracking",
      content:
        "We use cookies and similar technologies to enhance your experience, analyze usage patterns, and deliver relevant content. You can manage cookie preferences in your browser settings.",
    },
    {
      icon: <FaShieldAlt className="text-2xl" />,
      title: "Data Security",
      content:
        "We implement industry-standard security measures to protect your data from unauthorized access, alteration, or disclosure. We regularly update our security practices to ensure your information remains safe.",
    },
    {
      title: "Information Sharing",
      content:
        "We do not sell your personal information. We may share your data with service providers who assist us, with your consent, or as required by law.",
    },
    {
      title: "Your Rights",
      content:
        "You have the right to access, correct, or delete your personal information. You can also opt-out of marketing communications at any time.",
    },
    {
      title: "Data Retention",
      content:
        "We retain your personal information as long as your account is active or as needed to provide services. We may also retain data for legal compliance and security purposes.",
    },
    {
      title: "Updates to This Policy",
      content:
        "We may update this privacy policy from time to time. We will notify you of significant changes via email or through our platform.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ================= HERO SECTION ================= */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-block bg-blue-100 text-blue-800 px-5 py-2 rounded-full font-semibold text-sm mb-6">
              ⚖️ Legal
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Terms & Privacy
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Your trust is important to us. Learn about our terms of service
              and how we protect your privacy.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <button
                onClick={() => document.getElementById("terms").scrollIntoView({ behavior: "smooth" })}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-slate-400 to-blue-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl">
                <FaGavel /> Terms of Service
              </button>
              <button
                onClick={() => document.getElementById("privacy").scrollIntoView({ behavior: "smooth" })}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-slate-400 to-blue-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl">
                <FaShieldAlt /> Privacy Policy
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= TERMS OF SERVICE SECTION ================= */}
      <section id="terms" className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-4">
              <FaGavel className="text-3xl text-blue-600" />
              <h2 className="text-3xl font-bold text-gray-900">Terms of Service</h2>
            </div>
            <p className="text-gray-600">
              Last updated: January 2026. These terms govern your use of CareProtect's platform and services.
            </p>
          </motion.div>

          <div className="space-y-6">
            {termsSections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {index + 1}. {section.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{section.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PRIVACY POLICY SECTION ================= */}
      <section id="privacy" className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-4">
              <FaShieldAlt className="text-3xl text-green-600" />
              <h2 className="text-3xl font-bold text-gray-900">Privacy Policy</h2>
            </div>
            <p className="text-gray-600">
              Last updated: January 2026. We are committed to protecting your privacy and personal information.
            </p>
          </motion.div>

          <div className="space-y-6">
            {privacySections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  {section.icon && (
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                      {section.icon}
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {section.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{section.content}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mt-10 p-6 bg-green-50 rounded-xl border border-green-200"
          >
            <div className="flex items-start gap-4">
              <FaLock className="text-2xl text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Your Privacy Matters</h4>
                <p className="text-sm text-gray-700">
                  We take your privacy seriously. If you have any questions about our privacy practices,
                  please contact our privacy team at{" "}
                  <a href="# " className="text-blue-600 hover:underline font-medium">
                    maid@nanny.com
                  </a>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= CTA SECTION ================= */}
      <section className="py-16 bg-gradient-to-r from-slate-500 to-blue-900">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Have Questions About Our Policies?
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            We're here to help! Reach out to our support team for any clarifications.
          </p>
          <button
            onClick={() => navigate("/contact")}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-slate-400 to-blue-700 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Contact Support
            <FaArrowRight className="text-sm" />
          </button>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Terms;