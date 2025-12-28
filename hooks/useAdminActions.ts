
import { useState, useEffect } from 'react';
import { User, Report, SuccessStory, VerificationLog, AdminUser, AdminRole, UserRole, NotificationType, Notification, SuccessStoryStatus, ImportedUser, AppEventStatus } from '../types';
import { userService } from '../services/api/userService';
import { moderationService } from '../services/api/moderationService';
import { storyService } from '../services/api/storyService';
import { adminService } from '../services/api/adminService';
import { getVerificationReviewAPI, approveVerificationAPI, rejectVerificationAPI, getServiceRequestsAPI } from '../services/api/admin';
import { normalizeVerificationUser } from '../utils/utils';

type TFunction = (key: string, options?: Record<string, string | number>) => string;
type AddToastFunction = (message: string, type?: 'success' | 'error' | 'info') => void;
type AddNotificationFunction = (notification: Omit<Notification, 'id' | 'isRead' | 'timestamp'>) => void;

export const useAdminActions = (t: TFunction, addToast: AddToastFunction, addNotification: AddNotificationFunction) => {
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [verificationRequests, setVerificationRequests] = useState<User[]>([]);
    const [reports, setReports] = useState<Report[]>([]);
    const [storySubmissions, setStorySubmissions] = useState<SuccessStory[]>([]);
    const [verificationLogs, setVerificationLogs] = useState<VerificationLog[]>([]);
    const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [usersData, reportsData, storiesData, logsData, adminUsersData] = await Promise.all([
                userService.getAllUsers(),
                moderationService.getReports(),
                storyService.getSuccessStories(),
                moderationService.getVerificationLogs(),
                adminService.getAdminUsers()
            ]);
            setAllUsers(usersData);
            setReports(reportsData);
            setStorySubmissions(storiesData.filter(s => s.status === SuccessStoryStatus.PENDING));
            setAdminUsers(adminUsersData);
        } catch (error) {
            addToast("Failed to load admin data.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // fetchData();
    }, []);

    // Public function to refresh verification requests (can be called from pages)
    const refreshVerificationRequests = async () => {
        try {
            const pending = await getVerificationReviewAPI();
            setVerificationRequests(pending.filter(u => u.verificationStatus === 'UNDER_REVIEW').map(normalizeVerificationUser));
        } catch (err) {
            addToast("Failed to load pending verifications.", "error");
            throw err;
        }
    };

    useEffect(() => {
        // Fetch pending verification requests from the admin API wrapper only when an auth token exists.
        // If there is no token now, set up a short retry (interval) and a storage listener to detect when token appears.

        let mounted = true;
        let retryHandle: number | undefined;

        const loadPending = async () => {
            try {
                const pending = await getVerificationReviewAPI();
                if (!mounted) return;
                // Normalize to a stable shape
                setVerificationRequests(pending.filter(u => u.verificationStatus === 'UNDER_REVIEW').map(normalizeVerificationUser));
            } catch (err) {
                if (!mounted) return;
                // Don't show toast here to avoid noisy errors during background retries
                // addToast("Failed to load pending verifications.", "error");
            }
        };

        const tryStartRetry = () => {
            let attempts = 0;
            // Retry every 2s up to 5 times (10s total)
            retryHandle = window.setInterval(() => {
                attempts += 1;
                const token = localStorage.getItem('token');
                if (token) {
                    // token appeared — fetch and stop retrying
                    if (retryHandle) {
                        clearInterval(retryHandle);
                        retryHandle = undefined;
                    }
                    loadPending();
                } else if (attempts >= 5) {
                    // give up after max attempts
                    if (retryHandle) {
                        clearInterval(retryHandle);
                        retryHandle = undefined;
                    }
                }
            }, 2000) as unknown as number;
        };

        const storageListener = (e: StorageEvent) => {
            if (e.key === 'token' && e.newValue) {
                // Token set in another tab — fetch and clear retry
                if (retryHandle) {
                    clearInterval(retryHandle);
                    retryHandle = undefined;
                }
                loadPending();
            }
        };

        const initialToken = localStorage.getItem('token');
        if (initialToken) {
            loadPending();
        } else {
            // No token now — try a few retries and listen for storage events
            tryStartRetry();
            window.addEventListener(AppEventStatus.STORAGE, storageListener as EventListener);
        }

        return () => {
            mounted = false;
            if (retryHandle) {
                clearInterval(retryHandle);
                retryHandle = undefined;
            }
            window.removeEventListener(AppEventStatus.STORAGE, storageListener as EventListener);
        };
    }, []);

    const approveVerification = async (userId: string | number) => {
        try {
            // Call the admin API to approve the verification
            const resp = await approveVerificationAPI(userId);

            // Refresh the pending verification requests list from the server
            const pending = await getVerificationReviewAPI();
            const normalizedPending = pending.filter(u => u.verificationStatus === 'UNDER_REVIEW').map((u: any) => ({
                ...u,
                email: u.userEmail || u.email,
                name: u.userName || u.name,
                createdAt: u.submittedAt || u.createdAt
            }));
            setVerificationRequests(normalizedPending);

            // Update allUsers locally (best-effort): set verificationStatus to 'Verified'
            setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, verificationStatus: 'Verified' } : u));

            addToast(t('toasts.verification.approved'), 'success');
            addNotification({ type: NotificationType.VERIFICATION_APPROVED, message: t('notifications.verification_approved'), link: '/verification', userId: userId as number });

            return resp;
        } catch (error) {
            console.error('Failed to approve verification', error);
            addToast(t('toasts.verification.approve_failed'), 'error');
            throw error;
        }
    };

    const rejectVerification = async (userId: string | number) => {
        try {
            // Call admin API to reject the verification
            const resp = await rejectVerificationAPI(userId);

            // Refresh the pending verification requests list from the server
            const pending = await getVerificationReviewAPI();
            setVerificationRequests(pending.filter(u => u.verificationStatus === 'UNDER_REVIEW').map(normalizeVerificationUser));
            setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, verificationStatus: 'Rejected' } : u));
            addToast(t('toasts.verification.rejected'), 'error');
            addNotification({ type: NotificationType.VERIFICATION_REJECTED, message: t('notifications.verification_rejected'), link: '/verification', userId: userId as number });

            return resp;
        } catch (error) {
            console.error('Failed to reject verification', error);
            addToast(t('toasts.verification.reject_failed'), 'error');
            throw error;
        }
    };

    const resolveReport = async (reportId: string) => {
        const updatedReport = await moderationService.updateReportStatus(reportId, 'Resolved');
        setReports(prev => prev.map(r => r.id === reportId ? updatedReport : r));
        addToast(t('toasts.report.resolved'), 'success');
    };

    const dismissReport = async (reportId: string) => {
        const updatedReport = await moderationService.updateReportStatus(reportId, 'Dismissed');
        setReports(prev => prev.map(r => r.id === reportId ? updatedReport : r));
        addToast(t('toasts.report.dismissed'), 'info');
    };

    const approveStory = async (storyId: number) => {
        const updatedStory = await storyService.updateStoryStatus(storyId, SuccessStoryStatus.APPROVED);
        setStorySubmissions(prev => prev.filter(s => s.id !== storyId));
        addToast(t('toasts.story.approved'), 'success');
        addNotification({ type: NotificationType.STORY_APPROVED, message: t('notifications.story_approved'), link: `/success-stories/${storyId}`, userId: 1 });
    };

    const rejectStory = async (storyId: number) => {
        // await storyService.updateStoryStatus(storyId, SuccessStoryStatus.REJECTED);
        setStorySubmissions(prev => prev.filter(s => s.id !== storyId));
        addToast(t('toasts.story.rejected'), 'error');
        addNotification({ type: NotificationType.STORY_REJECTED, message: t('notifications.story_rejected'), link: '/success-stories', userId: 1 });
    };

    const warnUser = (userId: string | number) => {
        const userToWarn = allUsers.find(u => u.id === userId);
        if (userToWarn) addToast(t('toasts.action.warn_user', { name: userToWarn.name }), 'info');
    };

    const suspendUserChat = async (userId: string | number) => {
        const updatedUser = await userService.updateProfile(userId, { chatSuspended: true });
        setAllUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));
        addToast(t('toasts.action.suspend_chat'), 'success');
    };

    const retriggerVerification = (logId: string) => {
        addToast(t('toasts.log.retriggered', { id: logId }), 'info');
    };

    const updateAdminRole = async (userId: string | number, newRole: AdminRole) => {
        const updatedAdmin = await adminService.updateAdminRole(userId, newRole);
        setAdminUsers(prev => prev.map(u => u.id === userId ? updatedAdmin : u));
        addToast(t('toasts.role.updated'), 'success');
    };

    const deleteUsers = async (userIds: (string | number)[]) => {
        // await userService.deleteUsers(userIds);
        setAllUsers(prev => prev.filter(u => !userIds.includes(u.id)));
        if (userIds.length > 1) {
            addToast(t('toasts.users.deleted_bulk', { count: userIds.length.toString() }), 'success');
        } else {
            const deletedUser = allUsers.find(u => u.id === userIds[0]);
            addToast(t('toasts.user.deleted', { name: deletedUser?.name || '' }), 'success');
        }
    };

    const addBulkUsers = async (users: ImportedUser[]) => {
        // In a real app, this would be a single API call
        for (const user of users) {
            await userService.addUser(user.name, user.email, user.role);
        }
        await fetchData(); // Refresh data
        addToast(t('toasts.users.imported', { count: users.length.toString() }), 'success');
    };

    const bulkUpdateUserRole = async (userIds: (string | number)[], role: UserRole) => {
        // In a real app, this would be a single API call
        // await Promise.all(userIds.map(id => userService.updateUser(id, { role })));
        // await fetchData(); // Refresh data
        setAllUsers(prevUsers =>
            prevUsers.map(user =>
                userIds.includes(user.id)
                    ? { ...user, role }
                    : user
            )
        );
        addToast(t('toasts.users.updated_bulk', { count: userIds.length.toString() }), 'success');
    };

    const addUser = async (name: string, email: string, role: UserRole) => {
        const newUser = await userService.addUser(name, email, role);
        setAllUsers(prev => [newUser, ...prev]);
        addToast(t('toasts.user.added', { name }), 'success');
    };

    const updateUser = async (userId: string | number, userData: Partial<Pick<User, 'name' | 'role'>>) => {
        // const updatedUser = await userService.updateUser(userId, userData);
        // console.log('Data ', userData);
        setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, ...userData } : u));
        // console.log(" All Users ", allUsers)
        addToast(t('toasts.user.updated', { name: userData.name }), 'success');
    };


    const getVerificationLogs = async () => {
        try {
            const serviceRequests = await getServiceRequestsAPI();
            console.log('Fetched Service Requests:', serviceRequests);
            setVerificationLogs(serviceRequests['items'] as Array<VerificationLog>);
            // Accept either: an array of logs, or a paginated object with `items`
            if (Array.isArray(serviceRequests)) {
                setVerificationLogs(serviceRequests as Array<VerificationLog>);
            } else if (Array.isArray((serviceRequests as any)?.items)) {
                setVerificationLogs((serviceRequests as any).items as Array<VerificationLog>);
            } else {
                console.warn('Unexpected verification logs shape:', serviceRequests);
            }
            return serviceRequests;
        } catch (err) {
            addToast("Failed to load Service Requests Data.", "error");
            console.error("get Service Requests error:", err);
            throw err;
        }
    };

    return {
        allUsers,
        verificationRequests,
        reports,
        storySubmissions,
        verificationLogs,
        getVerificationLogs,
        adminUsers,
        isLoading,
        approveVerification,
        rejectVerification,
        refreshVerificationRequests,
        resolveReport,
        dismissReport,
        approveStory,
        rejectStory,
        warnUser,
        suspendUserChat,
        retriggerVerification,
        updateAdminRole,
        deleteUsers,
        addBulkUsers,
        bulkUpdateUserRole,
        addUser,
        updateUser,
        initializeUsers: (users: User[]) => setAllUsers(users)
    };
};
