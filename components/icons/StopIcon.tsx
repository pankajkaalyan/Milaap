import React from 'react';

const StopIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M6 6h12v12H6z" />
  </svg>
);

export default StopIcon;