import React from 'react';

interface ProgressBarProps {
  value: number; // 0 to 100
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value }) => {
  const clampedValue = Math.max(0, Math.min(100, value));

  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-base font-medium text-amber-300">{clampedValue}% Complete</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2.5">
        <div 
          className="bg-gradient-to-r from-amber-500 to-orange-500 h-2.5 rounded-full transition-all duration-500" 
          style={{ width: `${clampedValue}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;