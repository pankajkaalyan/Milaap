import React, { forwardRef } from 'react';
import { ButtonVariant } from '../../types';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ children, className, variant = ButtonVariant.PRIMARY, ...props }, ref) => {
  const baseClasses = 'w-full px-6 py-3 font-semibold rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100';

  const variantClasses = {
    [ButtonVariant.PRIMARY]: 'text-white bg-gradient-to-r from-amber-500 via-orange-600 to-red-600 focus:ring-orange-600',
    [ButtonVariant.SECONDARY]: 'text-white bg-gray-700 hover:bg-gray-600 focus:ring-gray-500',
    [ButtonVariant.TERTIARY]: 'text-white bg-white/10 hover:bg-white/20 focus:ring-gray-500',
  };

  return (
    <button
      ref={ref}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;