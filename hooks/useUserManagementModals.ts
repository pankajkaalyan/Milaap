import { useState, useCallback } from 'react';
import { User, Report } from '../types';

export type AdminModalType = 'add' | 'edit' | 'delete' | 'activate' | 'suspendChat' | 'suspendUser' | null;
export interface AdminModalData {
  user?: User;
  users?: User[];
  report?: Report;
}

export const useUserManagementModals = () => {
  const [activeModal, setActiveModal] = useState<AdminModalType>(null);
  const [modalData, setModalData] = useState<AdminModalData>({});

  const openAddModal = useCallback(() => {
    setActiveModal('add');
    setModalData({});
  }, []);

  const openEditModal = useCallback((user: User) => {
    setActiveModal('edit');
    setModalData({ user });
  }, []);

  const openDeleteModal = useCallback((users: User[]) => {
    setActiveModal('delete');
    setModalData({ users });
  }, []);

  const openActivateModal = useCallback((users: User[]) => {
    setActiveModal('activate');
    setModalData({ users });
  }, []);

  const openSuspendChatModal = useCallback((report : Report) => {
    setActiveModal('suspendChat');
    setModalData({report});
  }, []);

  const openSuspendUserModal = useCallback((report : Report) => {
    setActiveModal('suspendUser');
    setModalData({report});
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
    setModalData({});
  }, []);

  return {
    activeModal,
    modalData,
    openAddModal,
    openEditModal,
    openDeleteModal,
    closeModal,
    openSuspendChatModal,
    openSuspendUserModal,
    openActivateModal
  };
};