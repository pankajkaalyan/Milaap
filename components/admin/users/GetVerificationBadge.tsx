import { BadgeVariant } from '../../../types';
import BadgeWithTooltip from '../../ui/BadgeWithTooltip';

type UserStatus =
  | 'active'
  | 'inactive'
  | 'deactivated'
  | 'pending'
  | 'suspended'
  | 'deleted'
  | 'approved'
  | 'rejected'
  | 'blocked'
  | 'admin_soft_deleted'
  | 'user_soft_deleted'
  | undefined;

const BADGE_MAP: Record<string, { variant: BadgeVariant; label: string; tooltip: string }> = {
  approved: { variant: BadgeVariant.SUCCESS, label: 'Approved', tooltip: 'User profile has been approved' },
  active: { variant: BadgeVariant.SUCCESS, label: 'Active', tooltip: 'User account is active' },
  inactive: { variant: BadgeVariant.WARNING, label: 'Inactive', tooltip: 'User account is inactive' },
  pending: { variant: BadgeVariant.WARNING, label: 'Pending', tooltip: 'Approval is pending' },
  rejected: { variant: BadgeVariant.DANGER, label: 'Rejected', tooltip: 'User verification was rejected' },
  suspended: { variant: BadgeVariant.DANGER, label: 'Suspended', tooltip: 'Account temporarily suspended' },
  blocked: { variant: BadgeVariant.DANGER, label: 'Blocked', tooltip: 'User has been blocked by admin' },
  admin_soft_deleted: { variant: BadgeVariant.DANGER, label: 'Admin (Soft Deleted)', tooltip: 'Admin account has been soft deleted' },
  user_soft_deleted: { variant: BadgeVariant.DANGER, label: 'User (Soft Deleted)', tooltip: 'User account has been soft deleted' },
  deactivated: { variant: BadgeVariant.WARNING, label: 'Deactivated', tooltip: 'User deactivated their account' },
  deleted: { variant: BadgeVariant.DANGER, label: 'Deleted', tooltip: 'Account permanently deleted' },
};

const getVerificationBadge = (status?: UserStatus) => {
  const normalized = (status || '').toLowerCase();
  const badge = BADGE_MAP[normalized];

  if (!badge) return <BadgeWithTooltip variant={BadgeVariant.INFO} label={"Unknown"} />;

  return <BadgeWithTooltip variant={badge.variant} label={badge.label} tooltip={badge.tooltip} />;
};

export default getVerificationBadge;
