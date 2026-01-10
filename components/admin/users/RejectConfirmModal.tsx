import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { User } from '../../../types';

interface RejectConfirmModalProps {
  user: User;
  onClose: () => void;
  onConfirm: () => void;
}

const RejectConfirmModal: React.FC<RejectConfirmModalProps> = ({
  user,
  onClose,
  onConfirm,
}) => {
  // Prevent background scroll while modal is open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  // Handle ESC key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop: Click to close */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" 
        onClick={onClose}
      />

      {/* Modal Card */}
      <div
        className="relative bg-gray-800 rounded-lg shadow-2xl p-6 w-full max-w-sm border border-gray-700"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <h3 className="text-xl font-semibold text-white mb-2">Reject User</h3>

        <p className="text-gray-300 mb-6">
          Are you sure you want to reject <strong>{user.name}</strong>? 
          This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-500 text-white font-medium transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-500 text-white font-medium transition-colors"
          >
            Reject User
          </button>
        </div>
      </div>
    </div>
  );

  // Render into body to ensure it's on top of everything
  return createPortal(modalContent, document.body);
};

export default RejectConfirmModal;