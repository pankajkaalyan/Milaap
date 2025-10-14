import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../hooks/useAppContext';
import { mockUsers } from '../../data/mockUsers';
import { MembershipPlan } from '../../types';
import NotFound from '../NotFound';
import ProfileHeader from './profile/ProfileHeader';
import ProfileTabs from '../../components/customer/profile/ProfileTabs';
import { useProfileModals } from '../../hooks/useProfileModals';
import ProfileModals from '../../components/customer/profile/ProfileModals';

const ViewProfile: React.FC = () => {
    const { 
        user: currentUser, 
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
    const user = mockUsers.find(u => u.id === parseInt(userId || '0'));

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

    if (!user || !currentUser) {
        return <NotFound />;
    }
    
    const isFavourite = favourites.some(fav => fav.id === user.id);
    const isBlocked = currentUser?.profile?.blockedUsers?.includes(user.id.toString());
    const isPremiumUser = currentUser?.profile?.membership !== MembershipPlan.FREE;
    
    const sentInterest = interests.find(i => i.senderId === currentUser.id && i.recipientId === user.id);
    const receivedInterest = interests.find(i => i.senderId === user.id && i.recipientId === currentUser.id);
    
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
                    user={user}
                    isFavourite={isFavourite}
                    isBlocked={!!isBlocked}
                    sentInterestStatus={sentInterest?.status}
                    receivedInterestStatus={receivedInterest?.status}
                    onToggleFavourite={() => toggleFavourite(user)}
                    onToggleBlock={() => toggleBlockUser(user.id)}
                    onReport={openReportModal}
                    onExpressInterest={() => expressInterest(user.id)}
                    onAcceptInterest={() => acceptInterest(user.id)}
                    onDeclineInterest={() => declineInterest(user.id)}
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
