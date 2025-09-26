import React, { useState, useEffect } from 'react';

interface AdPlayerProps {
  onAdComplete: () => void;
  duration?: number;
}

const AdPlayer: React.FC<AdPlayerProps> = ({ onAdComplete, duration = 5 }) => {
  const [countdown, setCountdown] = useState(duration);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      onAdComplete();
    }
  }, [countdown, onAdComplete]);

  return (
    <div className="absolute inset-0 bg-black flex flex-col items-center justify-center text-white z-10">
      <div className="p-4 bg-gray-800 rounded-lg text-center">
          <p className="text-lg font-bold">Advertisement</p>
          <p className="text-sm text-gray-400">Your content will play in {countdown} seconds...</p>
      </div>
      <button 
        onClick={onAdComplete} 
        className="absolute bottom-4 right-4 bg-white/20 text-white text-xs px-2 py-1 rounded hover:bg-white/30"
      >
        Skip Ad
      </button>
    </div>
  );
};

export default AdPlayer;
