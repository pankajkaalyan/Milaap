import React from 'react';

const CurrencyRupeeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 8.25H9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 6.75h6.75a.75.75 0 010 1.5h-6.75a.75.75 0 010-1.5zM12 12.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5z" />
    </svg>
);

export default CurrencyRupeeIcon;
