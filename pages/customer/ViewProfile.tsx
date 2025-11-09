import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../hooks/useAppContext';
import { mockUsers } from '../../data/mockUsers';
import { MembershipPlan, User } from '../../types';
import NotFound from '../NotFound';
import ProfileHeader from './profile/ProfileHeader';
import ProfileTabs from '../../components/customer/profile/ProfileTabs';
import { useProfileModals } from '../../hooks/useProfileModals';
import ProfileModals from '../../components/customer/profile/ProfileModals';
import { getProfileByIdAPI } from '@/services/api/profile';

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
        const fetchUserProfile = async () => {
            if (fetchedUserRef.current === userId) return; // ✅ already fetched
            fetchedUserRef.current = userId;

            try {
                const data = await getProfileByIdAPI(parseInt(userId || '0'));
                setTargetUserProfile(data);
                console.log('Fetched user profile:', data);
            } catch (err) {
                console.error('Error fetching user profile:', err);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchUserProfile();
        }
    }, [userId]);

    const sentInterest = interests.sent;
    const receivedInterest = interests.received;

    if (loading) {
        return <div>Loading...</div>; // You can replace this with a proper loader component
    }

    if (!user || !targetUserProfile) {
        return <NotFound />;
    }
    const isBlocked = targetUserProfile?.profile?.blockedUsers?.includes(user.id.toString());
    const isFavourite = favourites.some(fav => fav.id === user.id);
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
                    isFavourite={isFavourite}
                    isBlocked={!!isBlocked}
                    sentInterestStatus={sentInterest[0]?.status}
                    receivedInterestStatus={receivedInterest[0]?.status}
                    onToggleFavourite={() => toggleFavourite(user)}
                    onToggleBlock={() => toggleBlockUser(user.id)}
                    onReport={openReportModal}
                    onExpressInterest={() => expressInterest(user.id, user.name)}
                    onAcceptInterest={() => acceptInterest(1,user.id, user.name)}
                    onDeclineInterest={() => declineInterest(1,user.id, user.name)}
                    onMessage={() => navigate(`/messages/${user.id}`)}
                />

                <ProfileTabs
                    user={user}
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
