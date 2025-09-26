
import React from 'react';

const AppLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 192 192" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <linearGradient id="logo-grad" x1="0" y2="192" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F59E0B" />
        <stop offset="1" stopColor="#EA580C" />
      </linearGradient>
    </defs>
    <rect width="192" height="192" rx="32" fill="url(#logo-grad)" />
    <path
      d="M96 57.4092C106.962 57.4092 115.992 66.4467 115.992 77.4092C115.992 88.3717 106.962 97.4092 96 97.4092C85.0375 97.4092 76.0077 88.3717 76.0077 77.4092C76.0077 66.4467 85.0375 57.4092 96 57.4092ZM110.265 102.192L114.612 106.539L126.364 118.291C129.014 120.941 129.014 125.251 126.364 127.901C123.714 130.551 119.403 130.551 116.753 127.901L112.376 123.524L102.641 113.789L102.293 113.441C104.877 110.318 106.845 110.318 110.265 102.192ZM81.7346 102.192L85.6243 112.432L75.6364 122.42C72.9864 125.07 68.6762 125.07 66.0262 122.42C63.3762 119.77 63.3762 115.46 66.0262 112.81L80.2654 102.192H81.7346Z"
      fill="white"
    />
  </svg>
);

export default AppLogo;