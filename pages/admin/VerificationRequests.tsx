import React, { useState } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import Card from '../../components/ui/Card';
import { User } from '../../types';
import VerificationReviewModal from '../../components/admin/VerificationReviewModal';

const VerificationRequests: React.FC = () => {
    const { t, verificationRequests } = useAppContext();
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const handleReview = (user: User) => {
        setSelectedUser(user);
    };

    return (
        <>
            <Card>
                <h1 className="text-3xl font-bold text-white mb-6">{t('admin.verifications.title')}</h1>
                
                {verificationRequests.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-gray-300">
                            <thead className="bg-white/10">
                                <tr>
                                    <th className="p-3">{t('admin.verifications.user')}</th>
                                    <th className="p-3">{t('admin.verifications.submitted_on')}</th>
                                    <th className="p-3 text-right">{t('admin.verifications.actions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {verificationRequests.map(user => (
                                    <tr key={user.id} className="border-b border-gray-700 hover:bg-white/5">
                                        <td className="p-3">
                                            <div className="font-semibold">{user.name}</div>
                                            <div className="text-sm text-gray-400">{user.email}</div>
                                        </td>
                                        <td className="p-3">{new Date(user.createdAt).toLocaleDateString()}</td>
                                        <td className="p-3 text-right">
                                            <button 
                                                onClick={() => handleReview(user)} 
                                                className="px-3 py-1 text-sm font-semibold text-white bg-pink-600 rounded-md hover:bg-pink-700 transition-colors cursor-pointer"
                                            >
                                                {t('admin.verifications.review')}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-400">{t('admin.verifications.no_requests')}</p>
                    </div>
                )}
            </Card>
            {selectedUser && (
                <VerificationReviewModal
                    isOpen={!!selectedUser}
                    onClose={() => setSelectedUser(null)}
                    user={selectedUser}
                />
            )}
        </>
    );
};

export default VerificationRequests;
