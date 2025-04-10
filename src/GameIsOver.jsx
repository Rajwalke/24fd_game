import React, { useEffect, useState } from 'react';
import germ from './Graphics/Bomb-Img.png'
const GameIsOver = ({ score,bomb }) => {
  const [animationClass, setAnimationClass] = useState('scale-0');

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => {
      setAnimationClass('scale-100');
    }, 100);
  }, []);
  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-80">
      <div 
        className={`bg-gradient-to-b from-white to-gray-100 p-10 rounded-xl text-center shadow-2xl transform transition-all duration-500 ease-out ${animationClass} max-w-lg w-full mx-4`}
        style={{
          boxShadow: '0 0 30px rgba(255, 0, 0, 0.3), 0 0 60px rgba(255, 255, 255, 0.2)'
        }}
      >
        <div className="relative">
          {/* Bomb icon */}
          <div className="absolute -top-24 left-1/2 transform -translate-x-1/2">
            <div className="text-6xl animate-bounce"><img src={germ}/></div>
          </div>
          
          {/* Title */}
          <h2 className="text-5xl font-bold text-red-600 mb-6 mt-4" 
              style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)' }}>
            BOOM!
          </h2>
          
          <h3 className="text-3xl font-bold text-gray-800 mb-6">Game Over</h3>
          
          {/* Score display */}
          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-4 rounded-lg mb-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-black bg-opacity-10 transform -skew-x-12"></div>
            <p className="text-xl font-medium mb-1">Final Score</p>
            <p className="text-4xl font-bold">{score}</p>
          </div>
          
          {/* Message */}
          <p className='text-xl font-bold my-2 '>Time's up</p>
          
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6 overflow-hidden">
            <div className="bg-red-600 h-full animate-progress-bar"></div>
          </div>
          
          {/* Footer */}
          <p className="text-lg text-gray-500">
            Be careful of those bombs next time!
          </p>
        </div>
      </div>
      
      {/* Add custom styles for animations */}
      <style jsx>{`
        @keyframes progress-bar {
          0% { width: 0% }
          100% { width: 100% }
        }
        .animate-progress-bar {
          animation: progress-bar 2s linear forwards;
        }
      `}</style>
    </div>
  );
};

export default GameIsOver;
