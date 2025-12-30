import React from 'react';
import { User, UserRole } from '../../../types';
import { AdminModalType, AdminModalData } from '../../../hooks/useUserManagementModals';
import AddUserModal from '../AddUserModal';
import EditUserModal from '../EditUserModal';
import ConfirmationModal from '../../ui/ConfirmationModal';
import { useAppContext } from '../../../hooks/useAppContext';

interface UserModalsProps {
  activeModal: AdminModalType;
  modalData: AdminModalData;
  onClose: () => void;
  onAddUser: (name: string, email: string, role: UserRole) => void;
  onUpdateUser: (userId: string | number, userData: Partial<Pick<User, 'name' | 'role'>>) => void;
  onDeleteConfirm: (userIds: (string | number)[]) => void;
  onSuspendChatConfirm: (reporterId: string | number) => void;
  onSuspendUserConfirm?: (reporterId: string | number) => void;
}

const UserModals: React.FC<UserModalsProps> = ({
  activeModal,
  modalData,
  onClose,
  onAddUser,
  onUpdateUser,
  onDeleteConfirm,
  onSuspendChatConfirm,
  onSuspendUserConfirm,
}) => {
  const { t } = useAppContext();

  if (!activeModal) return null;

  switch (activeModal) {
    case 'add':
      return (
        <AddUserModal
          isOpen={true}
          onClose={onClose}
          onAddUser={onAddUser}
        />
      );
    case 'edit':
      return (
        <EditUserModal
          isOpen={true}
          onClose={onClose}
          user={modalData.user || null}
          onUpdateUser={onUpdateUser}
        />
      );
    case 'delete': {
      const usersToDelete = modalData.users || [];
      const message = usersToDelete.length > 1
        ? t('admin.users.delete_confirm_bulk').replace('{count}', usersToDelete.length.toString())
        : t('admin.users.delete_confirm').replace('{name}', usersToDelete[0]?.name || 'this user');

      return (
        <ConfirmationModal
          isOpen={true}
          onClose={onClose}
          onConfirm={() => onDeleteConfirm(usersToDelete.map(u => u.id))}
          title={t('admin.users.delete_confirm_title')}
          message={message}
          confirmButtonText={t('admin.users.table.delete')}
        />
      );
    }
    case 'suspendChat':
      return (
        <ConfirmationModal
          isOpen={true}
          onClose={onClose}
          onConfirm={() =>
            onSuspendChatConfirm(modalData.report?.id)
          }
          title={t('admin.users.suspend_chat_confirm_title')}
          message={t('admin.users.suspend_chat_confirm_message').replace(
            '{name}',
            modalData.report?.reportedUserName || ''
          )}
          confirmButtonText={t('admin.actions.suspend_chat')}
        />
      );

      case 'suspendUser':
      return (
        <ConfirmationModal
          isOpen={true}
          onClose={onClose}
          onConfirm={() =>
            onSuspendUserConfirm(modalData.report?.id)
          }
          title={t('admin.users.suspend_user_confirm_title')}
          message={t('admin.users.suspend_user_confirm_message').replace(
            '{name}',
            modalData.report?.reportedUserName || ''
          )}
          confirmButtonText={t('admin.actions.suspend_user')}
        />
      );
    default:
      return null;
  }
};

export default UserModals;
