
import { useState, useEffect } from 'react';
import { User, InterestStatus, Interests, AppEventStatus } from '../../types';
import { acceptInterestAPI, declineInterestAPI, fetchInterestsAPI, sendInterestAPI } from '@/services/api/interests';
import { eventBus } from '@/utils/eventBus';

type TFunction = (key: string, options?: Record<string, string | number>) => string;
type AddToastFunction = (message: string, type?: 'success' | 'error' | 'info') => void;

export const useInterests = (user: User | null, t: TFunction, addToast: AddToastFunction) => {
    const [interests, setInterests] = useState<Interests | null>(null);
    
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (user && token) {
            fetchInterests();
        }
    }, [user, addToast]);

    const fetchInterests = async () => {
        try {
            const data = await fetchInterestsAPI();
            setInterests(data);
            // console.log('Interests data fetched successfully:', data);
            return data;
        } catch (error) {
            // console.error("Failed to fetch interests:", error);
            addToast("Could not load your interests data.", 'error');
        }
    }


    const expressInterest = async (targetUserId: number, targetName: string, message?: string) => {
        if (!user) return;
        // const newInterest = await interactionService.expressInterest(user.id as number, targetUserId);
        // setInterests(prev => [newInterest, ...prev]);
        sendInterestAPI(targetUserId, 'Hi').then(() => {
            // console.log('Interest expressed successfully');
            eventBus.emit(AppEventStatus.EXPRESS_INTEREST, { targetUserId, newStatus: InterestStatus.PENDING });
            fetchInterests();
        }).catch((error) => {
            // console.error('Error expressing interest:', error);
        });
        // const targetUser = mockUsers.find(u => u.id === targetUserId);
        addToast(t('toasts.interest.sent', { name: targetName || '' }), 'success');
    };


    const updateInterestStatus = async (interestId: number, targetUserId: string | number, targetName: string, status: InterestStatus) => {
        if (!user) return;

        // const interestToUpdate = interests.find(i => i.senderId === senderId && i.recipientId === user.id);
        // if (!interestToUpdate) return;

        // const updatedInterest = await interactionService.updateInterest(interestToUpdate.id, status);
        // setInterests(prev => prev.map(i => i.id === updatedInterest.id ? updatedInterest : i));

        // const sender = mockUsers.find(u => u.id === senderId);
        if (status === InterestStatus.ACCEPTED) {
            acceptInterestAPI(interestId, '').then(() => {
                addToast(t('toasts.interest.accepted', { name: targetName || '' }), 'success');
                fetchInterests();
                eventBus.emit(AppEventStatus.ACCEPTED, { targetUserId, newStatus: InterestStatus.ACCEPTED });
            });
        } else {
            declineInterestAPI(interestId, '').then(() => {
                addToast(t('toasts.interest.declined', { name: targetName || '' }), 'info');
                fetchInterests();
                eventBus.emit(AppEventStatus.DECLINED, { targetUserId, newStatus: InterestStatus.DECLINED });
            });
        }
    };


    return {
        interests,
        setInterests,
        expressInterest,
        acceptInterest: (interestId: number, targetUserId: string | number, senderName: string) => updateInterestStatus(interestId, targetUserId, senderName, InterestStatus.ACCEPTED),
        declineInterest: (interestId: number, targetUserId: string | number, senderName: string) => updateInterestStatus(interestId, targetUserId, senderName, InterestStatus.DECLINED),
    };
};
