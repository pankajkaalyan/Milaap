import React, { useEffect, useRef, useState } from 'react';
import { Match, InterestStatus, ButtonVariant, User, AppEventStatus } from '../../../types';
import { useAppContext } from '../../../hooks/useAppContext';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { eventBus } from '@/utils/eventBus';

// Icons
const VerifiedBadge: React.FC = () => (
    <span className="inline-flex items-center ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500 text-white">
        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
        Verified
    </span>
);
const PremiumBadge: React.FC<{ text: string }> = ({ text }) => (
    <span className="inline-flex items-center ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        {text}
    </span>
);
const MoreOptionsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
    </svg>
);

interface ProfileHeaderProps {
    user: User;
    isFavourite: boolean;
    isBlocked: boolean;
    sentInterestStatus?: InterestStatus;
    receivedInterestStatus?: InterestStatus;
    onToggleFavourite: () => void;
    onToggleBlock: () => void;
    onReport: () => void;
    onExpressInterest: () => void;
    onAcceptInterest: () => void;
    onDeclineInterest: () => void;
    onMessage: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
    user, isFavourite, isBlocked, sentInterestStatus, receivedInterestStatus, onToggleFavourite, onToggleBlock, onReport, onExpressInterest,
    onAcceptInterest, onDeclineInterest, onMessage
}) => {
    const { t } = useAppContext();
    const [isOptionsOpen, setIsOptionsOpen] = useState(false);
    // const targetUserIsPremium = user.membership !== 'FREE';

    const userPhotos = user.profile.photos && user.profile.photos.length > 0 ? user.profile.photos : [];

    const optionsRef = useRef(null);

    const updateFavouriteStatus = (data: { currentMatch: Match }) => {
        // console.log('updateFavouriteStatus called with data:', data);
        if (data.currentMatch.id === user.id) {
            user.profile.isFavourite = !user.profile.isFavourite;
            // console.log(`Updated favourite status for match ${user.id} to ${user.profile.isFavourite} via eventBus`);
        }
    }

    const updateBlockedStatusHandler = (data: { targetUserId: number; isBlocked: boolean }) => {
        if (data.targetUserId === user.id) {
            user.profile.isBlocked = !user.profile.isBlocked;
            // console.log(`Updated blocked status for user ${user.id} to ${isBlocked} via isBlocked`);
        }
    }



    useEffect(() => {
        // console.log('ProfileCard mounted for match:', match.id);
        eventBus.on(AppEventStatus.FAVOURITE, updateFavouriteStatus);
        eventBus.on(AppEventStatus.BLOCK_USER, updateBlockedStatusHandler);
        return () => {
            eventBus.off(AppEventStatus.FAVOURITE, updateFavouriteStatus);
            eventBus.off(AppEventStatus.BLOCK_USER, updateBlockedStatusHandler);
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (optionsRef.current && !optionsRef.current.contains(event.target)) {
                setIsOptionsOpen(false);
            }
        };

        if (isOptionsOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOptionsOpen]);

    const [imgError, setImgError] = useState(false)

    const initials = user.name
        ?.split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)

    const showInitials = imgError || !userPhotos?.[0]


    return (
        <Card>
            <div className="flex flex-col sm:flex-row items-center sm:space-x-6 relative">
                {/* <img src={userPhotos[0]} alt={user.name} className="w-32 h-32 rounded-full object-cover border-4 border-orange-500" /> */}
                <>
                    {!showInitials ? (
                        <img
                            src={userPhotos?.[0]}
                            alt={user.name}
                            className="w-32 h-32 rounded-full object-cover border-4 border-orange-500"
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <div className="w-32 h-32 rounded-full border-4 border-orange-500 bg-orange-200 text-orange-800 flex items-center justify-center text-4xl font-bold">
                            {initials}
                        </div>
                    )}
                </>

                <div className="text-center sm:text-left mt-4 sm:mt-0 flex-grow">
                    <h1 className="text-4xl font-bold text-white flex items-center justify-center sm:justify-start flex-wrap">
                        {user.name}, {user.age}
                        {user.profile.verificationStatus.toLocaleLowerCase() === 'verified' && <VerifiedBadge />}
                        {/* {targetUserIsPremium && <PremiumBadge text={t('profile.premium_member')} />} */}
                    </h1>
                    <p className="text-gray-300">{user.profile.profession} in {user.profile.location}</p>

                    <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-4">
                        {receivedInterestStatus === InterestStatus.PENDING ? (
                            <>
                                <Button onClick={onDeclineInterest} className="w-auto px-4 py-2 !text-sm !bg-gradient-to-r !from-red-600 !to-orange-600">{t('interests.decline')}</Button>
                                <Button onClick={onAcceptInterest} className="w-auto px-4 py-2 !text-sm !bg-gradient-to-r !from-green-600 !to-teal-600">{t('interests.accept')}</Button>
                            </>
                        ) : sentInterestStatus ? (
                            <Button disabled variant={ButtonVariant.SECONDARY} className="w-auto px-4 py-2 !text-sm cursor-not-allowed">{t(`interests.status.${sentInterestStatus.toLowerCase()}` as any)}</Button>
                        ) : receivedInterestStatus ? (
                            <Button disabled variant={ButtonVariant.SECONDARY} className="w-auto px-4 py-2 !text-sm cursor-not-allowed">{t(`interests.status.${receivedInterestStatus.toLowerCase()}` as any)}</Button>
                        ) : (
                            <Button onClick={onExpressInterest} className="w-auto px-4 py-2 !text-sm">{t('interests.express_interest')}</Button>
                        )}
                        {/* <Button onClick={onMessage} variant={ButtonVariant.SECONDARY} className="w-auto px-4 py-2 !text-sm">Message</Button> */}
                        <Button onClick={onToggleFavourite} variant={ButtonVariant.SECONDARY} className="w-auto px-4 py-2 !text-sm">
                            {user.profile.isFavourite ? 'Favourited' : 'Favourite'}
                        </Button>
                    </div>
                </div>

                <div className="absolute top-0 right-0" ref={optionsRef}>
                    <button onClick={() => setIsOptionsOpen(!isOptionsOpen)} className="p-2 text-gray-400 hover:text-white rounded-full transition-colors">
                        <MoreOptionsIcon />
                    </button>
                    {isOptionsOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10 animate-fade-in-up-fast">
                            <ul className="py-1">
                                <li>
                                    <button onClick={() => { onToggleBlock(); setIsOptionsOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 transition-colors">
                                        {isBlocked ? t('profile.unblock_user') : t('profile.block_user')}
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => { onReport(); setIsOptionsOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 transition-colors">
                                        {t('profile.report_user')}
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default ProfileHeader;