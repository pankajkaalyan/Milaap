import { useState, useCallback } from 'react';
import { User } from '../types';

export type AdminModalType = 'add' | 'edit' | 'delete' | null;
export interface AdminModalData {
  user?: User;
  users?: User[];
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
  };
};