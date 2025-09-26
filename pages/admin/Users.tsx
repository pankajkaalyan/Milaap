import React, { useRef } from 'react';
import { User, UserRole } from '../../types';
import { useAppContext } from '../../hooks/useAppContext';
import Card from '../../components/ui/Card';
import { useAdminTable } from '../../hooks/useAdminTable';
import UserTableActions from '../../components/admin/users/UserTableActions';
import UserTableFilters from '../../components/admin/users/UserTableFilters';
import BulkActionsMenu from '../../components/admin/users/BulkActionsMenu';
import UserTable from '../../components/admin/users/UserTable';
import Pagination from '../../components/ui/Pagination';
import { useUserManagementModals } from '../../hooks/useUserManagementModals';
import UserModals from '../../components/admin/users/UserModals';

const AdminUsers: React.FC = () => {
  const { allUsers, deleteUsers, addBulkUsers, bulkUpdateUserRole, addUser, updateUser } = useAppContext();
  
  const {
    searchTerm, setSearchTerm, roleFilter, setRoleFilter, currentPage, setCurrentPage,
    sortConfig, selectedUserIds, paginatedUsers, totalPages,
    requestSort, handleSelectOne, handleSelectAll, getPaginationGroup, resetSelection,
  } = useAdminTable(allUsers);

  const {
    activeModal, modalData, openAddModal, openEditModal, openDeleteModal, closeModal,
  } = useUserManagementModals();
  
  const importFileRef = useRef<HTMLInputElement>(null);

  const handleAddNewUser = (name: string, email: string, role: UserRole) => {
    addUser(name, email, role);
    closeModal();
  };

  const handleUpdateUser = (userId: string | number, userData: Partial<Pick<User, 'name' | 'role'>>) => {
    updateUser(userId, userData);
    closeModal();
  };
  
  const handleDeleteConfirm = (userIds: (string | number)[]) => {
    deleteUsers(userIds);
    resetSelection();
    closeModal();
  };

  const handleBulkDelete = () => {
    const users = allUsers.filter(u => selectedUserIds.has(u.id));
    openDeleteModal(users);
  };

  const handleBulkRoleChange = (role: UserRole) => {
    bulkUpdateUserRole(Array.from(selectedUserIds), role);
    resetSelection();
  };

  const handleExport = () => {
    const headers = ["id", "name", "email", "role", "createdAt", "verificationStatus"];
    const csvRows = [
        headers.join(','),
        ...allUsers.map(user => 
            [
                user.id,
                `"${user.name.replace(/"/g, '""')}"`,
                user.email,
                user.role,
                user.createdAt,
                user.profile?.verificationStatus || 'Not Verified'
            ].join(',')
        )
    ];
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'milaap-users.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        const text = event.target?.result as string;
        const rows = text.split('\n').slice(1);
        const newUsers: User[] = rows
            .map(row => {
                const [name, email, role] = row.split(',');
                if (name && email && role) {
                    const newUser: User = {
                        id: `imported-${Date.now()}-${Math.random()}`,
                        name: name.trim(),
                        email: email.trim(),
                        role: role.trim().toUpperCase() as UserRole,
                        createdAt: new Date().toISOString(),
                        profile: { verificationStatus: 'Not Verified' }
                    };
                    return newUser;
                }
                return null;
            })
            .filter((user): user is User => user !== null);
        
        addBulkUsers(newUsers);
    };
    reader.readAsText(file);
    if (importFileRef.current) importFileRef.current.value = "";
  };
  
  return (
    <>
      <Card>
        <input type="file" ref={importFileRef} onChange={handleImport} accept=".csv" className="hidden" />
        <UserTableActions 
            onImportClick={() => importFileRef.current?.click()}
            onExportClick={handleExport}
            onAddUserClick={openAddModal}
        />
        <UserTableFilters
            searchTerm={searchTerm}
            onSearchChange={(value) => { setSearchTerm(value); setCurrentPage(1); }}
            roleFilter={roleFilter}
            onRoleChange={(value) => { setRoleFilter(value as 'ALL' | UserRole); setCurrentPage(1); }}
        />
        <BulkActionsMenu 
            selectedCount={selectedUserIds.size}
            onDelete={handleBulkDelete}
            onChangeRole={handleBulkRoleChange}
        />
        <UserTable
            users={paginatedUsers}
            selectedUserIds={selectedUserIds}
            onSelectOne={handleSelectOne}
            onSelectAll={handleSelectAll}
            sortConfig={sortConfig}
            onSort={requestSort}
            onEdit={openEditModal}
            onDelete={(user) => openDeleteModal([user])}
        />
        <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            paginationGroup={getPaginationGroup()}
        />
      </Card>
      
      <UserModals
        activeModal={activeModal}
        modalData={modalData}
        onClose={closeModal}
        onAddUser={handleAddNewUser}
        onUpdateUser={handleUpdateUser}
        onDeleteConfirm={handleDeleteConfirm}
      />
    </>
  );
};

export default AdminUsers;