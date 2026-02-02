import React, { useState } from 'react';
import { User, UserRole, BadgeVariant } from '../../../types';
import { useAppContext } from '../../../hooks/useAppContext';
import ArrowUpIcon from '../../icons/ArrowUpIcon';
import ArrowDownIcon from '../../icons/ArrowDownIcon';
import BadgeWithTooltip from '../../ui/BadgeWithTooltip';
import SortUpDownIcon from '../../icons/SortUpDownIcon';
import UserTableRowActions from './UserTableRowActions';
import RejectConfirmModal from './RejectConfirmModal';
import getVerificationBadge from './GetVerificationBadge';
import ProfileLink from '../../ui/ProfileLink';

type SortableKeys =
  | 'name'
  | 'email'
  | 'role'
  | 'createdAt'
  | 'status'
  | 'linkedin'
  | 'socialMedia'
  | 'mobileNumber'; // Added mobileNumber key

export interface ColumnConfig {
  key: SortableKeys;
  label: string;
  sortable?: boolean;
  render?: (user: User) => React.ReactNode;
}

interface UserTableProps {
  users: User[];
  selectedUserIds: Set<string | number>;
  onSelectOne: (userId: string | number) => void;
  onSelectAll: (event: React.ChangeEvent<HTMLInputElement>) => void;
  sortConfig: { key: SortableKeys; direction: 'ascending' | 'descending' } | null;
  onSort: (key: SortableKeys) => void;
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
  onVerify?: (user: User) => void;
  onApprove?: (user: User) => void;
  onReject?: (user: User) => void;
  onActivate?: (user: User) => void;
  columns?: ColumnConfig[];
  rowActions?: {
    key: string;
    label: string;
    onClick: (user: User) => void;
    variant?: 'danger' | 'default';
    visible?: boolean | ((user: User) => boolean);
  }[];
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  selectedUserIds,
  onSelectOne,
  onSelectAll,
  sortConfig,
  onSort,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  onActivate,
  columns,
  rowActions,
  onVerify
}) => {
  const { t } = useAppContext();
  const [rejectUser, setRejectUser] = useState<User | null>(null);

  const getSortIcon = (key: SortableKeys) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <SortUpDownIcon className="h-4 w-4" />;
    }
    return sortConfig.direction === 'ascending' ? (
      <ArrowUpIcon className="h-4 w-4" />
    ) : (
      <ArrowDownIcon className="h-4 w-4" />
    );
  };

  const TableHeader: React.FC<{ column: ColumnConfig }> = ({ column }) => {
    const isSorted = sortConfig && sortConfig.key === column.key;
    return (
      <th className="p-3">
        {column.sortable ? (
          <button
            onClick={() => onSort(column.key)}
            className="flex items-center space-x-1 group"
          >
            <span>{column.label}</span>
            <span
              className={
                isSorted
                  ? 'text-pink-400'
                  : 'text-gray-400 opacity-50 group-hover:opacity-100'
              }
            >
              {getSortIcon(column.key)}
            </span>
          </button>
        ) : (
          column.label
        )}
      </th>
    );
  };

  const LinkCell: React.FC<{ href?: string }> = ({ href }) =>
    href ? (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-pink-400 hover:underline break-all"
      >
        Open
      </a>
    ) : (
      <span className="text-gray-500 italic">—</span>
    );

  // Default columns configuration
  const defaultColumns: ColumnConfig[] = [
    { key: 'name', label: t('admin.users.table.name'), sortable: true, render: (user) => <ProfileLink userId={user.id} userName={user.name} className="text-pink-400 hover:underline">Open</ProfileLink> },
    { key: 'email', label: t('admin.users.table.email'), sortable: true },
    {
      key: 'mobileNumber',
      label: 'Mobile',
      sortable: true,
      render: (user) => user.mobileNumber || <span className="text-gray-500 italic">—</span>,
    },
    {
      key: 'role',
      label: t('admin.users.table.role'),
      sortable: true,
      render: (user) => (
        <BadgeWithTooltip
          variant={user.role === UserRole.ADMIN ? BadgeVariant.PRIMARY : BadgeVariant.INFO}
          label={user.role}
        />
      ),
    },
    {
      key: 'linkedin',
      label: 'LinkedIn',
      render: (user) => <LinkCell href={user.linkedin} />,
    },
    {
      key: 'socialMedia',
      label: 'Social Media',
      render: (user) => <LinkCell href={user.socialMedia} />,
    },
    {
      key: 'status',
      label: t('admin.users.table.status'),
      sortable: true,
      render: (user) => getVerificationBadge(user.status),
    },
    {
      key: 'createdAt',
      label: t('admin.users.table.joined'),
      sortable: true,
      render: (user) => new Date(user.createdAt).toLocaleDateString(),
    },
  ];

  const tableColumns = columns || defaultColumns;

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-gray-300">
          <thead className="bg-white/10">
            <tr>
              <th className="p-3 w-4">
                <input
                  type="checkbox"
                  onChange={onSelectAll}
                  checked={selectedUserIds.size === users.length && users.length > 0}
                />
              </th>
              {tableColumns.map((col) => (
                <TableHeader key={col.key} column={col} />
              ))}
              <th className="p-3 text-right">{t('admin.users.table.actions')}</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user, index) => (
              <tr
                key={user.id}
                className="border-b border-gray-700 hover:bg-white/5"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="p-3">
                  <input
                    type="checkbox"
                    onChange={() => onSelectOne(user.id)}
                    checked={selectedUserIds.has(user.id)}
                  />
                </td>

                {tableColumns.map((col) => (
                  <td key={col.key} className="p-3">
                    {col.render ? col.render(user) : (user as any)[col.key]}
                  </td>
                ))}

                {/* Note: UserTableRowActions must wrap its content in a <td> 
                   to avoid the "<div> cannot appear as a child of <tr>" warning.
                */}
                <UserTableRowActions
                  user={user}
                  actions={
                    rowActions || [
                      { key: 'edit', label: 'Edit', onClick: onEdit! },
                      {
                        key: 'delete',
                        label: 'Soft Delete',
                        onClick: onDelete!,
                        variant: 'danger',
                        visible: (user: User) => user.status.toLowerCase() === 'approved', // hide if ACTIVE
                      },
                      {
                        key: 'activate',
                        label: 'Activate',
                        onClick: onActivate!,
                        variant: 'default',
                        visible: (user: User) => user.status.toLowerCase() === 'admin_soft_deleted', // show if NOT ACTIVE
                      },
                      {
                        key: 'verify',
                        label: 'Verify',
                        onClick: onVerify!,
                        variant: 'default',
                        visible: (user: User) => (!user.isVerified && user.status.toLowerCase() === 'approved'), // show if not verified and status is admin_soft_deleted
                      },
                    ]
                  }
                />
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Reject Modal */}
      {rejectUser && onReject && (
        <RejectConfirmModal
          user={rejectUser}
          onClose={() => setRejectUser(null)}
          onConfirm={() => {
            onReject(rejectUser);
            setRejectUser(null);
          }}
        />
      )}
    </>
  );
};

export default UserTable;