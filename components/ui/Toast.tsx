
import React from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
}

const Toast: React.FC<ToastProps> = ({ message, type }) => {
  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  };

  return (
    <div
      className={`px-4 py-3 text-white rounded-lg shadow-lg ${colors[type]} animate-fade-in-up`}
    >
      {message}
    </div>
  );
};

export default Toast;
