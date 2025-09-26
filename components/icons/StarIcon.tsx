import React from 'react';

const StarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.321h5.365c.527 0 .745.713.362 1.05l-4.346 3.158a.563.563 0 00-.182.523l1.638 5.623a.563.563 0 01-.822.626l-4.803-3.473a.563.563 0 00-.575 0l-4.803 3.473a.563.563 0 01-.822-.626l1.638-5.623a.563.563 0 00-.182-.523l-4.346-3.158a.563.563 0 01.362-1.05h5.365a.563.563 0 00.475-.321l2.125-5.111z" />
    </svg>
);

export default StarIcon;
