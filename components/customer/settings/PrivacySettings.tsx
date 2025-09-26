import React from 'react';
import Dropdown from '../../ui/Dropdown';
import { UserProfile } from '../../../types';
import { useAppContext } from '../../../hooks/useAppContext';

interface PrivacySettingsProps {
    profileVisibility: UserProfile['profileVisibility'];
    contactVisibility: UserProfile['contactVisibility'];
    onDropdownChange: (key: keyof Pick<UserProfile, 'profileVisibility' | 'contactVisibility'>, value: string) => void;
}

const PrivacySettings: React.FC<PrivacySettingsProps> = ({ profileVisibility, contactVisibility, onDropdownChange }) => {
    const { t } = useAppContext();
    return (
        <div>
            <h2 className="text-2xl font-bold text-white mb-2">{t('settings.privacy.title')}</h2>
            <p className="text-gray-400 mb-6">{t('settings.privacy.desc')}</p>
            <div className="space-y-6">
                <div>
                    <Dropdown
                        id="profileVisibility"
                        label={t('settings.privacy.profile_visibility')}
                        value={profileVisibility || 'all'}
                        onChange={(value) => onDropdownChange('profileVisibility', value)}
                        options={[
                            { value: 'all', label: t('settings.privacy.profile_visibility_options.all') },
                            { value: 'premium', label: t('settings.privacy.profile_visibility_options.premium') }
                        ]}
                    />
                </div>
                <div>
                    <Dropdown
                        id="contactVisibility"
                        label={t('settings.privacy.contact_visibility')}
                        value={contactVisibility || 'accepted'}
                        onChange={(value) => onDropdownChange('contactVisibility', value)}
                        options={[
                            { value: 'accepted', label: t('settings.privacy.contact_visibility_options.accepted') },
                            { value: 'premium', label: t('settings.privacy.contact_visibility_options.premium') }
                        ]}
                    />
                </div>
            </div>
        </div>
    );
};

export default PrivacySettings;