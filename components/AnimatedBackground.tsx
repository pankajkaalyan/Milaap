import React from 'react';

const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 bg-gradient-to-br from-red-900 via-orange-800 to-amber-700">
      <svg
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute top-0 left-0 w-full h-full opacity-50"
      >
        <defs>
          <radialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" style={{ stopColor: 'rgba(234, 88, 12, 0.2)', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: 'rgba(234, 88, 12, 0)', stopOpacity: 0 }} />
          </radialGradient>

          <radialGradient id="grad2" cx="20%" cy="80%" r="60%" fx="20%" fy="80%">
            <stop offset="0%" style={{ stopColor: 'rgba(245, 158, 11, 0.2)', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: 'rgba(245, 158, 11, 0)', stopOpacity: 0 }} />
          </radialGradient>

          <style>
            {`
              @keyframes float {
                0% { transform: translate(0, 0); }
                50% { transform: translate(20px, 30px); }
                100% { transform: translate(0, 0); }
              }
              @keyframes twinkle {
                0%, 100% { opacity: 0.5; transform: scale(0.8); }
                50% { opacity: 1; transform: scale(1.1); }
              }
              @keyframes slow-rotate {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </defs>

        {/* Background Gradients */}
        <rect width="100%" height="100%" fill="url(#grad1)" />
        <rect width="100%" height="100%" fill="url(#grad2)" />

        {/* Twinkling Stars */}
        {[...Array(50)].map((_, i) => {
          const x = Math.random() * 100;
          const y = Math.random() * 100;
          const duration = Math.random() * 5 + 3;
          const delay = Math.random() * 5;
          const size = Math.random() * 2 + 0.5;
          return (
            <circle
              key={`star-${i}`}
              cx={`${x}%`}
              cy={`${y}%`}
              r={size}
              fill="white"
              style={{ animation: `twinkle ${duration}s infinite ease-in-out ${delay}s` }}
            />
          );
        })}

        {/* Zodiac and Decorative Shapes */}
        <g fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1">
          {/* Aries */}
          <path
            d="M100 150 Q 150 100, 200 150 M150 100 V 50"
            style={{ animation: 'float 10s infinite ease-in-out' }}
            transform="translate(50, 100) scale(0.3)"
          />
          {/* Leo */}
          <path
            d="M300 300 A 50 50 0 1 1 350 250 L 350 400"
            style={{ animation: 'float 12s infinite ease-in-out reverse' }}
            transform="translate(600, 50) scale(0.4)"
          />
          {/* Libra */}
          <path
            d="M400 600 L600 600 M450 580 L550 580 A50 20 0 0 0 450 580"
            style={{ animation: 'float 15s infinite ease-in-out' }}
            transform="translate(800, 300) scale(0.3)"
          />

          <circle cx="85%" cy="15%" r="100" style={{ animation: 'float 18s infinite ease-in-out' }} />
          <ellipse
            cx="20%"
            cy="80%"
            rx="150"
            ry="80"
            style={{ animation: 'float 20s infinite ease-in-out reverse' }}
          />

          {/* Rotating Ring */}
          <g transform="translate(50%, 50%)" style={{ animation: 'slow-rotate 120s linear infinite' }}>
            <circle cx="0" cy="0" r="25%" strokeDasharray="5,10" />
            <ellipse cx="0" cy="0" rx="35%" ry="20%" strokeDasharray="2,5" transform="rotate(45)" />
          </g>
        </g>
      </svg>
    </div>
  );
};

export default AnimatedBackground;
