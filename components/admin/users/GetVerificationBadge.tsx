import Badge from '../../ui/Badge';
import { BadgeVariant } from '../../../types';

type UserStatus =
  | 'active'
  | 'inactive'
  | 'deactivated'
  | 'pending'
  | 'suspended'
  | 'deleted'
  | 'approved'
  | 'rejected'
  | undefined;

const getVerificationBadge = (status?: UserStatus) => {
  const normalizedStatus = status?.toLowerCase();

  const badgeMap: Record<string, { variant: BadgeVariant; label: string }> = {
    approved: { variant: BadgeVariant.SUCCESS, label: 'Approved' },
    active: { variant: BadgeVariant.SUCCESS, label: 'Active' },
    inactive: { variant: BadgeVariant.WARNING, label: 'Inactive' },
    pending: { variant: BadgeVariant.WARNING, label: 'Pending' },
    rejected: { variant: BadgeVariant.DANGER, label: 'Rejected' },
    suspended: { variant: BadgeVariant.DANGER, label: 'Suspended' },
    deactivated: { variant: BadgeVariant.WARNING, label: 'Deactivated' },
    deleted: { variant: BadgeVariant.DANGER, label: 'Deleted' },
  };

  const badge = normalizedStatus ? badgeMap[normalizedStatus] : undefined;

  return badge ? (
    <Badge variant={badge.variant}>{badge.label}</Badge>
  ) : (
    <Badge variant={BadgeVariant.INFO}>Unknown</Badge>
  );
};

export default getVerificationBadge;
