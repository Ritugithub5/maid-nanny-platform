import React from 'react';
import { useNavigate } from 'react-router-dom';

const TermsConditions = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-6">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              📋 Terms & Conditions
            </h1>
            <p className="text-blue-100 mt-1">
              Please read these terms carefully before using our platform
            </p>
          </div>

          <div className="p-8 space-y-6">
            {/* Section 1 */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Acceptance of Terms</h2>
              <p className="text-gray-600 leading-relaxed">
                By registering and using the Maid & Nanny Service Management Platform, you agree to comply with and be bound by these Terms and Conditions. If you do not agree, please do not use our platform.
              </p>
            </div>

            {/* Section 2 */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">2. User Accounts</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>You must provide accurate and complete information during registration</li>
                <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                <li>You are solely responsible for all activities that occur under your account</li>
                <li>You must notify us immediately of any unauthorized use of your account</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">3. Services Provided</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>The platform connects households with verified domestic helpers</li>
                <li>Services include maids, babysitters, and nannies</li>
                <li>Service plans available: Hourly, Monthly, and Yearly</li>
                <li>All helpers undergo verification before being listed</li>
              </ul>
            </div>

            {/* Section 4 */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">4. User Responsibilities</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Households must provide accurate service requirements</li>
                <li>Helpers must complete verification honestly</li>
                <li>Both parties must maintain professional and respectful communication</li>
                <li>Users must report any issues or disputes promptly</li>
              </ul>
            </div>

            {/* Section 5 */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Payments & Pricing</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Service prices are displayed clearly on each helper's profile</li>
                <li>Payments are processed securely through the platform</li>
                <li>Refunds are subject to our refund policy</li>
                <li>All prices are in Indian Rupees (₹)</li>
              </ul>
            </div>

            {/* Section 6 */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">6. Cancellation Policy</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Bookings can be cancelled up to 24 hours before service start time</li>
                <li>Late cancellations may incur a cancellation fee</li>
                <li>Repeated cancellations may affect user account standing</li>
                <li>Helpers who cancel bookings may face account restrictions</li>
              </ul>
            </div>

            {/* Section 7 */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">7. Privacy & Data Protection</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Your personal data is collected and processed in accordance with our Privacy Policy</li>
                <li>We do not share your personal information with third parties without consent</li>
                <li>You have the right to access, modify, or delete your data</li>
                <li>We implement security measures to protect your data</li>
              </ul>
            </div>

            {/* Section 8 */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">8. Prohibited Activities</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Any form of fraud or misrepresentation</li>
                <li>Harassment, abuse, or discrimination of any kind</li>
                <li>Sharing of false or misleading information</li>
                <li>Attempting to bypass or manipulate the platform's security measures</li>
                <li>Using the platform for illegal activities</li>
              </ul>
            </div>

            {/* Section 9 */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">9. Dispute Resolution</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Disputes should first be attempted to be resolved directly between parties</li>
                <li>If unresolved, disputes can be escalated to the platform's support team</li>
                <li>Our admin team will mediate disputes impartially</li>
                <li>Final decisions rest with the platform administration</li>
              </ul>
            </div>

            {/* Section 10 */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">10. Platform Liability</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>The platform acts as an intermediary connecting households and helpers</li>
                <li>We are not responsible for the quality of services provided by helpers</li>
                <li>We do not guarantee the accuracy of user-provided information</li>
                <li>We are not liable for any damages arising from service disputes</li>
              </ul>
            </div>

            {/* Section 11 */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">11. Account Termination</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>We reserve the right to suspend or terminate accounts that violate these terms</li>
                <li>Users may delete their accounts at any time</li>
                <li>Termination may result in loss of access to platform features</li>
                <li>We will notify users of any account actions taken</li>
              </ul>
            </div>

            {/* Section 12 */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">12. Changes to Terms</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>We may update these terms from time to time</li>
                <li>Users will be notified of significant changes</li>
                <li>Continued use of the platform constitutes acceptance of new terms</li>
                <li>It is your responsibility to review these terms periodically</li>
              </ul>
            </div>

            {/* Section 13 */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">13. Contact Information</h2>
              <p className="text-gray-600 leading-relaxed">
                For any questions, concerns, or disputes regarding these Terms & Conditions, 
                please contact our support team at:
              </p>
              <div className="mt-2 bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">📧 support@maidnanny.com</p>
                <p className="text-gray-700">📞 +91 98765 43210</p>
                <p className="text-gray-700">🕐 Mon-Sat: 9:00 AM - 6:00 PM</p>
              </div>
            </div>

            {/* Back Button */}
            <div className="pt-4 border-t">
              <button
                onClick={() => navigate(-1)}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-secondary transition"
              >
                ← Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;