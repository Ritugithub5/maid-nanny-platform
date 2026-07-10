import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaBars, FaTimes, FaCaretDown } from 'react-icons/fa';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const closeTimerRef = useRef(null);

  const aboutLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Safety & Resources', path: '/safety' },
  ];

  const careersLinks = [
    { name: 'Careers', path: '/careers' },
  ];

  const termsLinks =[
  {name: 'Terms and privacy', path: '/terms' }
  ]

  const contactLinks =[
  {name: 'Contact Us', path: '/contact' }
  ]

  // Clear any existing timer
  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  // Handle mouse enter - open dropdown and clear any pending close
  const handleMouseEnter = () => {
    clearCloseTimer();
    setIsAboutOpen(true);
  };

  // Handle mouse leave - set a 3-second timer before closing
  const handleMouseLeave = () => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setIsAboutOpen(false);
    }, 3000); // 3 second hold
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🏠</span>
            <span className="text-xl font-bold text-primary hidden sm:block">
              Maid & Nanny
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            

            {/* About Dropdown - Desktop with 3-second hold */}
            <div 
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className="flex items-center gap-1 text-gray-600 hover:text-primary transition font-medium"
              >
                About <FaCaretDown className="text-xs" />
              </button>
              {isAboutOpen && (
                <div 
                  className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  {aboutLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary transition"
                      onClick={() => {
                        setIsAboutOpen(false);
                        clearCloseTimer();
                      }}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            
            {careersLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-gray-600 hover:text-primary transition font-medium"
              >
                {link.name}
              </Link>
            ))}

            {termsLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-gray-600 hover:text-primary transition font-medium"
              >
                {link.name}
              </Link>
            ))}

            {contactLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-gray-600 hover:text-primary transition font-medium"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Side - Auth */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <NotificationBell />
                <Link
                  to="/dashboard"
                  className="text-gray-600 hover:text-primary transition font-medium text-sm"
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-primary transition font-medium text-sm"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition text-sm font-medium"
                >
                  Join Now
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-gray-600 hover:text-primary transition"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 pt-2 border-t border-gray-100">
            <div className="flex flex-col gap-3">
              {/* Mobile About Dropdown */}
              <div>
                <button
                  onClick={() => setIsAboutOpen(!isAboutOpen)}
                  className="flex items-center gap-1 text-gray-600 hover:text-primary transition font-medium px-2 py-1 w-full text-left"
                >
                  About <FaCaretDown className="text-xs" />
                </button>
                {isAboutOpen && (
                  <div className="ml-4 mt-1 space-y-1 border-l-2 border-primary/20 pl-3">
                    {aboutLinks.map((link) => (
                      <Link
                        key={link.name}
                        to={link.path}
                        className="block text-sm text-gray-600 hover:text-primary transition py-1"
                        onClick={() => {
                          setIsOpen(false);
                          setIsAboutOpen(false);
                        }}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              
              {careersLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-gray-600 hover:text-primary transition font-medium px-2 py-1"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

              {termsLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-gray-600 hover:text-primary transition font-medium px-2 py-1"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

              {contactLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-gray-600 hover:text-primary transition font-medium px-2 py-1"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

              {!user && (
                <>
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-primary transition font-medium px-2 py-1"
                    onClick={() => setIsOpen(false)}
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition text-center font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Join Now
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;