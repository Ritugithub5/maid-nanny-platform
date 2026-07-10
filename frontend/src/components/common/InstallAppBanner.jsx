import React, { useState, useEffect } from 'react';
import { FaTimes, FaDownload } from 'react-icons/fa';

const InstallAppBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches;
    
    if (!isInstalled) {
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    });

    window.addEventListener('appinstalled', () => {
      setShowBanner(false);
      setDeferredPrompt(null);
    });
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      if (result.outcome === 'accepted') {
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    }
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-16 md:bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 p-4 animate-slide-up">
      <div className="flex items-center gap-3">
        <div className="text-3xl">📱</div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800 text-sm">Install App</h4>
          <p className="text-xs text-gray-500">Get the best experience</p>
        </div>
        <button
          onClick={handleInstall}
          className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary transition flex items-center gap-2"
        >
          <FaDownload /> Install
        </button>
        <button
          onClick={() => setShowBanner(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          <FaTimes />
        </button>
      </div>
    </div>
  );
};

export default InstallAppBanner;