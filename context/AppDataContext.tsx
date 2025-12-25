import React, { createContext, ReactNode } from 'react';
import { 
    AdminRole, MembershipPlan, Notification, UserRole, User, UserProfile,
    Match, SuccessStory, Report, AIKundliReport, 
    AIMatchSuggestion, VerificationLog, AdminUser, Interest, 
    Interests,
    ImportedUser
} from '../types';

import { useAuthContext } from '../hooks/useAuthContext';
import { useUIContext } from '../hooks/useUIContext';

import { useNotifications } from '../hooks/useNotifications';
import { useAdminActions } from '../hooks/useAdminActions';
import { useAIFeatures } from '../hooks/useAIFeatures';
import { useFavourites } from '../hooks/interactions/useFavourites';
import { useInterests } from '../hooks/interactions/useInterests';
import { useSuccessStories } from '../hooks/interactions/useSuccessStories';
import { useProfileActions } from '../hooks/actions/useProfileActions';

export interface AppDataContextType {
  // from useNotifications
  notifications: Notification[];
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;
  getNotifications: () => void;

  
  // from useFavourites
  favourites: Match[];
  toggleFavourite: (match: Match) => void;
  
  // from useInterests
  interests: Interests;
  setInterests: React.Dispatch<React.SetStateAction<Interests>>;
  expressInterest: (targetUserId: string | number, targetName: string, message?: string) => void;
  acceptInterest: (interestId: string | number, targetUserId: string | number, senderName: string) => void;
  declineInterest: (interestId: string | number, targetUserId: string | number, senderName: string) => void;

  // from useSuccessStories
  allSuccessStories: SuccessStory[];
  setAllSuccessStories: React.Dispatch<React.SetStateAction<SuccessStory[]>>;
  submitSuccessStory: (storyData: Omit<SuccessStory, 'id' | 'imageUrl' | 'status'> & { couplePhoto?: File }) => void;
  
  // from useProfileActions
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<void>;
  submitVerification: (file: File) => Promise<void>;
  verifyProfileWithAI: (idDocument: File) => Promise<void>;
  upgradePlan: (plan: MembershipPlan) => Promise<void>;
  toggleBlockUser: (userId: string | number, userName: string, isBlocked: boolean) => Promise<void>;
  reportUser: (userId: string | number, reason: string, details: string, userName: string) => void;
  deactivateAccount: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  
  // from useAIFeatures
  aiSuggestions: AIMatchSuggestion[];
  isFetchingAISuggestions: boolean;
  fetchAISuggestions: () => Promise<void>;
  kundliReports: Record<string, AIKundliReport | 'loading' | 'error'>;
  fetchAIKundliReport: (targetUserId: string | number) => Promise<void>;
  
  // from useAdminActions
  allUsers: User[];
  verificationRequests: User[];
  reports: Report[];
  storySubmissions: SuccessStory[];
  verificationLogs: VerificationLog[];
  adminUsers: AdminUser[];
  approveVerification: (userId: string | number) => void;
  rejectVerification: (userId: string | number) => void;
  // Refresh pending verification requests
  refreshVerificationRequests: () => Promise<void>;
  resolveReport: (reportId: string) => void;
  dismissReport: (reportId: string) => void;
  approveStory: (storyId: number) => void;
  rejectStory: (storyId: number) => void;
  warnUser: (userId: string | number) => void;
  suspendUserChat: (userId: string | number) => void;
  retriggerVerification: (logId: string) => void;
  updateAdminRole: (userId: string | number, newRole: AdminRole) => void;
  deleteUsers: (userIds: (string | number)[]) => void;
  addBulkUsers: (users: ImportedUser[]) => void;
  bulkUpdateUserRole: (userIds: (string | number)[], role: UserRole) => void;
  addUser: (name: string, email: string, role: UserRole) => void;
  updateUser: (userId: string | number, userData: Partial<Pick<User, 'name' | 'role'>>) => void;
  initializeUsers: (users: User[]) => void;
}

export const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export const AppDataContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, updateCurrentUser, logout } = useAuthContext();
  const { t, addToast } = useUIContext();
  
  // These hooks manage interactions and data fetching.
  const interestsHook = useInterests(user, t, addToast);
  const favouritesHook = useFavourites(user, t, addToast);
  const successStoriesHook = useSuccessStories(t, addToast);
  const profileActionsHook = useProfileActions(user, updateCurrentUser, t, addToast, logout);
  const aiFeatures = useAIFeatures(user, t, addToast);
  
  // Notifications hook needs `setInterests` to simulate new interests arriving.
  const notificationsHook = useNotifications(
    user, 
    t, 
    interestsHook.setInterests,
    addToast
  );

  // Admin hook needs `addNotification` to send alerts on actions.
  const adminActionsHook = useAdminActions(
    t, 
    addToast, 
    notificationsHook.addNotification as (notification: Omit<Notification, 'id' | 'isRead' | 'timestamp'>) => void
  );
  
  const contextValue: AppDataContextType = {
    ...notificationsHook,
    ...favouritesHook,
    ...interestsHook,
    ...successStoriesHook,
    ...profileActionsHook,
    ...aiFeatures,
    ...adminActionsHook,
  };

  return <AppDataContext.Provider value={contextValue}>{children}</AppDataContext.Provider>;
};