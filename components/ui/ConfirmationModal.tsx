import React from 'react';
import Button from './Button';
import Modal from './Modal';
import { ButtonVariant, ModalSize } from '../../types';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmButtonText = 'Confirm',
  cancelButtonText = 'Cancel',
}) => {
  
  const footer = (
     <>
        <Button onClick={onClose} variant={ButtonVariant.SECONDARY} className="w-auto">
            {cancelButtonText}
        </Button>
        <Button onClick={onConfirm} className="w-auto !bg-gradient-to-r !from-red-600 !to-red-800">
            {confirmButtonText}
        </Button>
     </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} footer={footer} size={ModalSize.MD}>
        <div className="p-6">
          <div className="text-gray-300">{message}</div>
        </div>
    </Modal>
  );
};

export default ConfirmationModal;