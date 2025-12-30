import React, { useEffect, useRef } from 'react';
import { ImportedUser, User, UserRole } from '../../types';
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
import { getAdminUsersList, roleChangeApi, updateUserApi, userDeleteApi } from '@/services/api/admin';

const AdminUsers: React.FC = () => {
    const { allUsers, deleteUsers, addBulkUsers, bulkUpdateUserRole, addUser, updateUser, initializeUsers } = useAppContext();

    const {
        searchTerm, setSearchTerm, roleFilter, setRoleFilter, currentPage, setCurrentPage,
        sortConfig, selectedUserIds, paginatedUsers, totalPages,
        requestSort, handleSelectOne, handleSelectAll, getPaginationGroup, resetSelection,
    } = useAdminTable(allUsers);

    const {
        activeModal, modalData, openAddModal, openEditModal, openDeleteModal, closeModal,
    } = useUserManagementModals();

    const importFileRef = useRef<HTMLInputElement>(null);

    // -------------------------
    // ✨ ADD USER
    // -------------------------
    const handleAddNewUser = (name: string, email: string, role: UserRole) => {
        addUser(name, email, role);
        closeModal();
    };

    // -------------------------
    // ✨ UPDATE USER
    // -------------------------
    const handleUpdateUser = (userId: string | number, userData: Partial<User>) => {
        updateUserApi(userId, userData)
            .then((res) => {
                const apiUser = (res && (res.data || res.updatedUser || res)) as any | undefined;
                if (apiUser) {
                    updateUser(userId, {
                        name: apiUser.fullName ?? apiUser.name ?? userData.name,
                        role: apiUser.role === UserRole.ROLE_ADMIN
                            ? UserRole.ADMIN
                            : (apiUser.role as UserRole) ?? userData.role,
                    });
                } else {
                    updateUser(userId, userData);
                }
                closeModal();
            })
            .catch((err) => {
                // console.error('Failed to update user:', err);
            });
    };

    // -------------------------
    // ✨ DELETE USER
    // -------------------------
    const handleDeleteConfirm = async (userIds: (string | number)[]) => {
        try {
            await userDeleteApi(userIds);
            deleteUsers(userIds);
            resetSelection();
            closeModal();
        } catch (error) {
            // console.error('Failed to delete user(s):', error);
        }
    };

    const handleBulkDelete = () => {
        const users = allUsers.filter(u => selectedUserIds.has(u.id));
        openDeleteModal(users);
    };

    // -------------------------
    // ✨ BULK ROLE UPDATE
    // -------------------------
    const handleBulkRoleChange = (role: UserRole) => {
        const ids = Array.from(selectedUserIds);

        roleChangeApi(ids, role)
            .then((data) => {
                // console.log("Role updated:", data);
                bulkUpdateUserRole(ids, role);
            })
            .catch((error) => {
                // console.error("Error updating role:", error);
            })
            .finally(() => {
                resetSelection();
            });
    };

    // -------------------------
    // ✨ EXPORT USERS CSV
    // -------------------------
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
        a.download = 'anz-hindu-matrimony-users.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    // -------------------------
    // ✨ IMPORT USERS
    // -------------------------
    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            const rows = text.split('\n').slice(1);
            const newUsers: ImportedUser[] = rows
                .map(row => {
                    const [name, email, role] = row.split(',');
                    if (name && email && role) {
                        return {
                            id: `imported-${Date.now()}-${Math.random()}`,
                            name: name.trim(),
                            email: email.trim(),
                            role: role.trim().toUpperCase() as UserRole,
                            createdAt: new Date().toISOString(),
                            profile: { verificationStatus: 'Not Verified' }
                        };
                    }
                    return null;
                })
                .filter((user): user is ImportedUser => user !== null);

            addBulkUsers(newUsers);
        };

        reader.readAsText(file);
        if (importFileRef.current) importFileRef.current.value = "";
    };

    // -------------------------
    // ✨ FETCH USERS ON MOUNT
    // -------------------------
    useEffect(() => {
        getAdminUsersList()
            .then((data) => {
                if (Array.isArray(data.items) && data.items.length > 0) {
                    initializeUsers(
                        data.items.map(item => ({
                            id: item.id,
                            name: item.fullName,
                            email: item.email,
                            role: item.role === UserRole.ROLE_ADMIN ? UserRole.ADMIN : UserRole.CUSTOMER,
                            createdAt: item.joinedOn,
                            status: item.status,
                            profile: { verificationStatus: 'Not Verified' }
                        }))
                    );
                }
            })
            .catch((err) => {
                // console.error('Failed to fetch admin users:', err);
            });
    }, []);

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
                onSuspendChatConfirm={() => {}}
                onSuspendUserConfirm={() => {}}
            />
        </>
    );
};

export default AdminUsers;
