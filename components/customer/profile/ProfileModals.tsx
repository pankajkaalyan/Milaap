import React from 'react';
import { Match } from '../../../types';
import ReportUserModal from '../ReportUserModal';
import PhotoGalleryModal from '../PhotoGalleryModal';
import PremiumFeatureModal from '../PremiumFeatureModal';
import VideoPlayerModal from '../VideoPlayerModal';
import { ActiveModal } from '../../../hooks/useProfileModals';
import { useAppContext } from '../../../hooks/useAppContext';

interface ProfileModalsProps {
  activeModal: ActiveModal;
  modalData: { imageUrl?: string };
  onClose: () => void;
  targetUser: Match;
}

const ProfileModals: React.FC<ProfileModalsProps> = ({ activeModal, modalData, onClose, targetUser }) => {
  const { t, reportUser } = useAppContext();

  const handleReportSubmit = (reason: string, details: string) => {
    reportUser(targetUser.id, reason, details);
    onClose();
  };

  if (!activeModal) {
    return null;
  }

  switch (activeModal) {
    case 'report':
      return (
        <ReportUserModal
          user={targetUser}
          isOpen={true}
          onClose={onClose}
          onSubmit={handleReportSubmit}
        />
      );
    case 'gallery':
      return modalData.imageUrl ? (
        <PhotoGalleryModal imageUrl={modalData.imageUrl} onClose={onClose} />
      ) : null;
    case 'premium':
      return (
        <PremiumFeatureModal
          isOpen={true}
          onClose={onClose}
          title={t('premium_modal.title')}
          description={t('premium_modal.desc')}
        />
      );
    case 'video':
      return targetUser.video ? (
        <VideoPlayerModal videoUrl={targetUser.video} onClose={onClose} />
      ) : null;
    default:
      return null;
  }
};

export default ProfileModals;
