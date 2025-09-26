import React from 'react';
import Modal from '../ui/Modal';
import { ModalVariant } from '../../types';

interface PhotoGalleryModalProps {
  imageUrl: string;
  onClose: () => void;
}

const PhotoGalleryModal: React.FC<PhotoGalleryModalProps> = ({ imageUrl, onClose }) => {
  return (
    <Modal isOpen={true} onClose={onClose} variant={ModalVariant.LIGHTBOX}>
        <img src={imageUrl} alt="Full size view" className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"/>
    </Modal>
  );
};

export default PhotoGalleryModal;