import React from 'react';

const FullscreenExitIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 4H4v4m0-4l5 5m11 1V5h-4m4-1l-5 5M8 20H4v-4m0 4l5-5m11-1v4h-4m4-1l-5-5" />
    </svg>
);

export default FullscreenExitIcon;