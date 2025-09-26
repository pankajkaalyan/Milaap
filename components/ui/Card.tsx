
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div
      className={`bg-black/20 backdrop-filter backdrop-blur-lg border border-white/10 rounded-xl shadow-2xl p-6 md:p-8 transition-all duration-300 ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;