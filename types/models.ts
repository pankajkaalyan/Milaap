import { AdminRole, InterestStatus, MembershipPlan, MessageStatus, MessageType, NotificationType, SuccessStoryStatus, UserRole } from './enums';

export interface HoroscopeDetails {
  nakshatra: string; // Birth Star
  rashi: string; // Moon Sign
  gotra: string; // Clan name
  mangalDosha: 'Yes' | 'No' | 'Partial';
}

export interface FamilyDetails {
  fatherName: string;
  motherName: string;
  siblings: string; // e.g., "1 elder brother, 1 younger sister"
  familyValues: 'Traditional' | 'Moderate' | 'Liberal';
}

export type VerificationStatus = 'Not Verified' | 'Pending' | 'Verified';

export interface NotificationSettings {
  push: {
    newMatch: boolean;
    newMessage: boolean;
    profileView: boolean;
  };
  email: {
    newMatch: boolean;
    newMessage: boolean;
    weeklyDigest: boolean;
  };
  sms: {
    newMessage: boolean;
  };
}

export interface PartnerPreferences {
  ageRange?: { min?: number; max?: number };
  heightRange?: { min?: number; max?: number };
  castes?: string[];
  professions?: string[];
  mangalDosha?: 'Yes' | 'No' | 'Any';
}


export interface UserProfile {
  fullName?: string;
  email?: string;
  contactNumber?: number | null;
  password?: string;
  dob?: string; // Date of Birth in ISO format
  timeOfBirth?: string; // Time of Birth in HH:MM format
  heightInCm?: number;
  highestEducation?: string;
  gender?: 'Male' | 'Female' | '';
  caste?: string;
  subCaste?: string;
  profession?: string;
  horoscope?: HoroscopeDetails;
  photos?: string[]; // Array of base64 strings or URLs
  video?: string; // base64 string
  audio?: string; // base64 string
  familyDetails?: FamilyDetails;
  about?: string;
  verificationStatus?: VerificationStatus;
  blockedUsers?: string[];
  phoneNumber?: string;
  notificationSettings?: NotificationSettings;
  latitude?: number;
  longitude?: number;
  membership?: MembershipPlan;
  chatSuspended?: boolean;
  partnerPreferences?: PartnerPreferences;
  profileVisibility?: 'all' | 'premium';
  contactVisibility?: 'accepted' | 'premium';
  status?: 'active' | 'deactivated';
  location?: string;
  interestShown?: InterestShown;
  isFavourite?: boolean;
  isBlocked?: boolean;
  isVerified?: boolean;
  age?: number;
}

export interface User {
  id: string | number;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  profile?: UserProfile;
  adminRole?: AdminRole;
  age?: number;
}

export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface Match extends UserProfile {
  id: string | number;
  name: string;
  age?: number;
  location?: string;
  compatibilityScore?: number;
  photos?: string[];
}

export interface Message {
  id: string | number;
  senderId: number | 'me' | string;
  content: string;
  type: MessageType;
  timestamp: string;
  status: MessageStatus;
}

export interface Conversation {
  userId: string | number;
  userName: string;
  messages: Message[];
}

export interface AdminConversation {
  id: string;
  participants: [Match, Match];
  messages: Message[];
  isFlagged?: boolean;
}

export interface SuccessStory {
  id: number;
  coupleNames: string;
  weddingDate: string;
  imageUrl: string;
  story: string;
  status?: SuccessStoryStatus;
}

export interface Report {
  id: string;
  reporterId: string | number;
  reporterName?: string;
  reportedUserId: string | number;
  reportedUserName?: string;
  reason: string;
  details: string;
  timestamp: string;
  status: 'Pending' | 'Resolved' | 'Dismissed';
}

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  link: string;
  isRead: boolean;
  timestamp: string;
  userId?: number;
  userName?: string;
}

export interface AIMatchSuggestion {
  userId: number;
  reason: string;
}

export interface AIKundliReport {
  overallCompatibility: string;
  compatibilityScore: number;
  positiveAspects: string[];
  potentialChallenges: string[];
  spiritualGuidance: string;
}

export interface VerificationLog {
  id: string;
  userId: string | number;
  userName: string;
  type: 'EMAIL' | 'OTP';
  status: 'Success' | 'Failed' | 'Pending';
  timestamp: string;
}

export interface AdminUser {
  id: string | number;
  name: string;
  email: string;
  role: AdminRole;
}

export interface AdminAnalyticsData {
  keyMetrics: {
    newRegistrations: number;
    activeUsers: number;
    matchesMade: number;
    messagesSent: number;
  };
  registrationsLast7Days: { day: string; count: number }[];
}

export interface Interest {
  id: number;
  senderId: number;
  status: InterestStatus;
  timestamp: string;
  recipientId: number;
  message?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserInterest {
  id: number;
  createdAt: string;
  direction: string;
  message: string;
  recipientId: number;
  senderId: number;
  status: InterestStatus;
  updatedAt: string;
  profile: InterestUserProfile;
  interestRequestId?: number;
}

export interface InterestUserProfile {
  id: number;
  fullName: string;
  age: number;
  caste: string;
  profession: string;
  city: string;
  heigherEducation: string;
  photos: string;
}

export interface Interests {
  sent: UserInterest[];
  received: UserInterest[];
}

export interface InterestShown {
  interestRequestId: number;
  isMutual: boolean;
  isSent: boolean;
  status: string;
}

export interface ChatHistory {
  sender: string;
  text: string;
}