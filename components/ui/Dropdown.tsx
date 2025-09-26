import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import ChevronDownIcon from '../icons/ChevronDownIcon';
import { DropdownSize } from '../../types';

export interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  label?: string;
  id?: string;
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  className?: string;
  size?: DropdownSize;
  ariaLabel?: string;
  placeholder?: string;
  disabled?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({ 
  label, 
  id, 
  options, 
  value, 
  onChange, 
  error, 
  className, 
  size = DropdownSize.NORMAL,
  ariaLabel,
  placeholder,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number; width: number } | null>(null);

  const selectedOption = options.find(opt => opt.value === value);

  const calculatePosition = useCallback(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      // Estimate menu height (max-h-60 is 240px, each option is about 36px, plus padding)
      const menuHeight = Math.min(240, options.length * 36 + 8); 

      if (spaceBelow < menuHeight && spaceAbove > spaceBelow) {
        // Open upwards
        setPosition({
          top: rect.top + window.scrollY - menuHeight - 4, // 4px margin
          left: rect.left + window.scrollX,
          width: rect.width,
        });
      } else {
        // Open downwards
        setPosition({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
        });
      }
    }
  }, [options.length]);

  const handleToggle = () => {
    if (!disabled) {
      if (!isOpen) {
        calculatePosition();
      }
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };
  
  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isOpen &&
        wrapperRef.current && !wrapperRef.current.contains(event.target as Node) &&
        menuRef.current && !menuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isOpen) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      window.addEventListener('scroll', handleScroll, true);
    }
    
    return () => {
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen]);

  const errorId = id ? `${id}-error` : undefined;
  const sizeClasses = size === DropdownSize.SMALL ? 'py-1 px-3 text-sm' : 'py-2 px-4';
  
  const DropdownMenu = (
    <div
      ref={menuRef}
      style={position ? {
        position: 'absolute',
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: `${position.width}px`,
      } : {}}
      className="z-[130] mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg animate-fade-in-up-fast max-h-60 overflow-y-auto"
      role="listbox"
    >
      <ul className="py-1">
        {options.map(option => (
          <li
            key={option.value}
            onClick={() => handleSelect(option.value)}
            className={`px-4 py-2 text-sm cursor-pointer ${
              value === option.value
                ? 'bg-amber-600 text-white'
                : 'text-gray-200 hover:bg-gray-700'
            }`}
            role="option"
            aria-selected={value === option.value}
          >
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div ref={wrapperRef} className={className}>
      {label && <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">
        {label}
      </label>}
      <div>
        <button
          ref={buttonRef}
          id={id}
          type="button"
          onClick={handleToggle}
          disabled={disabled}
          className={`w-full flex items-center justify-between text-left bg-white/10 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${sizeClasses} ${
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-600 hover:border-amber-400 focus:ring-amber-500'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          aria-label={ariaLabel || label}
        >
          <span className={selectedOption ? 'text-white' : 'text-gray-400'}>{selectedOption?.label || placeholder || 'Select...'}</span>
          <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
        </button>

        {isOpen && position && createPortal(DropdownMenu, document.body)}
      </div>
       {error && <p id={errorId} className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
};

export default Dropdown;
