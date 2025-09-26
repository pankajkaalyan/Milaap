import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { Link } from 'react-router-dom';
import ProgressBar from '../../components/ui/ProgressBar';
import EditProfileModal from '../../components/customer/EditProfileModal';
import MyProfileHeader from '../../components/customer/my-profile/MyProfileHeader';
import ProfileMetricCard from '../../components/customer/my-profile/ProfileMetricCard';
import ProfileDetailsSection from '../../components/customer/my-profile/ProfileDetailsSection';
import HoroscopeCard from '../../components/ui/HoroscopeCard';

const Profile: React.FC = () => {
    const { t, user } = useAppContext();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const profileCompleteness = useMemo(() => {
        if (!user?.profile) return 0;
        const fields = [
            'dateOfBirth', 'timeOfBirth', 'height', 'caste', 'profession', 'education',
            'about', 'horoscope.rashi', 'horoscope.nakshatra', 'family.fatherName'
        ];
        const totalFields = fields.length;
        let filledFields = 0;

        fields.forEach(field => {
            const keys = field.split('.');
            let value: unknown = user.profile;
            for (const key of keys) {
                if (value && typeof value === 'object' && value !== null && key in value) {
                    value = (value as Record<string, unknown>)[key];
                } else {
                    value = null;
                    break;
                }
            }
            if (value) {
                filledFields++;
            }
        });
        
        return Math.round((filledFields / totalFields) * 100);
    }, [user]);

    if (!user || !user.profile) {
        return null;
    }
    const { profile } = user;
    
    const verificationStatus = profile.verificationStatus || 'Not Verified';
    const verificationStatusText = {
        'Not Verified': t('verification.status.not_verified'),
        'Pending': t('verification.status.pending'),
        'Verified': t('verification.status.verified'),
    };
    const verificationStatusColor = {
        'Not Verified': 'text-yellow-400',
        'Pending': 'text-orange-400',
        'Verified': 'text-green-400',
    };

    return (
        <>
            <div className="max-w-4xl mx-auto space-y-8">
                <MyProfileHeader user={user} onEditClick={() => setIsEditModalOpen(true)} t={t} />

                <div className="grid md:grid-cols-2 gap-8">
                    <ProfileMetricCard title={t('profile.completeness')}>
                        <ProgressBar value={profileCompleteness} />
                    </ProfileMetricCard>
                    <ProfileMetricCard title={t('profile.verification_status')}>
                         <div className="flex items-center space-x-2">
                           <p className={`text-lg font-semibold ${verificationStatusColor[verificationStatus]}`}>{verificationStatusText[verificationStatus]}</p>
                           {verificationStatus === 'Not Verified' && (
                                <Link to="/verification" className="text-sm text-amber-400 hover:underline cursor-pointer">
                                    ({t('profile.verify_now')})
                                </Link>
                           )}
                        </div>
                    </ProfileMetricCard>
                </div>
                
                <ProfileDetailsSection title={t('profile.about')}>
                    <p className="text-gray-300 leading-relaxed">{profile.about || 'No information provided yet.'}</p>
                </ProfileDetailsSection>
                
                <ProfileDetailsSection title={t('profile.partner_preferences')} isGrid>
                    {profile.partnerPreferences ? (
                        <>
                           <p><strong>{t('preferences.age_range')}:</strong> {profile.partnerPreferences.ageRange?.min || '?'} - {profile.partnerPreferences.ageRange?.max || '?'} yrs</p>
                           <p><strong>{t('preferences.height_range_cm')}:</strong> {profile.partnerPreferences.heightRange?.min || '?'} - {profile.partnerPreferences.heightRange?.max || '?'} cm</p>
                           <p><strong>{t('preferences.castes')}:</strong> {profile.partnerPreferences.castes?.join(', ') || 'Any'}</p>
                           <p><strong>{t('preferences.professions')}:</strong> {profile.partnerPreferences.professions?.join(', ') || 'Any'}</p>
                           <p><strong>{t('preferences.mangal_dosha')}:</strong> {profile.partnerPreferences.mangalDosha || 'Any'}</p>
                        </>
                    ) : (
                        <p className="text-gray-400">{t('preferences.not_set')}</p>
                    )}
                </ProfileDetailsSection>
                
                <div className="grid md:grid-cols-2 gap-8">
                    <HoroscopeCard details={profile.horoscope || {}} />
                    <ProfileDetailsSection title={t('profile.family_details')}>
                        <p><strong>{t('profile.details.father_name')}:</strong> {profile.family?.fatherName || 'N/A'}</p>
                        <p><strong>{t('profile.details.mother_name')}:</strong> {profile.family?.motherName || 'N/A'}</p>
                        <p><strong>{t('profile.details.siblings')}:</strong> {profile.family?.siblings || 'N/A'}</p>
                        <p><strong>{t('profile.details.family_values')}:</strong> {profile.family?.familyValues || 'N/A'}</p>
                    </ProfileDetailsSection>
                </div>
            </div>
            
            {isEditModalOpen && (
                <EditProfileModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                />
            )}
        </>
    );
};

export default Profile;
