import React, { useState, useEffect } from 'react';
import { FaWifi } from 'react-icons/fa';

const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-red-500 text-white text-center py-2 z-50">
      <div className="flex items-center justify-center gap-2">
        <FaWifi className="text-white" />
        <span className="text-sm font-medium">You are offline. Some features may not be available.</span>
      </div>
    </div>
  );
};

export default OfflineIndicator;