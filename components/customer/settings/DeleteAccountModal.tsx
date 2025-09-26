import React, { useState } from 'react';
import Modal from '../../ui/Modal';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import { ButtonVariant, ModalSize } from '../../../types';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [confirmationText, setConfirmationText] = useState('');
  const isConfirmed = confirmationText === 'DELETE';

  const footer = (
    <>
      <Button onClick={onClose} variant={ButtonVariant.SECONDARY} className="w-auto">
        Cancel
      </Button>
      <Button
        onClick={onConfirm}
        disabled={!isConfirmed}
        className="w-auto !bg-gradient-to-r !from-red-600 !to-red-800"
      >
        Permanently Delete Account
      </Button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Your Account?" footer={footer} size={ModalSize.MD}>
      <div className="p-6 space-y-4">
        <p className="text-red-300">
          This action is permanent and cannot be undone. All your data, including messages, matches, and profile information, will be permanently erased.
        </p>
        <p className="text-gray-300">
          To confirm, please type <strong>DELETE</strong> in the box below.
        </p>
        <Input
          id="delete-confirm"
          label=""
          type="text"
          value={confirmationText}
          onChange={(e) => setConfirmationText(e.target.value)}
          placeholder="Type DELETE to confirm"
        />
      </div>
    </Modal>
  );
};

export default DeleteAccountModal;