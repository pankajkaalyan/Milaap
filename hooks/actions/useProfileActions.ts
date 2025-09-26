
import { useCallback } from 'react';
import { User, UserProfile, MembershipPlan } from '../../types';
import { verificationService } from '../../services/ai/verificationService';
import { userService } from '../../services/api/userService';
import { mockUsers } from '../../data/mockUsers';

type TFunction = (key: string, options?: Record<string, string | number>) => string;
type AddToastFunction = (message: string, type?: 'success' | 'error' | 'info') => void;
type UpdateUserFunction = (user: User) => void;
type LogoutFunction = () => void;

export const useProfileActions = (
    user: User | null, 
    updateCurrentUser: UpdateUserFunction, 
    t: TFunction, 
    addToast: AddToastFunction,
    logout: LogoutFunction
) => {
    
    const updateUserProfile = useCallback(async (profile: Partial<UserProfile>) => {
        if (!user) return;
        const updatedUser = await userService.updateProfile(user.id, profile);
        updateCurrentUser(updatedUser); // Update context state
    }, [user, updateCurrentUser]);

    const submitVerification = useCallback(async () => {
        await updateUserProfile({ verificationStatus: 'Pending' });
    }, [updateUserProfile]);
    
    const verifyProfileWithAI = useCallback(async (idDocument: File) => {
        if (!user) return;
        try {
            const result = await verificationService.verifyUserWithAI(user, idDocument);
            if (result.success) {
                await updateUserProfile({ verificationStatus: 'Verified' });
                addToast(t('toasts.verification.ai_success'), 'success');
            } else {
                await submitVerification();
                addToast(t('toasts.verification.ai_failed'), 'info');
                console.log('AI Verification Mismatch:', result.details);
            }
        } catch (error) {
            console.error("AI Verification Error:", error);
            addToast(t('toasts.verification.ai_error'), 'error');
            await submitVerification(); // Fallback to manual
        }
    }, [user, updateUserProfile, submitVerification, addToast, t]);

    const upgradePlan = useCallback(async (plan: MembershipPlan) => {
        await updateUserProfile({ membership: plan });
        addToast(t('toasts.plan_upgraded', { plan }), 'success');
    }, [updateUserProfile, addToast, t]);

    const toggleBlockUser = useCallback(async (userIdToBlock: number) => {
        if (!user?.profile) return;
        const currentBlocked = user.profile.blockedUsers || [];
        const isBlocked = currentBlocked.includes(userIdToBlock.toString());
        const newBlockedList = isBlocked
            ? currentBlocked.filter(id => id !== userIdToBlock.toString())
            : [...currentBlocked, userIdToBlock.toString()];
        
        await updateUserProfile({ blockedUsers: newBlockedList });
        const targetUser = mockUsers.find(u => u.id === userIdToBlock);
        addToast(
            isBlocked ? t('toasts.user.unblocked', { name: targetUser?.name || '' }) : t('toasts.user.blocked', { name: targetUser?.name || '' }),
            'info'
        );
    }, [user, updateUserProfile, addToast, t]);

    const reportUser = useCallback((userId: number, reason: string, details: string) => {
        console.log(`Reporting user ${userId} for ${reason}: ${details}`);
        const targetUser = mockUsers.find(u => u.id === userId);
        addToast(t('toasts.user.reported', { name: targetUser?.name || '' }), 'success');
    }, [addToast, t]);
    
    const deactivateAccount = useCallback(async () => {
        await updateUserProfile({ status: 'deactivated' });
        logout();
        addToast("Your account has been deactivated.", 'info');
    }, [updateUserProfile, logout, addToast]);

    const deleteAccount = useCallback(async () => {
        console.log("Deleting account for user:", user?.id);
        logout();
        addToast("Your account has been permanently deleted.", 'success');
    }, [user, logout, addToast]);

    return {
        updateUserProfile,
        submitVerification,
        verifyProfileWithAI,
        upgradePlan,
        toggleBlockUser,
        reportUser,
        deactivateAccount,
        deleteAccount,
    };
};
