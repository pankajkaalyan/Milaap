import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../hooks/useAppContext';
import { mockUsers } from '../../data/mockUsers';
import { AppEventStatus, InterestStatus, MembershipPlan, User } from '../../types';
import NotFound from '../NotFound';
import ProfileHeader from './profile/ProfileHeader';
import ProfileTabs from '../../components/customer/profile/ProfileTabs';
import { useProfileModals } from '../../hooks/useProfileModals';
import ProfileModals from '../../components/customer/profile/ProfileModals';
import { getProfileByIdAPI } from '@/services/api/profile';
import { eventBus } from '@/utils/eventBus';

const ViewProfile: React.FC = () => {
    const [targetUserProfile, setTargetUserProfile] = useState<User | null>(null);
    const [loading, setLoading] = useState(true); // show loader until data comes
    const {
        favourites,
        toggleFavourite,
        toggleBlockUser,
        interests,
        expressInterest,
        acceptInterest,
        declineInterest
    } = useAppContext();
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') as User : null;
    // console.log('Current User:', user);

    const {
        activeModal,
        modalData,
        openReportModal,
        openGalleryModal,
        openPremiumModal,
        openVideoModal,
        closeModal
    } = useProfileModals();

    const [showContact, setShowContact] = React.useState(false);

    const fetchedUserRef = useRef<string | null>(null);

    useEffect(() => {
        eventBus.on(AppEventStatus.ACCEPTED, updateStatusHandler);
        eventBus.on(AppEventStatus.DECLINED, updateStatusHandler);
        const fetchUserProfile = async () => {
            if (fetchedUserRef.current === userId) return; // ✅ already fetched
            fetchedUserRef.current = userId;

            try {
                const data = await getProfileByIdAPI(parseInt(userId || '0'));
                setTargetUserProfile(data);
                // console.log('Fetched user profile:', data);
            } catch (err) {
                console.error('Error fetching user profile:', err);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchUserProfile();
        }
        return () => {
            eventBus.off(AppEventStatus.ACCEPTED, updateStatusHandler);
            eventBus.off(AppEventStatus.DECLINED, updateStatusHandler);
        }
    }, [userId]);

    const sentInterest = interests?.sent;
    const receivedInterest = interests?.received;
    // console.log('Sent Interests:', sentInterest);
    // console.log('Received Interests:', receivedInterest);
    // console.log('Target User Profile:', targetUserProfile);
    const currentInterest = sentInterest?.find(interest => interest.profile.id.toString() === userId) ||
        receivedInterest?.find(interest => interest.profile.id.toString() === userId);
    // console.log('Current Interest with target user:', currentInterest);

    let sentInterestStatus = currentInterest && sentInterest?.some(interest => interest.profile.id.toString() === userId) ? currentInterest.status : undefined;
    let receivedInterestStatus = currentInterest && receivedInterest?.some(interest => interest.profile.id.toString() === userId)
        ? currentInterest.status : undefined;
    
    // console.log('Sent Interest Status:', sentInterestStatus);
    // console.log('Received Interest Status:', receivedInterestStatus);

    const updateStatusHandler = (data: { targetUserId: number; newStatus: InterestStatus }) => {
        // console.log('updateStatusHandler called with data:', data);
        if (data.targetUserId === user.id) {
            if (sentInterestStatus) {
                sentInterestStatus = data.newStatus;
                // console.log(`Updated interest status for user ${user.id} to ${sentInterestStatus} via sentInterestStatus`);
            } else if (receivedInterestStatus) {
                receivedInterestStatus = data.newStatus;
                // console.log(`Updated interest status for user ${user.id} to ${receivedInterestStatus} via receivedInterestStatus`);
            }
        }
    }

    if (loading) {
        return <div>Loading...</div>; // You can replace this with a proper loader component
    }

    if (!user || !targetUserProfile) {
        return <NotFound />;
    }
    
    // const isFavourite = favourites.some(fav => fav.id === user.id);
    const isPremiumUser = targetUserProfile?.profile?.membership !== MembershipPlan.FREE;
    const handleViewContact = () => {
        if (isPremiumUser) {
            setShowContact(true);
        } else {
            openPremiumModal();
        }
    }

    return (
        <>
            <div className="max-w-4xl mx-auto space-y-8">
                <ProfileHeader
                    user={targetUserProfile}
                    isFavourite={targetUserProfile.profile.isFavourite}
                    isBlocked={!!targetUserProfile.profile.isBlocked}
                    sentInterestStatus={sentInterestStatus ? sentInterestStatus : undefined}
                    receivedInterestStatus={receivedInterestStatus ? receivedInterestStatus : undefined}
                    onToggleFavourite={() => toggleFavourite({...targetUserProfile, isFavourite: targetUserProfile.profile.isFavourite})}
                    onToggleBlock={() => toggleBlockUser(targetUserProfile.id, targetUserProfile.name, !!targetUserProfile.profile.isBlocked)}
                    onReport={openReportModal}
                    onExpressInterest={() => expressInterest(targetUserProfile.id, targetUserProfile.name)}
                    onAcceptInterest={() => acceptInterest(currentInterest.interestRequestId, targetUserProfile.id, targetUserProfile.name)}
                    onDeclineInterest={() => declineInterest(currentInterest.interestRequestId, targetUserProfile.id, targetUserProfile.name)}
                    onMessage={() => navigate(`/messages/${targetUserProfile.id}`)}
                />

                <ProfileTabs
                    user={targetUserProfile}
                    showContact={showContact}
                    onViewContact={handleViewContact}
                    onViewPhoto={openGalleryModal}
                    onWatchVideo={openVideoModal}
                />
            </div>

            <ProfileModals
                activeModal={activeModal}
                modalData={modalData}
                onClose={closeModal}
                targetUser={user}
            />
        </>
    );
};

export default ViewProfile;
