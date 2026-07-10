import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FaHome, 
  FaSearch, 
  FaBell, 
  FaUser, 
  FaBars, 
  FaTimes,
  FaCalendarCheck,
  FaUsers,
  FaSignOutAlt
} from 'react-icons/fa';

const MobileNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { icon: <FaHome />, label: 'Home', path: '/' },
    { icon: <FaSearch />, label: 'Browse', path: '/browse' },
    { icon: <FaCalendarCheck />, label: 'Dashboard', path: '/dashboard' },
  ];

  // Add admin items
  if (user?.role === 'admin') {
    navItems.push({ icon: <FaUsers />, label: 'Admin', path: '/admin' });
  }

  const handleNav = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="flex justify-around items-center h-16">
          {navItems.slice(0, 4).map((item, index) => (
            <button
              key={index}
              onClick={() => handleNav(item.path)}
              className={`flex flex-col items-center justify-center px-3 py-1 rounded-lg transition ${
                location.pathname === item.path
                  ? 'text-primary'
                  : 'text-gray-500 hover:text-primary'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs mt-0.5">{item.label}</span>
            </button>
          ))}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex flex-col items-center justify-center px-3 py-1 rounded-lg text-gray-500 hover:text-primary transition"
          >
            <span className="text-xl">{isOpen ? <FaTimes /> : <FaBars />}</span>
            <span className="text-xs mt-0.5">Menu</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setIsOpen(false)}>
          <div className="absolute bottom-16 left-0 right-0 bg-white rounded-t-2xl shadow-xl p-4" onClick={e => e.stopPropagation()}>
            <div className="flex flex-col space-y-2">
              {/* User Info */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-2">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>

              {/* Menu Items */}
              {navItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleNav(item.path)}
                  className={`flex items-center gap-3 p-3 rounded-xl transition ${
                    location.pathname === item.path
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}

              {/* Divider */}
              <div className="border-t border-gray-200 my-2"></div>

              {/* Logout */}
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                  navigate('/login');
                }}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-red-500 transition"
              >
                <span className="text-xl"><FaSignOutAlt /></span>
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileNav;