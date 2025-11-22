import React from 'react';
import Input from '../../ui/Input';
import Dropdown from '../../ui/Dropdown';
import { UserRole } from '../../../types';
import { useAppContext } from '../../../hooks/useAppContext';

interface UserTableFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  roleFilter: 'ALL' | UserRole;
  onRoleChange: (value: 'ALL' | UserRole) => void;
}

const UserTableFilters: React.FC<UserTableFiltersProps> = ({ searchTerm, onSearchChange, roleFilter, onRoleChange }) => {
  const { t } = useAppContext();

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-4">
      <div className="flex-grow">
        <Input
          id="search"
          label=""
          type="text"
          placeholder={t('admin.users.search')}
          value={searchTerm}
          hideinfo="true"
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="w-full md:w-auto">
        <Dropdown
          id="roleFilter"
          ariaLabel={t('admin.users.filter.role')}
          value={roleFilter}
          onChange={(value) => onRoleChange(value as 'ALL' | UserRole)}
          options={[
            { value: 'ALL', label: t('admin.users.filter.all') },
            { value: UserRole.ADMIN, label: 'Admin' },
            { value: UserRole.CUSTOMER, label: 'Customer' },
          ]}
        />
      </div>
    </div>
  );
};

export default UserTableFilters;