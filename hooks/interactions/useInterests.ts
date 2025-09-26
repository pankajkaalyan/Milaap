
import { useState, useEffect } from 'react';
import { User, Interest, InterestStatus } from '../../types';
import { interactionService } from '../../services/api/interactionService';
import { mockUsers } from '../../data/mockUsers';

type TFunction = (key: string, options?: Record<string, string | number>) => string;
type AddToastFunction = (message: string, type?: 'success' | 'error' | 'info') => void;

export const useInterests = (user: User | null, t: TFunction, addToast: AddToastFunction) => {
    const [interests, setInterests] = useState<Interest[]>([]);

    useEffect(() => {
        if (user) {
            const fetchInterests = async () => {
                try {
                    const interestData = await interactionService.getInterests(user.id as number);
                    setInterests(interestData);
                } catch (error) {
                    console.error("Failed to fetch interests:", error);
                    addToast("Could not load your interests data.", 'error');
                }
            };
            fetchInterests();
        }
    }, [user, addToast]);
    
    const expressInterest = async (targetUserId: number) => {
        if (!user) return;
        const newInterest = await interactionService.expressInterest(user.id as number, targetUserId);
        setInterests(prev => [newInterest, ...prev]);
        const targetUser = mockUsers.find(u => u.id === targetUserId);
        addToast(t('toasts.interest.sent', { name: targetUser?.name || '' }), 'success');
    };

    const updateInterestStatus = async (senderId: number, status: InterestStatus) => {
        if (!user) return;
        const interestToUpdate = interests.find(i => i.senderId === senderId && i.receiverId === user.id);
        if (!interestToUpdate) return;

        const updatedInterest = await interactionService.updateInterest(interestToUpdate.id, status);
        setInterests(prev => prev.map(i => i.id === updatedInterest.id ? updatedInterest : i));
        
        const sender = mockUsers.find(u => u.id === senderId);
        if (status === InterestStatus.ACCEPTED) {
             addToast(t('toasts.interest.accepted', { name: sender?.name || '' }), 'success');
        } else {
             addToast(t('toasts.interest.declined', { name: sender?.name || '' }), 'info');
        }
    };

    return {
        interests,
        setInterests,
        expressInterest,
        acceptInterest: (senderId: number) => updateInterestStatus(senderId, InterestStatus.ACCEPTED),
        declineInterest: (senderId: number) => updateInterestStatus(senderId, InterestStatus.DECLINED),
    };
};
