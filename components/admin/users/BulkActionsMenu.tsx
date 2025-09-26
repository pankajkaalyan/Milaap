import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Button from '../../ui/Button';
import DotsVerticalIcon from '../../icons/DotsVerticalIcon';
import { ButtonVariant, UserRole } from '../../../types';
import { useAppContext } from '../../../hooks/useAppContext';

interface BulkActionsMenuProps {
  selectedCount: number;
  onDelete: () => void;
  onChangeRole: (role: UserRole) => void;
}

const BulkActionsMenu: React.FC<BulkActionsMenuProps> = ({ selectedCount, onDelete, onChangeRole }) => {
  const { t } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);

  const calculatePosition = useCallback(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const menuHeight = 120; // Approx height for 3 items + padding
      const menuWidth = 192; // w-48

      let top = rect.bottom + window.scrollY + 4;
      if (window.innerHeight - rect.bottom < menuHeight && rect.top > menuHeight) {
        top = rect.top + window.scrollY - menuHeight - 4;
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
      const handleScrollOrResize = () => setIsOpen(false);
      window.addEventListener('resize', handleScrollOrResize);
      window.addEventListener('scroll', handleScrollOrResize, true);
      return () => {
        window.removeEventListener('resize', handleScrollOrResize);
        window.removeEventListener('scroll', handleScrollOrResize, true);
      };
    }
  }, [isOpen]);

  if (selectedCount === 0) {
    return null;
  }

  const Menu = (
    <div
      ref={menuRef}
      style={position ? {
        position: 'absolute',
        top: `${position.top}px`,
        left: `${position.left}px`,
      } : { visibility: 'hidden' }}
      className="w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50 animate-fade-in-up-fast"
    >
      <ul className="py-1">
        <li>
          <button
            onClick={() => { onChangeRole(UserRole.ADMIN); setIsOpen(false); }}
            className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
          >
            {t('admin.users.actions.change_role_admin')}
          </button>
        </li>
        <li>
          <button
            onClick={() => { onChangeRole(UserRole.CUSTOMER); setIsOpen(false); }}
            className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
          >
            {t('admin.users.actions.change_role_customer')}
          </button>
        </li>
        <li><hr className="border-gray-600 my-1" /></li>
        <li>
          <button
            onClick={() => { onDelete(); setIsOpen(false); }}
            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
          >
            {t('admin.users.actions.delete')}
          </button>
        </li>
      </ul>
    </div>
  );

  return (
    <div className="bg-white/10 p-2 rounded-lg mb-4 flex justify-between items-center animate-fade-in-down">
      <span className="text-sm font-semibold text-white ml-2">
        {t('admin.users.selected_count').replace('{count}', selectedCount.toString())}
      </span>
      <div>
        <Button
          ref={buttonRef}
          onClick={toggleOpen}
          variant={ButtonVariant.SECONDARY}
          className="w-auto !py-1.5 !px-3 !text-sm flex items-center gap-1"
        >
          {t('admin.users.actions.title')}
          <DotsVerticalIcon className="h-4 w-4" />
        </Button>
        {isOpen && createPortal(Menu, document.body)}
      </div>
    </div>
  );
};

export default BulkActionsMenu;