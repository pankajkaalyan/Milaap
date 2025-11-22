
import React, { useState } from 'react';
import EyeIcon from '../icons/EyeIcon';
import EyeSlashIcon from '../icons/EyeSlashIcon';
import FormLabel from './FormLabel';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hideinfo? : string
}

const Input: React.FC<InputProps> = ({ label, id, error, type, ...props }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPasswordField = type === 'password';
  const currentType = isPasswordField ? (isPasswordVisible ? 'text' : 'password') : type;

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(prevState => !prevState);
  };

  const errorId = id ? `${id}-error` : undefined;

  return (
    <div>
      <FormLabel id={id || ''} label={label} required={props.required}  hideinfo={props.hideinfo}/>
      <div className="relative">
        <input
          id={id}
          type={currentType}
          className={`w-full px-4 py-2 bg-white/10 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${
            isPasswordField ? 'pr-10' : ''
          } ${
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-600 hover:border-amber-400 focus:border-amber-500 focus:ring-amber-500'
          }`}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          {...props}
        />
        {isPasswordField && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white"
            aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
          >
            {isPasswordVisible ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
      {error && <p id={errorId} className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
};

export default Input;