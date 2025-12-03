import React from 'react';
import { Conversation, Match, ModalSize } from '../../../types';
import { useAppContext } from '../../../hooks/useAppContext';
import Button from '../../ui/Button';
import Modal from '../../ui/Modal';

interface CallingModalProps {
  user: Conversation;
  onClose: () => void;
}

const CallingModal: React.FC<CallingModalProps> = ({ user, onClose }) => {
  const { t } = useAppContext();

  return (
    <Modal isOpen={true} onClose={onClose} size={ModalSize.SM}>
        <div className="p-8 text-center w-full">
            <img
            src={user.profilePic}
            alt={user.userName}
            className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-amber-500"
            />
            <h2 className="text-3xl font-bold text-white">{user.userName}</h2>
            <p className="text-lg text-gray-300 mt-2">
                {t('messages.chat.calling').replace('{name}', user.userName.split(' ')[0])}
            </p>

            <div className="mt-8">
                <Button onClick={onClose} className="bg-red-600 hover:bg-red-700 focus:ring-red-500 !bg-gradient-to-r !from-red-500 !to-red-700">
                    {t('messages.chat.end_call')}
                </Button>
            </div>
        </div>
    </Modal>
  );
};

export default CallingModal;