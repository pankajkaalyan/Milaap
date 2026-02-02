import React from 'react';
import Dropdown from '../../ui/Dropdown';
import { UserProfile } from '../../../types';
import { useAppContext } from '../../../hooks/useAppContext';

interface PrivacySettingsProps {
    profileVisibility: UserProfile['profileVisibility'];
    contactVisibility: UserProfile['contactVisibility'];
    familyVisibility: UserProfile['familyVisibility'];
    galleryVisibility: UserProfile['galleryVisibility'];
    onDropdownChange: (
        key: keyof Pick<
            UserProfile,
            'profileVisibility' | 'contactVisibility' | 'familyVisibility' | 'galleryVisibility'
        >,
        value: string
    ) => void;
}

const PrivacySettings: React.FC<PrivacySettingsProps> = ({
    profileVisibility,
    contactVisibility,
    familyVisibility,
    galleryVisibility,
    onDropdownChange
}) => {
    const { t } = useAppContext();

    return (
        <div>
            <h2 className="text-2xl font-bold text-white mb-2">
                {t('settings.privacy.title')}
            </h2>
            <p className="text-gray-400 mb-6">
                {t('settings.privacy.desc')}
            </p>

            <div className="space-y-6">
                {/* Profile visibility */}
                <div>
                    <Dropdown
                        id="profileVisibility"
                        label={t('settings.privacy.profile_visibility')}
                        value={profileVisibility || 'all'}
                        onChange={(value) => onDropdownChange('profileVisibility', value)}
                        options={[
                            { value: 'hide', label: 'Hide Profile' },
                            { value: 'all', label: t('settings.privacy.profile_visibility_options.all') },
                            { value: 'friends', label: 'Visible to mutually matched only' }
                        ]}
                    />
                </div>

                {/* Contact visibility */}
                <div>
                    <Dropdown
                        id="contactVisibility"
                        label={t('settings.privacy.contact_visibility')}
                        value={contactVisibility || 'friends'}
                        onChange={(value) => onDropdownChange('contactVisibility', value)}
                        options={[
                            { value: 'friends', label: 'Visible to mutually matched only' },
                            { value: 'hide', label: 'Hide Personal Details' },
                        ]}
                    />
                </div>

                {/* Family details visibility */}
                <div>
                    <Dropdown
                        id="familyVisibility"
                        label={'Family Details Visibility'}
                        value={familyVisibility || 'friends'}
                        onChange={(value) => onDropdownChange('familyVisibility', value)}
                        options={[
                            { value: 'friends', label: 'Visible to mutually matched only' },
                            { value: 'hide', label: 'Hide Family Details' },
                        ]}
                    />
                </div>

                {/* Photo gallery visibility */}
                <div>
                    <Dropdown
                        id="galleryVisibility"
                        label={'Gallery Visibility'}
                        value={galleryVisibility || 'friends'}
                        onChange={(value) => onDropdownChange('galleryVisibility', value)}
                        options={[
                            { value: 'friends', label: 'Visible to mutually matched only' },
                            { value: 'hide', label: 'Hide Photo Gallery' },
                        ]}
                    />
                </div>
            </div>
        </div>
    );
};

export default PrivacySettings;
