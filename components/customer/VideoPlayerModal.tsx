import React from 'react';
import Modal from '../ui/Modal';
import MediaPlayer from '../ui/MediaPlayer';
import { MediaPlayerType, ModalVariant } from '../../types';

interface VideoPlayerModalProps {
  videoUrl: string;
  onClose: () => void;
}

const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ videoUrl, onClose }) => {
  return (
    <Modal isOpen={true} onClose={onClose} variant={ModalVariant.LIGHTBOX}>
        <MediaPlayer 
            src={videoUrl} 
            type={MediaPlayerType.VIDEO}
        />
    </Modal>
  );
};

export default VideoPlayerModal;