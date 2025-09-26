import React from 'react';

interface CircularProgressBarProps {
  value: number;
  maxValue: number;
  size?: number;
  strokeWidth?: number;
}

const CircularProgressBar: React.FC<CircularProgressBarProps> = ({ value, maxValue, size = 150, strokeWidth = 12 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = value / maxValue;
  const offset = circumference * (1 - progress);

  const getScoreColor = () => {
    const score = (value / maxValue) * 100;
    if (score > 80) return '#4ade80'; // green-400
    if (score > 60) return '#facc15'; // yellow-400
    if (score >= 50) return '#fb923c'; // orange-400
    return '#f87171'; // red-400
  };

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#4b5563" // gray-600
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getScoreColor()}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-3xl font-extrabold text-white">{value}</span>
      </div>
    </div>
  );
};

export default CircularProgressBar;