import React, { useEffect } from 'react';
import { BadgeVariant, User, UserRole } from '../../types';
import { useAppContext } from '../../hooks/useAppContext';
import Card from '../../components/ui/Card';
import { useAdminTable } from '../../hooks/useAdminTable';
import UserTable, { ColumnConfig } from '../../components/admin/users/UserTable';
import Pagination from '../../components/ui/Pagination';
import UserTableFilters from '../../components/admin/users/UserTableFilters';
import BulkActionsMenu from '../../components/admin/users/BulkActionsMenu';
import { useUserManagementModals } from '../../hooks/useUserManagementModals';
import UserModals from '../../components/admin/users/UserModals';
import {
    getRegistrationRequestsApi,
    approveRegistrationApi,
    rejectRegistrationApi,
} from '@/services/api/admin';
import getVerificationBadge from '@/components/admin/users/GetVerificationBadge';
import Badge from '@/components/ui/Badge';


const AdminRegistrationRequests: React.FC = () => {
    const {
        allUsers,
        initializeUsers,
        updateUser,
        deleteUsers,
    } = useAppContext();

    const {
        searchTerm,
        setSearchTerm,
        roleFilter,
        setRoleFilter,
        currentPage,
        setCurrentPage,
        sortConfig,
        selectedUserIds,
        paginatedUsers,
        totalPages,
        requestSort,
        handleSelectOne,
        handleSelectAll,
        getPaginationGroup,
        resetSelection,
    } = useAdminTable(allUsers);

    const {
        activeModal,
        modalData,
        openDeleteModal,
        closeModal,
    } = useUserManagementModals();

    // -------------------------
    // ✨ FETCH REGISTRATION REQUESTS
    // -------------------------
    useEffect(() => {
        getRegistrationRequests();
    }, []);
    const getRegistrationRequests = async () => {
        try {
            const data = await getRegistrationRequestsApi();
            if (Array.isArray(data.items)) {
                initializeUsers(
                    data.items.map((item) => ({
                        id: item.id,
                        name: item.name,
                        email: item.email,
                        role: UserRole.CUSTOMER,
                        createdAt: item.createdAt,
                        status: 'pending',
                        linkedin: item.linkedin,
                        socialMedia: item.socialMedia,
                        mobileNumber: item.mobileNumber,
                    }))
                );
            }
        } catch {
            // handle error
        }
    };

    // -------------------------
    // ✨ APPROVE REQUEST
    // -------------------------
    const handleApprove = async (user: User) => {
        try {
            await approveRegistrationApi(user.id);
            updateUser(user.id, { name: user.name, status: 'approved' });
            getRegistrationRequests();
        } catch {
            // handle error
        }
    };

    // -------------------------
    // ✨ REJECT REQUEST
    // -------------------------
    const handleReject = async (user: User) => {
        try {
            await rejectRegistrationApi(user.id);
            updateUser(user.id, { name: user.name, status: 'rejected' });
            getRegistrationRequests();
        } catch {
            // handle error
        }
    };

    // -------------------------
    // ✨ BULK REJECT
    // -------------------------
    const handleBulkReject = () => {
        const users = allUsers.filter(u => selectedUserIds.has(u.id));
        openDeleteModal(users);
    };

    //   const handleDeleteConfirm = async (userIds: (string | number)[]) => {
    //     try {
    //       await rejectRegistrationApi(userIds);
    //       deleteUsers(userIds);
    //       resetSelection();
    //       closeModal();
    //     } catch {
    //       // handle error
    //     }
    //   };

    const userTableColumns: ColumnConfig[] = [
        { key: 'name', label: 'Name', sortable: true },           // simple sortable column
        { key: 'email', label: 'Email', sortable: true },
        {
            key: 'mobileNumber',
            label: 'Mobile',
            sortable: true,
            render: (user) => user.mobileNumber || <span className="text-gray-500 italic">—</span>,
        },
        // {
        //     key: 'role',
        //     label: 'Role',
        //     sortable: true,
        //     render: (user: User) => (
        //         <Badge
        //             variant={user.role === UserRole.ADMIN ? BadgeVariant.PRIMARY : BadgeVariant.INFO}
        //         >
        //             {user.role}
        //         </Badge>
        //     ),
        // },
        {
            key: 'linkedin',
            label: 'LinkedIn',
            render: (user: User) =>
                user.linkedin ? (
                    <a
                        href={user.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-400 hover:text-pink-600 hover:underline break-all transition-colors"
                    >
                        Open
                    </a>
                ) : (
                    <span className="text-gray-500 italic">—</span>
                ),
        },
        {
            key: 'socialMedia',
            label: 'Social Media',
            render: (user: User) =>
                user.socialMedia ? (
                    <a
                        href={user.socialMedia}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-400 hover:text-pink-600 hover:underline break-all transition-colors"
                    >
                        Open
                    </a>
                ) : (
                    <span className="text-gray-500 italic">—</span>
                ),
        },

        {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (user: User) => getVerificationBadge(user.status),
        },
        // {
        //     key: 'createdAt',
        //     label: 'Joining Date',
        //     sortable: true,
        //     render: (user: User) => new Date(user.createdAt).toLocaleDateString(),
        // },
    ];




    return (
        <>
            <Card>
                <UserTableFilters
                    searchTerm={searchTerm}
                    onSearchChange={(value) => {
                        setSearchTerm(value);
                        setCurrentPage(1);
                    }}
                    roleFilter={roleFilter}
                    onRoleChange={(value) => {
                        setRoleFilter(value as 'ALL' | UserRole);
                        setCurrentPage(1);
                    }}
                />

                {/* <BulkActionsMenu
          selectedCount={selectedUserIds.size}
          onDelete={handleBulkReject}
        /> */}

                {/* <UserTable
                    users={paginatedUsers}
                    selectedUserIds={selectedUserIds}
                    onSelectOne={handleSelectOne}
                    onSelectAll={handleSelectAll}
                    sortConfig={sortConfig}
                    onSort={requestSort}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    hideEdit
                    hideDelete
                /> */}

                <UserTable
                    users={paginatedUsers} // your data
                    selectedUserIds={selectedUserIds}
                    onSelectOne={handleSelectOne}
                    onSelectAll={handleSelectAll}
                    sortConfig={sortConfig}
                    onSort={requestSort}
                    onEdit={() => { }}
                    onDelete={() => { }}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    columns={userTableColumns} // <-- this makes table configurable
                    rowActions={[
                        { key: 'approve', label: 'Approve', onClick: handleApprove },
                        { key: 'reject', label: 'Reject', onClick: handleReject, variant: 'danger', visible: (user) => user.status !== 'approved' },
                    ]}
                />



                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    paginationGroup={getPaginationGroup()}
                />
            </Card>

            {/* <UserModals
        activeModal={activeModal}
        modalData={modalData}
        onClose={closeModal}
        onDeleteConfirm={handleDeleteConfirm}
      /> */}
        </>
    );
};

export default AdminRegistrationRequests;
