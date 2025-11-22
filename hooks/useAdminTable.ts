import { useState, useMemo, useCallback } from 'react';
import { User, UserRole } from '../types';

const ITEMS_PER_PAGE = 10;
type SortableKeys = 'name' | 'email' | 'role' | 'createdAt';

export const useAdminTable = (initialUsers: User[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | UserRole>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: SortableKeys; direction: 'ascending' | 'descending' } | null>({ key: 'createdAt', direction: 'descending' });
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string | number>>(new Set());

  const filteredUsers = useMemo(() => {
    // console.log('Filtering users with searchTerm:', searchTerm, 'and roleFilter:', roleFilter);
    // console.log('Initial users:', initialUsers);
    return initialUsers.filter(user => {
        // console.log('Checking user:', user);
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
        return matchesSearch && matchesRole;
      });
  }, [initialUsers, searchTerm, roleFilter]);

  const sortedUsers = useMemo(() => {
    let sortableUsers = [...filteredUsers];
    if (sortConfig !== null) {
      sortableUsers.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableUsers;
  }, [filteredUsers, sortConfig]);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedUsers.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedUsers, currentPage]);

  const totalPages = Math.ceil(sortedUsers.length / ITEMS_PER_PAGE);

  const requestSort = (key: SortableKeys) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };
  
  const handleSelectOne = (userId: string | number) => {
    setSelectedUserIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedUserIds(new Set(paginatedUsers.map(u => u.id)));
    } else {
      setSelectedUserIds(new Set());
    }
  };

  const getPaginationGroup = useCallback(() => {
    let start = Math.floor((currentPage - 1) / 5) * 5;
    return new Array(Math.min(5, totalPages - start)).fill(0).map((_, idx) => start + idx + 1);
  }, [currentPage, totalPages]);
  
  const resetSelection = () => setSelectedUserIds(new Set());

  return {
    // State
    searchTerm,
    setSearchTerm,
    roleFilter,
    setRoleFilter,
    currentPage,
    setCurrentPage,
    sortConfig,
    selectedUserIds,
    setSelectedUserIds,
    // Derived Data
    paginatedUsers,
    totalPages,
    // Methods
    requestSort,
    handleSelectOne,
    handleSelectAll,
    getPaginationGroup,
    resetSelection,
  };
};
