import React from 'react';
import ToggleSwitch from '../../ui/ToggleSwitch';
import { NotificationSettings } from '../../../types';
import { useAppContext } from '../../../hooks/useAppContext';

interface NotificationSettingsProps {
    settings: NotificationSettings;
    onToggleChange: (category: keyof NotificationSettings, key: string, value: boolean) => void;
}

const NotificationSettingsComponent: React.FC<NotificationSettingsProps> = ({ settings, onToggleChange }) => {
    const { t } = useAppContext();
    return (
        <div>
            <h2 className="text-2xl font-bold text-white mb-6">{t('nav.settings')}</h2>

            {/* PUSH */}
            {/* <div>
                <h3 className="text-xl font-bold text-white mb-2">{t('settings.push.title')}</h3>
                <p className="text-gray-400 mb-4">{t('settings.push.desc')}</p>
                <div className="space-y-4">
                    <ToggleSwitch id="push-new-match" label={t('settings.push.new_match')} checked={settings.push.newMatch} onChange={(val) => onToggleChange('push', 'newMatch', val)} />
                    <ToggleSwitch id="push-new-message" label={t('settings.push.new_message')} checked={settings.push.newMessage} onChange={(val) => onToggleChange('push', 'newMessage', val)} />
                    <ToggleSwitch id="push-profile-view" label={t('settings.push.profile_view')} checked={settings.push.profileView} onChange={(val) => onToggleChange('push', 'profileView', val)} />
                </div>
            </div> */}

            {/* EMAIL */}
            <div className="mt-8 pt-6 border-t border-white/10">
                <h3 className="text-xl font-bold text-white mb-2">{t('settings.email.title')}</h3>
                <p className="text-gray-400 mb-4">{t('settings.email.desc')}</p>
                <div className="space-y-4">
                    <ToggleSwitch id="email-new-match" label={t('settings.email.new_match')} checked={settings.email.newMatch} onChange={(val) => onToggleChange('email', 'newMatch', val)} />
                    <ToggleSwitch id="email-new-message" label={t('settings.email.new_message')} checked={settings.email.newMessage} onChange={(val) => onToggleChange('email', 'newMessage', val)} />
                    <ToggleSwitch id="email-weekly-digest" label={t('settings.email.weekly_digest')} checked={settings.email.weeklyDigest} onChange={(val) => onToggleChange('email', 'weeklyDigest', val)} />
                </div>
            </div>
        </div>
    );
};

export default NotificationSettingsComponent;