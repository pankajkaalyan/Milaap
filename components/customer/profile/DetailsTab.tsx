import React from 'react';
import { Match, UserProfile } from '../../../types';
import Card from '../../ui/Card';
import { useAppContext } from '../../../hooks/useAppContext';
import HoroscopeCard from '../../ui/HoroscopeCard';

interface DetailsTabProps {
    user: Match;
}

const DetailsTab: React.FC<DetailsTabProps> = ({ user }) => {
    const { t } = useAppContext();
    const targetUserProfile = (user['profile'] ? user['profile'] : null) as UserProfile;
    console.log('Target User:', user);

    return (
        <div className="grid md:grid-cols-2 gap-8">
            <HoroscopeCard details={targetUserProfile.horoscope} />
            <Card>
                <h2 className="text-xl font-bold text-white mb-4">{t('profile.family_details')}</h2>
                <div className="space-y-2 text-gray-300">
                    <p><strong>{t('profile.details.father_name')}:</strong> {targetUserProfile.familyDetails?.fatherName || 'N/A'}</p>
                    <p><strong>{t('profile.details.mother_name')}:</strong> {targetUserProfile.familyDetails?.motherName || 'N/A'}</p>
                    <p><strong>{t('profile.details.siblings')}:</strong> {targetUserProfile.familyDetails?.siblings || 'N/A'}</p>
                    <p><strong>{t('profile.details.family_values')}:</strong> {targetUserProfile.familyDetails?.familyValues || 'N/A'}</p>
                </div>
            </Card>
        </div>
    );
};

export default DetailsTab;
