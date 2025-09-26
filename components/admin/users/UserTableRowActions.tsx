import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { User } from '../../../types';
import DotsVerticalIcon from '../../icons/DotsVerticalIcon';
import { useAppContext } from '../../../hooks/useAppContext';

interface UserTableRowActionsProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

const UserTableRowActions: React.FC<UserTableRowActionsProps> = ({ user, onEdit, onDelete }) => {
  const { t } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);

  const calculatePosition = useCallback(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const menuHeight = 80; // Approximate height for 2 items + padding
      const menuWidth = 160; // w-40

      let top = rect.bottom + window.scrollY + 4; // 4px margin below
      if (window.innerHeight - rect.bottom < menuHeight && rect.top > menuHeight) {
        // Not enough space below, open upwards
        top = rect.top + window.scrollY - menuHeight - 4; // 4px margin above
      }
      
      let left = rect.right + window.scrollX - menuWidth;

      setPosition({ top, left });
    }
  }, []);
  
  const toggleOpen = () => {
    if (!isOpen) {
      calculatePosition();
    }
    setIsOpen(prev => !prev);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isOpen &&
        buttonRef.current && !buttonRef.current.contains(event.target as Node) &&
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

  useEffect(() => {
    if (isOpen) {
      calculatePosition(); // Recalculate on open
      const handleScrollOrResize = () => setIsOpen(false); // Close on scroll/resize is simpler and safer
      window.addEventListener('resize', handleScrollOrResize);
      window.addEventListener('scroll', handleScrollOrResize, true);
      return () => {
        window.removeEventListener('resize', handleScrollOrResize);
        window.removeEventListener('scroll', handleScrollOrResize, true);
      };
    }
  }, [isOpen, calculatePosition]);

  const Menu = (
    <div
      ref={menuRef}
      style={position ? {
        position: 'absolute',
        top: `${position.top}px`,
        left: `${position.left}px`,
      } : { visibility: 'hidden' }} // Hide until position is calculated
      className="w-40 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50 animate-fade-in-up-fast"
    >
      <ul className="py-1">
        <li>
          <button
            onClick={() => { onEdit(user); setIsOpen(false); }}
            className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
          >
            {t('admin.users.table.edit')}
          </button>
        </li>
        <li>
          <button
            onClick={() => { onDelete(user); setIsOpen(false); }}
            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
          >
            {t('admin.users.table.delete')}
          </button>
        </li>
      </ul>
    </div>
  );

  return (
    <>
      <button ref={buttonRef} onClick={toggleOpen} className="p-1 rounded-full hover:bg-white/20 text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500">
        <DotsVerticalIcon />
      </button>
      {isOpen && createPortal(Menu, document.body)}
    </>
  );
};

export default UserTableRowActions;