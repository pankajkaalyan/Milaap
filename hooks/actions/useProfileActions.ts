
import { useCallback } from 'react';
import { User, UserProfile, MembershipPlan, AppEventStatus } from '../../types';
import { verificationService } from '../../services/ai/verificationService';
import { fetchCurrentUserAPI, verifyProfileAPI } from '@/services/api/profile';
import { blockUserAPI, reportUserAPI, unblockUserAPI } from '@/services/api/auth';
import { eventBus } from '@/utils/eventBus';

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
        // const updatedUser = await userService.updateProfile(user.id, profile);
        const currentUser = await fetchCurrentUserAPI(); // Simulate fetching updated user
        const newUser: User = {
            id: currentUser.id,
            email: currentUser.email,
            name: currentUser.name,
            role: currentUser.role,
            profile: currentUser.profile,
            createdAt: currentUser.createdAt,
            interestShownList: currentUser.interestShownList,
        };
        console.log('Final profile data to update:', newUser);
        updateCurrentUser(newUser);
        // updateCurrentUser(updatedUser); // Update context state
    }, [user, updateCurrentUser]);

    const submitVerification = useCallback(async (file: File) => {
        // await updateUserProfile({ verificationStatus: 'Pending' });
        verifyProfileAPI(file).then(() => {
            console.log("Verification submitted for user:", user?.id);
            updateUserProfile({ verificationStatus: 'Pending' });
            addToast(t('toasts.verification.submitted'), 'success');
            eventBus.emit(AppEventStatus.VERIFICATION_SUBMITTED, { userId: user?.id, newStatus: 'Pending'});
        }).catch((err) => {
            console.error("Error submitting verification for user:", user?.id, err);
            addToast(t('toasts.verification.submission_failed'), 'error');
        });
    }, [updateUserProfile]);

    const verifyProfileWithAI = useCallback(async (idDocument: File) => {
        if (!user) return;
        try {
            const result = await verificationService.verifyUserWithAI(user, idDocument);
            if (result.success) {
                await updateUserProfile({ verificationStatus: 'Verified' });
                addToast(t('toasts.verification.ai_success'), 'success');
            } else {
                // await submitVerification();
                addToast(t('toasts.verification.ai_failed'), 'info');
                console.log('AI Verification Mismatch:', result.details);
            }
        } catch (error) {
            console.error("AI Verification Error:", error);
            addToast(t('toasts.verification.ai_error'), 'error');
            // await submitVerification(); // Fallback to manual
        }
    }, [user, updateUserProfile, submitVerification, addToast, t]);

    const upgradePlan = useCallback(async (plan: MembershipPlan) => {
        await updateUserProfile({ membership: plan });
        addToast(t('toasts.plan_upgraded', { plan }), 'success');
    }, [updateUserProfile, addToast, t]);

    const toggleBlockUser = useCallback(async (userIdToBlock: number, userName: string, isBlocked: boolean) => {
        // await updateUserProfile({ blockedUsers: newBlockedList });
        if (isBlocked) {
            unblockUserAPI(userIdToBlock).then(() => {
                console.log(`Unblocked user ${userIdToBlock}`);
                addToast(
                    isBlocked ? t('toasts.user.unblocked', { name: userName || '' }) : t('toasts.user.blocked', { name: userName || '' }),
                    'info'
                );
                eventBus.emit(AppEventStatus.BLOCK_USER, { targetUserId: userIdToBlock, isBlocked: !isBlocked });
            }).catch((err) => {
                console.error(`Error unblocking user ${userIdToBlock}:`, err);
            });
        }
        else {
            blockUserAPI(userIdToBlock).then(() => {
                console.log(`Blocking user ${userIdToBlock}`);
                addToast(
                    isBlocked ? t('toasts.user.unblocked', { name: userName || '' }) : t('toasts.user.blocked', { name: userName || '' }),
                    'info'
                );
                eventBus.emit(AppEventStatus.BLOCK_USER, { targetUserId: userIdToBlock, isBlocked: !isBlocked });
            }).catch((err) => {
                console.error(`Error blocking user ${userIdToBlock}:`, err);
            });
        }



    }, [user, updateUserProfile, addToast, t]);

    const reportUser = useCallback((userId: number, reason: string, details: string, userName: string) => {
        // console.log(`Reporting user ${userId} for ${reason}: ${details}`);
        // const targetUser = mockUsers.find(u => u.id === userId);
        reportUserAPI({ reportedId: userId, reason, description: details }).then(() => {
            console.log(`Reported user ${userId} successfully`);
            addToast(t('toasts.user.reported', { name: userName || '' }), 'success');
        }).catch((err) => {
            console.error(`Error reporting user ${userId}:`, err);
        });
        
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
