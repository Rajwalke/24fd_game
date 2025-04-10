import React, { useEffect, useState } from 'react';

const PopupContainer = () => {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    // Auto-hide the popup after 1.5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className={`absolute top-20 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-150'}`}>
      <div className="relative flex items-center justify-center">
        {/* Starburst background */}
        <div className="absolute w-full h-full bg-yellow-400 rounded-full animate-ping opacity-50" />
        
        {/* Main container */}
        <div className="relative bg-gradient-to-br from-green-400 to-green-600 px-5 py-3 rounded-lg shadow-lg border-2 border-yellow-300 animate-bounce">
          {/* Text content */}
          <div className="flex items-center space-x-2">
            <span className="text-4xl font-bold text-yellow-300">+5</span>
            <div className="flex flex-col">
              <span className="text-white font-extrabold text-lg leading-tight">SECONDS</span>
              <span className="text-white font-bold text-sm">BONUS TIME!</span>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -top-2 -left-2 w-4 h-4 bg-yellow-300 rounded-full animate-pulse" />
          <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-yellow-300 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default PopupContainer;