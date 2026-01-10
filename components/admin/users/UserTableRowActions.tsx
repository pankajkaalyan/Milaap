import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { User } from '../../../types';

type ActionVariant = 'default' | 'danger';

interface ActionConfig {
  key: string;
  label: string;
  onClick: (user: User) => void;
  visible?: boolean | ((user: User) => boolean);
  disabled?: boolean;
  variant?: ActionVariant;
}

interface Props {
  user: User;
  actions: ActionConfig[];
}

const DROPDOWN_HEIGHT = 160;
const DROPDOWN_WIDTH = 160;

const ThreeDotsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="5" r="2" />
    <circle cx="12" cy="12" r="2" />
    <circle cx="12" cy="19" r="2" />
  </svg>
);

const UserTableRowActions: React.FC<Props> = ({ user, actions }) => {
  const [open, setOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Position dropdown
  useLayoutEffect(() => {
    if (open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;

      const top = spaceBelow < DROPDOWN_HEIGHT
        ? rect.top + window.scrollY - DROPDOWN_HEIGHT
        : rect.bottom + window.scrollY;

      const left = rect.left + window.scrollX + rect.width - DROPDOWN_WIDTH;

      setDropdownPos({ top, left });
    }
  }, [open]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!buttonRef.current?.contains(e.target as Node) && !dropdownRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Only show visible actions
  const visibleActions = actions.filter(
    (a) => a.visible === undefined || (typeof a.visible === 'function' ? a.visible(user) : a.visible)
  );

  if (visibleActions.length === 0) return <td />;

  return (
    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
      <div className="inline-block relative">
        <button
          ref={buttonRef}
          onClick={() => setOpen((p) => !p)}
          className="p-2 rounded hover:bg-gray-700 focus:ring-2 focus:ring-pink-400 transition"
        >
          <ThreeDotsIcon />
        </button>

        {open &&
          createPortal(
            <div
              ref={dropdownRef}
              style={{
                position: 'absolute',
                top: dropdownPos.top,
                left: dropdownPos.left,
                width: DROPDOWN_WIDTH,
                zIndex: 9999,
              }}
              className="bg-gray-800 border border-gray-700 rounded shadow-lg py-1"
            >
              {visibleActions.map((action) => (
                <button
                  key={action.key}
                  disabled={action.disabled}
                  onClick={() => {
                    action.onClick(user);
                    setOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm transition-colors
                    ${action.disabled
                      ? 'text-gray-500 cursor-not-allowed'
                      : action.variant === 'danger'
                        ? 'text-red-400 hover:bg-gray-700'
                        : 'text-pink-400 hover:bg-gray-700'
                    }
                  `}
                >
                  {action.label}
                </button>
              ))}
            </div>,
            document.body
          )}
      </div>
    </td>
  );
};

export default UserTableRowActions;
