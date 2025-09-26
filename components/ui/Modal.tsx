import React, { ReactNode } from 'react';
import CloseIcon from '../icons/CloseIcon';
import { ModalSize, ModalVariant } from '../../types';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: ModalSize;
  variant?: ModalVariant;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer, size = ModalSize.LG, variant = ModalVariant.DEFAULT }) => {
  if (!isOpen) return null;

  const sizeClasses: Record<ModalSize, string> = {
    [ModalSize.SM]: 'max-w-sm',
    [ModalSize.MD]: 'max-w-md',
    [ModalSize.LG]: 'max-w-lg',
    [ModalSize.XL]: 'max-w-xl',
    [ModalSize.XXL]: 'max-w-2xl',
    [ModalSize.XXXL]: 'max-w-3xl',
  };

  if (variant === ModalVariant.LIGHTBOX) {
    return (
      <div 
        className="fixed inset-0 z-[120] bg-black/90 flex items-center justify-center p-4 animate-fade-in"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
      >
        <button 
          className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 z-10"
          aria-label="Close"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="relative w-full max-w-4xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            {children}
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      onClick={onClose}
    >
      <div 
        className={`relative bg-gray-900 rounded-2xl shadow-2xl w-full ${sizeClasses[size]} border border-amber-500/20 max-h-[90vh] flex flex-col animate-fade-in-scale`}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white z-10" aria-label="Close">
          <CloseIcon />
        </button>
        {title && (
          <div className="p-6 pr-12 border-b border-white/10 shrink-0">
            <h2 id="modal-title" className="text-2xl font-bold text-white">{title}</h2>
          </div>
        )}
        <div className="overflow-y-auto">
            {children}
        </div>
        {footer && (
          <div className="p-6 border-t border-white/10 mt-auto flex justify-end space-x-4 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;