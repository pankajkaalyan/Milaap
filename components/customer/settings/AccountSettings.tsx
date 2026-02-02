import React from 'react';
import Button from '../../ui/Button';
import { ButtonVariant } from '../../../types';
import { useAppContext } from '../../../hooks/useAppContext';

interface AccountSettingsProps {
  onDeactivateClick: () => void;
  onDeleteClick: () => void;
  onChangePasswordClick?: () => void;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({ onDeactivateClick, onDeleteClick, onChangePasswordClick }) => {
    const {user, t } = useAppContext();

    return (
        <div>
            <h2 className="text-2xl font-bold text-white mb-2">{t('settings.account.title')}</h2>
            <p className="text-gray-400 mb-6">{t('settings.account.desc')}</p>
            <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span>{t('settings.account.change_password')}</span>
                    <Button onClick={onChangePasswordClick} variant={ButtonVariant.SECONDARY} className="w-auto !py-2 !px-4 !text-sm">Change</Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                        <p>{t('settings.account.deactivate')}</p>
                        <p className="text-xs text-gray-500">{t('settings.account.deactivate_desc')}</p>
                    </div>
                    <Button onClick={onDeactivateClick} variant={ButtonVariant.SECONDARY} className="w-auto !py-2 !px-4 !text-sm">{user?.profile?.status?.toLowerCase() === 'approved' ? 'Deactivate' : 'Activate'}</Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                    <div>
                        <p className="text-red-300 font-semibold">{t('settings.account.delete')}</p>
                        <p className="text-xs text-red-400/80">{t('settings.account.delete_desc')}</p>
                    </div>
                    <Button onClick={onDeleteClick} className="w-auto !py-2 !px-4 !text-sm !bg-gradient-to-r !from-red-600 !to-red-800">Delete</Button>
                </div>
            </div>
        </div>
    );
};

export default AccountSettings;