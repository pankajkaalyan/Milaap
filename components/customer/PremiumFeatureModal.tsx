import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../hooks/useAppContext';
import Button from '../ui/Button';
import CloseIcon from '../icons/CloseIcon';
import { ButtonVariant } from '../../types';

interface PremiumFeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
}

const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
)

const PremiumFeatureModal: React.FC<PremiumFeatureModalProps> = ({ isOpen, onClose, title, description }) => {
  const { t } = useAppContext();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleUpgrade = () => {
    onClose();
    navigate('/membership');
  };

  return (
    <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="relative bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md border border-white/10 flex flex-col items-center text-center p-8">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white" aria-label="Close">
            <CloseIcon />
        </button>
        <LockIcon />
        <h2 className="text-2xl font-bold text-white mt-4">{title}</h2>
        <p className="text-gray-300 mt-2 mb-6">{description}</p>
        
        <div className="w-full flex flex-col sm:flex-row gap-4">
            <Button onClick={onClose} variant={ButtonVariant.SECONDARY} className="w-full">Cancel</Button>
            <Button onClick={handleUpgrade} className="w-full">{t('premium_modal.cta')}</Button>
        </div>
      </div>
    </div>
  );
};

export default PremiumFeatureModal;