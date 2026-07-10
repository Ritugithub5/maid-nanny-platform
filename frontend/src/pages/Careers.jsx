import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import {
  FaArrowRight,
  FaFlag,
  FaCheckCircle,
  FaMagic,
  FaUserShield,
  FaShieldVirus,
  FaEye,
  FaClipboardCheck,
  FaUsers,
  FaMoneyBillWave,
  FaLaptopHouse,
  FaHeartbeat,
  FaPiggyBank,
} from "react-icons/fa";

import { motion } from "framer-motion";
import n19 from "./img/n19.png";
import n20 from "./img/n20.png";
import n21 from "./img/n21.png"; // Added new image import

const Careers = () => {
  const navigate = useNavigate();

  // Benefits data
  const benefits = [
    {
      icon: <FaMoneyBillWave className="text-3xl text-green-500" />,
      title: "Competitive compensation",
      description:
        "We recognize and reward performance while ensuring pay equity across our team.",
    },
    {
      icon: <FaLaptopHouse className="text-3xl text-blue-500" />,
      title: "Flexible, hybrid work culture",
      description:
        "With a 3 day/week hybrid work model—our workplace is designed for collaboration and innovation. Whether you're brainstorming with your team in person, connecting remotely, or joining an office event—we provide the resources and flexibility you need to make an impact.",
    },
    {
      icon: <FaHeartbeat className="text-3xl text-red-500" />,
      title: "Comprehensive health coverage",
      description:
        "We offer market-competitive medical, dental, and vision plans—with options to pair them with pre-tax savings accounts for added financial flexibility.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ================= JOIN OUR MISSION SECTION ================= */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <span className="inline-block bg-cyan-100 text-cyan-900 px-5 py-2 rounded-full font-semibold text-sm mb-8">
                💚 Join Our Mission
              </span>
              <h2 className="text-4xl lg:text-5xl font-bold leading-tight text-gray-900">
                Better care <br /> begins with trust
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-600 max-w-xl">
                Every helper on our platform is selected with care to ensure
                families receive dependable, professional and compassionate
                support.
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600 max-w-xl">
                Whether you need a nanny, maid or caregiver, we help you find
                the right person with confidence.
              </p>
            </div>
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative z-20">
                <img
                  src={n19}
                  alt="Caregiver"
                  className="w-[470px] h-[670px] object-cover rounded-[42px] shadow-2xl"
                />
              </div>
              <div className="absolute left-8 bottom-[-30px] z-30">
                <img
                  src={n20}
                  alt="Team"
                  className="w-72 h-72 object-cover rounded-[32px] shadow-2xl border-8 border-white"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

    {/* ================= BENEFITS SECTION - OPTION 2 ================= */}
    <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                    <span className="inline-block bg-blue-100 text-blue-800 px-4 py-1.5 rounded-full font-semibold text-xs mb-4">
                    ✨ Benefits
                    </span>
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                    Benefits that support you
                    </h2>
                    <p className="text-gray-600 mb-6">
                    We believe that taking care of our employees is just as important as taking care of our members.
                    </p>
                        <div className="space-y-4">
                            {benefits.map((benefit, index) => (
                                <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                viewport={{ once: true }}
                                className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl"
                                >
                                <div className="text-2xl mt-1">{benefit.icon}</div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{benefit.title}</h3>
                                        <p className="text-sm text-gray-600">{benefit.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                </div>
            <div>
                <img src={n21} alt="Benefits" className="w-full rounded-xl shadow-lg" />
            </div>
            </div>
        </div>
    </section>
    <Footer />
    </div>
  );
};

export default Careers;