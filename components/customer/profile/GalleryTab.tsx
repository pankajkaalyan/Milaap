import React from 'react';
import { Match, MediaPlayerType } from '../../../types';
import Card from '../../ui/Card';
import MediaPlayer from '../../ui/MediaPlayer';
import MicIcon from '../../icons/MicIcon';
import PlayIcon from '../../icons/PlayIcon';
import { useAppContext } from '../../../hooks/useAppContext';

interface GalleryTabProps {
    user: Match;
    onViewPhoto: (photoUrl: string) => void;
    onWatchVideo: () => void;
}

const GalleryTab: React.FC<GalleryTabProps> = ({ user, onViewPhoto, onWatchVideo }) => {
    const { t } = useAppContext();
    const userPhotos = user.photos && user.photos.length > 0 ? user.photos : [`https://picsum.photos/800/600?random=${user.id}`];

    return (
        <div className="space-y-8">
            <Card>
                <h2 className="text-xl font-bold text-white mb-4">{t('profile.photo_gallery')}</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {userPhotos.map((photo, index) => (
                        <div key={index} className="aspect-w-1 aspect-h-1" onClick={() => onViewPhoto(photo)}>
                            <img src={photo} alt={`${user.name}'s photo ${index + 1}`} className="w-full h-full object-cover rounded-lg cursor-pointer transform hover:scale-105 transition-transform duration-300"/>
                        </div>
                    ))}
                </div>
            </Card>

            {user.audio && (
                <Card>
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <MicIcon className="w-6 h-6" />
                        Audio Introduction
                    </h2>
                    <MediaPlayer src={user.audio} type={MediaPlayerType.AUDIO} />
                </Card>
            )}

            {user.video && (
                 <Card>
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <PlayIcon className="w-6 h-6" />
                        Video Introduction
                    </h2>
                    <div className="relative group cursor-pointer" onClick={onWatchVideo}>
                        <video src={user.video} poster={user.photos?.[0]} className="w-full rounded-lg" />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100">
                            <PlayIcon className="w-16 h-16 text-white" />
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default GalleryTab;