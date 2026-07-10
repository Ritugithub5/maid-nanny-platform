import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';

// ============ AUTH COMPONENTS ============
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// ============ HOUSEHOLD COMPONENTS ============
import BrowseHelpers from './components/household/BrowseHelpers';
import HelperProfile from './components/household/HelperProfile';
import HouseholdDashboard from './components/household/HouseholdDashboard';
import HouseholdProfile from './components/household/HouseholdProfile';
import ReviewPage from './components/household/ReviewPage';
import PaymentsPage from './components/household/PaymentsPage';

// ============ HELPER COMPONENTS ============
import HelperDashboard from './components/helper/HelperDashboard';
import HelperProfileSetup from './components/helper/HelperProfileSetup';
import DocumentUploadPage from './components/helper/DocumentUploadPage';
import SalaryPage from './components/helper/SalaryPage';

// ============ ADMIN COMPONENTS ============
import AdminDashboard from './components/admin/AdminDashboard';
import ManageHelpers from './components/admin/ManageHelpers';
import AdminBookings from './components/admin/AdminBookings';
import AdminUsers from './components/admin/AdminUsers';
import AdminReviews from './components/admin/AdminReviews';
import AdminAnalytics from './components/admin/AdminAnalytics';
import AdminPayments from './components/admin/AdminPayments';

// ============ COMMON COMPONENTS ============
import TermsConditions from './components/common/TermsConditions';
import NotificationsPage from './components/common/NotificationsPage';
import SOSButton from './components/common/SOSButton';
import LanguageSwitcher from './components/common/LanguageSwitcher';
import OfflineIndicator from './components/common/OfflineIndicator';
import InstallAppBanner from './components/common/InstallAppBanner';

// ============ ATTENDANCE & LEAVE COMPONENTS ============
import AttendancePage from './components/helper/AttendancePage';
import LeavePage from './components/helper/LeavePage';
import AdminAttendance from './components/admin/AdminAttendance';
import AdminLeaves from './components/admin/AdminLeaves';

// ============ SOS COMPONENTS ============
import SOSContactsPage from './components/common/SOSContactsPage';

// ============ PAGES ============
import Home from './pages/Home';
import About from './pages/About';
import Safety from './pages/Safety';
import Careers from './pages/Careers';
import Terms from './pages/Terms';
import Contact from './pages/Contact';
import AdminContactInfo from './pages/AdminContactInfo';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Role-Based Dashboard Component
const DashboardRouter = () => {
  const { user } = useAuth();
  
  if (user?.role === 'helper') {
    return <HelperDashboard />;
  } else if (user?.role === 'admin') {
    return <AdminDashboard />;
  } else {
    return <HouseholdDashboard />;
  }
};

// Main App
function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          {/* Global Components */}
          <OfflineIndicator />
          <InstallAppBanner />
          
          <Routes>
            {/* ============ PUBLIC ROUTES ============ */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/browse" element={<BrowseHelpers />} />
            <Route path="/helper/:id" element={<HelperProfile />} />
            
            {/* ============ PUBLIC STATIC PAGES ============ */}
            <Route path="/about" element={<About />} />
            <Route path="/safety" element={<Safety />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* ============ DASHBOARD ============ */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardRouter /></ProtectedRoute>} />
            
            {/* ============ ADMIN ROUTES ============ */}
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/helpers" element={<ProtectedRoute><ManageHelpers /></ProtectedRoute>} />
            <Route path="/admin/bookings" element={<ProtectedRoute><AdminBookings /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />
            <Route path="/admin/reviews" element={<ProtectedRoute><AdminReviews /></ProtectedRoute>} />
            <Route path="/admin/analytics" element={<ProtectedRoute><AdminAnalytics /></ProtectedRoute>} />
            <Route path="/admin/payments" element={<ProtectedRoute><AdminPayments /></ProtectedRoute>} />
            
            {/* ============ ADMIN ATTENDANCE ROUTES ============ */}
            <Route path="/admin/attendance" element={<ProtectedRoute><AdminAttendance /></ProtectedRoute>} />
            <Route path="/admin/leaves" element={<ProtectedRoute><AdminLeaves /></ProtectedRoute>} />
            
            {/* ============ HELPER ROUTES ============ */}
            <Route path="/helper/profile" element={<ProtectedRoute><HelperProfileSetup /></ProtectedRoute>} />
            <Route path="/helper/documents" element={<ProtectedRoute><DocumentUploadPage /></ProtectedRoute>} />
            <Route path="/helper/salary" element={<ProtectedRoute><SalaryPage /></ProtectedRoute>} />
            
            {/* ============ HELPER ATTENDANCE ROUTES ============ */}
            <Route path="/helper/attendance" element={<ProtectedRoute><AttendancePage /></ProtectedRoute>} />
            <Route path="/helper/leaves" element={<ProtectedRoute><LeavePage /></ProtectedRoute>} />
            
            {/* ============ HOUSEHOLD ROUTES ============ */}
            <Route path="/household/profile" element={<ProtectedRoute><HouseholdProfile /></ProtectedRoute>} />
            <Route path="/household/payments" element={<ProtectedRoute><PaymentsPage /></ProtectedRoute>} />
            
            {/* ============ SOS ROUTES ============ */}
            <Route path="/sos/contacts" element={<ProtectedRoute><SOSContactsPage /></ProtectedRoute>} />
            
            {/* ============ REVIEW ROUTE ============ */}
            <Route path="/review/:id" element={<ProtectedRoute><ReviewPage /></ProtectedRoute>} />
            
            {/* ============ NOTIFICATION ROUTE ============ */}
            <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
            <Route path="/admin/contact-info" element={<AdminContactInfo />} />
          </Routes>
          
          {/* ===== GLOBAL SOS BUTTON ===== */}
          <SOSButton />
          <LanguageSwitcher />
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;