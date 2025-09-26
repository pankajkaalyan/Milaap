import React from 'react';
import Card from '../../components/ui/Card';
import { useAppContext } from '../../hooks/useAppContext';
import { AdminRole, AdminUser, DropdownSize } from '../../types';
import Dropdown from '../../components/ui/Dropdown';

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);
const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);


const AccessControl: React.FC = () => {
    const { t, adminUsers, updateAdminRole } = useAppContext();

    const permissions = {
        [AdminRole.SUPER_ADMIN]: [
            { name: 'Manage Users', access: true },
            { name: 'Manage Verification Requests', access: true },
            { name: 'Manage User Reports', access: true },
            { name: 'Manage Success Stories', access: true },
            { name: 'View Verification Logs', access: true },
            { name: 'Manage Access Control', access: true },
        ],
        [AdminRole.MODERATOR]: [
            { name: 'Manage Users', access: false },
            { name: 'Manage Verification Requests', access: true },
            { name: 'Manage User Reports', access: true },
            { name: 'Manage Success Stories', access: true },
            { name: 'View Verification Logs', access: true },
            { name: 'Manage Access Control', access: false },
        ]
    };

    const handleRoleChange = (user: AdminUser, newRole: AdminRole) => {
        if (user.role !== newRole) {
            updateAdminRole(user.id, newRole);
        }
    }

    return (
        <div className="space-y-8">
            <Card>
                <h1 className="text-3xl font-bold text-white mb-6">{t('admin.access.title')}</h1>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-gray-300">
                        <thead className="bg-white/10">
                            <tr>
                                <th className="p-3">{t('admin.access.table.admin')}</th>
                                <th className="p-3">{t('admin.access.table.role')}</th>
                                <th className="p-3 text-right">{t('admin.access.table.actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {adminUsers.map(user => (
                                <tr key={user.id} className="border-b border-gray-700 hover:bg-white/5">
                                    <td className="p-3">
                                        <div className="font-semibold">{user.name}</div>
                                        <div className="text-sm text-gray-400">{user.email}</div>
                                    </td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 text-xs rounded-full ${user.role === AdminRole.SUPER_ADMIN ? 'bg-purple-500' : 'bg-blue-500'}`}>
                                            {t(`admin.access.permissions.role_${user.role.toLowerCase()}` as any)}
                                        </span>
                                    </td>
                                    <td className="p-3 text-right">
                                       <Dropdown
                                            value={user.role}
                                            onChange={(value) => handleRoleChange(user, value as AdminRole)}
                                            options={[
                                                { value: AdminRole.SUPER_ADMIN, label: t('admin.access.permissions.role_super') },
                                                { value: AdminRole.MODERATOR, label: t('admin.access.permissions.role_moderator') },
                                            ]}
                                            size={DropdownSize.SMALL}
                                            disabled={user.email === 'admin@example.com'}
                                       />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Card>
                <h2 className="text-2xl font-bold text-white mb-4">{t('admin.access.permissions.title')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Super Admin Permissions */}
                    <div>
                        <h3 className="text-xl font-semibold text-purple-400 mb-2">{t('admin.access.permissions.role_super')}</h3>
                        <p className="text-sm text-gray-400 mb-4">{t('admin.access.permissions.desc_super')}</p>
                        <ul className="space-y-2">
                            {permissions[AdminRole.SUPER_ADMIN].map(p => (
                                <li key={p.name} className="flex items-center text-gray-300">
                                    {p.access ? <CheckIcon/> : <XIcon/>} {p.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* Moderator Permissions */}
                     <div>
                        <h3 className="text-xl font-semibold text-blue-400 mb-2">{t('admin.access.permissions.role_moderator')}</h3>
                        <p className="text-sm text-gray-400 mb-4">{t('admin.access.permissions.desc_moderator')}</p>
                        <ul className="space-y-2">
                            {permissions[AdminRole.MODERATOR].map(p => (
                                <li key={p.name} className="flex items-center text-gray-300">
                                    {p.access ? <CheckIcon/> : <XIcon/>} {p.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default AccessControl;