import React from 'react';
import { UserRole } from '@/types';

interface UserTableFiltersProps {
  /** Search */
  searchTerm: string;
  onSearchChange: (value: string) => void;

  /** Role filter (optional) */
  roleFilter?: 'ALL' | UserRole;
  onRoleChange?: (value: 'ALL' | UserRole) => void;

  /** Controls visibility of role dropdown (hidden by default) */
  showRoleFilter?: boolean;
}

const UserTableFilters: React.FC<UserTableFiltersProps> = ({
  searchTerm,
  onSearchChange,
  roleFilter = 'ALL',
  onRoleChange,
  showRoleFilter = false,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-4 mb-4">
      {/* 🔍 Search */}
      <div className="flex-1 min-w-[220px]">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="
            w-full px-3 py-2 text-sm
            text-gray-300
            border border-gray-700 rounded-md
            bg-white/5
            placeholder-gray-500
            focus:outline-none
            focus:ring-2 focus:ring-pink-400
          "
        />
      </div>

      {/* 🎭 Role Filter */}
      {showRoleFilter && onRoleChange && (
        <div className="min-w-[180px]">
          <select
            value={roleFilter}
            onChange={(e) =>
              onRoleChange(e.target.value as 'ALL' | UserRole)
            }
            className="
              w-full px-3 py-2 text-sm
              text-gray-300
              border border-gray-700 rounded-md
              bg-white/5
              focus:outline-none
              focus:ring-2 focus:ring-pink-400
            "
          >
            <option value="ALL" className="bg-gray-900 text-gray-300">
              All Roles
            </option>
            <option value={UserRole.ADMIN} className="bg-gray-900 text-gray-300">
              Admin
            </option>
            <option value={UserRole.CUSTOMER} className="bg-gray-900 text-gray-300">
              Customer
            </option>
          </select>
        </div>
      )}
    </div>
  );
};

export default UserTableFilters;
