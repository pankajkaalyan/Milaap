import { useState, useCallback } from 'react';

export type ActiveModal = 'report' | 'gallery' | 'premium' | 'video' | null;

interface ModalData {
  imageUrl?: string;
}

export const useProfileModals = () => {
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [modalData, setModalData] = useState<ModalData>({});

  const openModal = (modal: ActiveModal, data: ModalData = {}) => {
    setActiveModal(modal);
    setModalData(data);
  };

  const closeModal = useCallback(() => {
    setActiveModal(null);
    setModalData({});
  }, []);

  return {
    activeModal,
    modalData,
    openReportModal: () => openModal('report'),
    openGalleryModal: (imageUrl: string) => openModal('gallery', { imageUrl }),
    openPremiumModal: () => openModal('premium'),
    openVideoModal: () => openModal('video'),
    closeModal,
  };
};
