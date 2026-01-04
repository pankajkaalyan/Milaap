import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
}

const RegistrationModal: React.FC<ModalProps> = ({ isOpen, onClose, title, description }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-gray-900 rounded-lg w-full max-w-md p-6 relative animate-fade-in-scale">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white text-xl"
        >
          ✕
        </button>

        <h3 className="text-xl font-semibold text-white mb-3">
          {title}
        </h3>

        <p className="text-gray-300 text-sm">
          {description}
        </p>

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black rounded-md font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationModal;
