import React from 'react';
import { User } from '../../types';
import { useAppContext } from '../../hooks/useAppContext';
import Button from '../ui/Button';
import CloseIcon from '../icons/CloseIcon';

interface VerificationReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

const VerificationReviewModal: React.FC<VerificationReviewModalProps> = ({ isOpen, onClose, user }) => {
  const { t, approveVerification, rejectVerification } = useAppContext();

  if (!isOpen) return null;
  
  const handleApprove = () => {
    approveVerification(user.id);
    onClose();
  };
  
  const handleReject = () => {
    rejectVerification(user.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="relative bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg border border-white/10 flex flex-col">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white z-10" aria-label="Close">
            <CloseIcon />
        </button>
        <div className="p-6 pr-12 border-b border-white/10">
          <h2 className="text-2xl font-bold text-white">{t('admin.verifications.review_id')}</h2>
          <p className="text-gray-400">For {user.name} ({user.email})</p>
        </div>
        <div className="p-6 space-y-4">
            <h3 className="font-semibold text-white">Submitted Document:</h3>
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                {/* This is a placeholder for the actual document image */}
                <img 
                    src={`https://picsum.photos/seed/${user.id}-id/500/300`} 
                    alt="ID Document" 
                    className="w-full h-auto rounded-md"
                />
            </div>
            <p className="text-xs text-gray-500">Note: This is a placeholder image. In a real application, the user's uploaded document would be displayed here securely.</p>
        </div>
        <div className="p-6 border-t border-white/10 mt-auto flex justify-end space-x-4">
          <Button onClick={handleReject} className="w-auto !bg-gradient-to-r !from-red-600 !to-orange-600">
            {t('admin.actions.reject')}
          </Button>
          <Button onClick={handleApprove} className="w-auto !bg-gradient-to-r !from-green-600 !to-teal-600">
            {t('admin.actions.approve')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VerificationReviewModal;