export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
  ROLE_USER = 'ROLE_USER', // For future use with OAuth
}

export enum AdminRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  MODERATOR = 'MODERATOR',
}

export enum MembershipPlan {
  FREE = 'FREE',
  PREMIUM = 'PREMIUM',
  PREMIUM_PLUS = 'PREMIUM_PLUS',
}

// UI Component Enums
export enum ButtonVariant {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  TERTIARY = 'tertiary',
}

export enum ModalSize {
  SM = 'sm',
  MD = 'md',
  LG = 'lg',
  XL = 'xl',
  XXL = '2xl',
  XXXL = '3xl',
}

export enum ModalVariant {
  DEFAULT = 'default',
  LIGHTBOX = 'lightbox',
}

export enum SpinnerSize {
  SM = 'sm',
  MD = 'md',
  LG = 'lg',
}

export enum DropdownSize {
  NORMAL = 'normal',
  SMALL = 'small',
}

export enum BadgeVariant {
  SUCCESS = 'success',
  DANGER = 'danger',
  WARNING = 'warning',
  INFO = 'info',
  PRIMARY = 'primary',
  PREMIUM = 'premium',
}

// Feature-specific Enums
export enum SuccessStoryStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
}

export enum ProfileTab {
  OVERVIEW = 'overview',
  DETAILS = 'details',
  GALLERY = 'gallery',
}

export enum ModerationCardIcon {
  VERIFICATION = 'verification',
  REPORT = 'report',
  STORY = 'story',
}

export enum InterestTab {
  RECEIVED = 'received',
  SENT = 'sent',
}

export enum SupportChatMode {
  AI = 'ai',
  HUMAN = 'human',
}

export enum MediaPlayerType {
  AUDIO = 'audio',
  VIDEO = 'video',
}

export enum AdState {
  PLAYING = 'playing',
  FINISHED = 'finished',
}

export enum MessageStatus {
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
}

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  AUDIO = 'audio',
  VIDEO = 'video',
}

export enum NotificationType {
  NEW_MATCH = 'NEW_MATCH',
  NEW_MESSAGE = 'NEW_MESSAGE',
  PROFILE_VIEW = 'PROFILE_VIEW',
  INTEREST_RECEIVED = 'INTEREST_RECEIVED',
  INTEREST_ACCEPTED = 'INTEREST_ACCEPTED',
  // Admin -> Admin notifications
  ADMIN_NEW_VERIFICATION = 'ADMIN_NEW_VERIFICATION',
  ADMIN_NEW_REPORT = 'ADMIN_NEW_REPORT',
  ADMIN_NEW_STORY = 'ADMIN_NEW_STORY',
  // Admin -> User notifications
  VERIFICATION_APPROVED = 'VERIFICATION_APPROVED',
  VERIFICATION_REJECTED = 'VERIFICATION_REJECTED',
  STORY_APPROVED = 'STORY_APPROVED',
  STORY_REJECTED = 'STORY_REJECTED',
}

export enum InterestStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
  NONE = 'NONE',
}


export enum AppEventStatus {
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
  EXPRESS_INTEREST = 'EXPRESS_INTEREST',
  NONE = 'NONE',
  FAVOURITE = 'FAVOURITE',
}
