import React from 'react';
import { User, UserRole, BadgeVariant } from '../../../types';
import { useAppContext } from '../../../hooks/useAppContext';
import ArrowUpIcon from '../../icons/ArrowUpIcon';
import ArrowDownIcon from '../../icons/ArrowDownIcon';
import Badge from '../../ui/Badge';
import SortUpDownIcon from '../../icons/SortUpDownIcon';
import UserTableRowActions from './UserTableRowActions';

type SortableKeys = 'name' | 'email' | 'role' | 'createdAt';

interface UserTableProps {
  users: User[];
  selectedUserIds: Set<string | number>;
  onSelectOne: (userId: string | number) => void;
  onSelectAll: (event: React.ChangeEvent<HTMLInputElement>) => void;
  sortConfig: { key: SortableKeys; direction: 'ascending' | 'descending' } | null;
  onSort: (key: SortableKeys) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

const UserTable: React.FC<UserTableProps> = ({
  users, selectedUserIds, onSelectOne, onSelectAll, sortConfig, onSort, onEdit, onDelete
}) => {
  const { t } = useAppContext();

  const getSortIcon = (key: SortableKeys) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <SortUpDownIcon className="h-4 w-4" />; // Neutral icon for unsorted state
    }
    return sortConfig.direction === 'ascending'
      ? <ArrowUpIcon className="h-4 w-4" />
      : <ArrowDownIcon className="h-4 w-4" />;
  };

  const getStatusBadge = (status?: 'active' | 'deactivated') => {
      if (status === 'deactivated') {
          return <Badge variant={BadgeVariant.WARNING}>Deactivated</Badge>;
      }
      return <Badge variant={BadgeVariant.SUCCESS}>Active</Badge>;
  };

  const TableHeader: React.FC<{ sortKey: SortableKeys; label: string }> = ({ sortKey, label }) => {
    const isSorted = sortConfig && sortConfig.key === sortKey;
    return (
      <th className="p-3">
        <button onClick={() => onSort(sortKey)} className="flex items-center space-x-1 group">
          <span>{label}</span>
          <span className={isSorted ? 'text-pink-400' : 'text-gray-400 opacity-50 group-hover:opacity-100 transition-opacity'}>
            {getSortIcon(sortKey)}
          </span>
        </button>
      </th>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-gray-300">
        <thead className="bg-white/10">
          <tr>
            <th className="p-3 w-4">
              <input
                type="checkbox"
                onChange={onSelectAll}
                checked={selectedUserIds.size === users.length && users.length > 0}
                className="form-checkbox h-4 w-4 text-pink-600 bg-gray-700 border-gray-600 rounded focus:ring-pink-500"
              />
            </th>
            <TableHeader sortKey="name" label={t('admin.users.table.name')} />
            <TableHeader sortKey="email" label={t('admin.users.table.email')} />
            <TableHeader sortKey="role" label={t('admin.users.table.role')} />
            <th className="p-3">Status</th>
            <TableHeader sortKey="createdAt" label={t('admin.users.table.joined')} />
            <th className="p-3 text-right">{t('admin.users.table.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr
              key={user.id}
              className={`border-b border-gray-700 hover:bg-white/5 ${selectedUserIds.has(user.id) ? 'bg-white/10' : ''} animate-fade-in-up`}
              style={{ animationDelay: `${index * 50}ms`}}
            >
              <td className="p-3 w-4">
                <input
                  type="checkbox"
                  onChange={() => onSelectOne(user.id)}
                  checked={selectedUserIds.has(user.id)}
                  className="form-checkbox h-4 w-4 text-pink-600 bg-gray-700 border-gray-600 rounded focus:ring-pink-500"
                />
              </td>
              <td className="p-3">{user.name}</td>
              <td className="p-3">{user.email}</td>
              <td className="p-3">
                <Badge variant={user.role === UserRole.ADMIN ? BadgeVariant.PRIMARY : BadgeVariant.INFO}>
                  {user.role}
                </Badge>
              </td>
              <td className="p-3">
                {getStatusBadge(user.profile?.status)}
              </td>
              <td className="p-3">{new Date(user.createdAt).toLocaleDateString()}</td>
              <td className="p-3">
                <div className="flex justify-end">
                  <UserTableRowActions user={user} onEdit={onEdit} onDelete={onDelete} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;