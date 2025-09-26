
import { useState, useEffect } from 'react';
import { User, Report, SuccessStory, VerificationLog, AdminUser, AdminRole, UserRole, NotificationType, Notification, SuccessStoryStatus } from '../types';
import { userService } from '../services/api/userService';
import { moderationService } from '../services/api/moderationService';
import { storyService } from '../services/api/storyService';
import { adminService } from '../services/api/adminService';

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
            setVerificationLogs(logsData);
            setAdminUsers(adminUsersData);
        } catch (error) {
            addToast("Failed to load admin data.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        setVerificationRequests(allUsers.filter(u => u.profile?.verificationStatus === 'Pending'));
    }, [allUsers]);

    const approveVerification = async (userId: string | number) => {
        const updatedUser = await userService.updateProfile(userId, { verificationStatus: 'Verified' });
        setAllUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));
        addToast(t('toasts.verification.approved'), 'success');
        addNotification({ type: NotificationType.VERIFICATION_APPROVED, message: t('notifications.verification_approved'), link: '/verification', userId: userId as number });
    };

    const rejectVerification = async (userId: string | number) => {
        const updatedUser = await userService.updateProfile(userId, { verificationStatus: 'Not Verified' });
        setAllUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));
        addToast(t('toasts.verification.rejected'), 'error');
        addNotification({ type: NotificationType.VERIFICATION_REJECTED, message: t('notifications.verification_rejected'), link: '/verification', userId: userId as number });
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
        await storyService.updateStoryStatus(storyId, SuccessStoryStatus.REJECTED);
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
        await userService.deleteUsers(userIds);
        setAllUsers(prev => prev.filter(u => !userIds.includes(u.id)));
        if (userIds.length > 1) {
            addToast(t('toasts.users.deleted_bulk', { count: userIds.length.toString() }), 'success');
        } else {
            const deletedUser = allUsers.find(u => u.id === userIds[0]);
            addToast(t('toasts.user.deleted', { name: deletedUser?.name || '' }), 'success');
        }
    };
    
    const addBulkUsers = async (users: User[]) => {
        // In a real app, this would be a single API call
        for (const user of users) {
            await userService.addUser(user.name, user.email, user.role);
        }
        await fetchData(); // Refresh data
        addToast(t('toasts.users.imported', { count: users.length.toString() }), 'success');
    };

    const bulkUpdateUserRole = async (userIds: (string | number)[], role: UserRole) => {
        // In a real app, this would be a single API call
        await Promise.all(userIds.map(id => userService.updateUser(id, { role })));
        await fetchData(); // Refresh data
        addToast(t('toasts.users.updated_bulk', { count: userIds.length.toString() }), 'success');
    };

    const addUser = async (name: string, email: string, role: UserRole) => {
        const newUser = await userService.addUser(name, email, role);
        setAllUsers(prev => [newUser, ...prev]);
        addToast(t('toasts.user.added', { name }), 'success');
    };

    const updateUser = async (userId: string | number, userData: Partial<Pick<User, 'name' | 'role'>>) => {
        const updatedUser = await userService.updateUser(userId, userData);
        setAllUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));
        addToast(t('toasts.user.updated', { name: updatedUser.name }), 'success');
    };

    return {
        allUsers,
        verificationRequests,
        reports,
        storySubmissions,
        verificationLogs,
        adminUsers,
        isLoading,
        approveVerification,
        rejectVerification,
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
    };
};
