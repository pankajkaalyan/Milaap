import React, { useMemo } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { Match, UserProfile } from '../../types';
import Card from '../ui/Card';

interface CompatibilityChecklistProps {
    targetUser: Match;
}

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);
const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
    </svg>
);
const QuestionMarkIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    </svg>
);


const CompatibilityChecklist: React.FC<CompatibilityChecklistProps> = ({ targetUser }) => {
    const { t, user: currentUser } = useAppContext();
    const preferences = currentUser?.profile?.partnerPreferences;
    const currentUserProfile = currentUser?.profile;
    const targetUserProfile = (targetUser['profile']? targetUser['profile'] : null) as UserProfile;
    console.log('Current User:', currentUser);
    console.log('Target User:', targetUser);
    const compatibilityResults = useMemo(() => {
        if (!preferences) return null;

        const results = [];
        let matches = 0;

        // Age Check
        if (preferences.ageRange?.min && preferences.ageRange?.max) {
            const isMatch = targetUserProfile.age >= preferences.ageRange.min && targetUserProfile.age <= preferences.ageRange.max;
            if(isMatch) matches++;
            results.push({
                label: t('compatibility.age'),
                match: isMatch,
                value: `${targetUserProfile.age} yrs`,
                preference: `${preferences.ageRange.min}-${preferences.ageRange.max} yrs`
            });
        }

        // Height Check
        if (preferences.heightRange?.min && preferences.heightRange?.max && targetUserProfile.heightInCm) {
            const isMatch = targetUserProfile.heightInCm >= preferences.heightRange.min && targetUserProfile.heightInCm <= preferences.heightRange.max;
            if(isMatch) matches++;
            results.push({
                label: t('compatibility.height'),
                match: isMatch,
                value: `${targetUserProfile.heightInCm} cm`,
                preference: `${preferences.heightRange.min}-${preferences.heightRange.max} cm`
            });
        }

        // Caste Check
        if (preferences.castes && preferences.castes.length > 0) {
            const isMatch = preferences.castes?.some(c => c?.toLowerCase() === targetUserProfile.caste?.toLowerCase());
            if(isMatch) matches++;
            results.push({
                label: t('compatibility.caste'),
                match: isMatch,
                value: targetUserProfile.caste,
                preference: preferences.castes.join(', ')
            });
        }
        
        // Mangal Dosha Check
        if (preferences.mangalDosha && preferences.mangalDosha !== 'Any' && targetUserProfile.horoscope?.mangalDosha) {
             const isMatch = preferences.mangalDosha === targetUserProfile.horoscope.mangalDosha;
             if(isMatch) matches++;
             results.push({
                label: t('compatibility.mangal_dosha'),
                match: isMatch,
                value: targetUserProfile.horoscope.mangalDosha,
                preference: preferences.mangalDosha
             });
        }

        return { checks: results, summary: { matches, total: results.length } };
    }, [preferences, targetUser, t]);

    if (!compatibilityResults) {
        return null;
    }

    const { checks, summary } = compatibilityResults;

    return (
        <Card>
            <div className="flex justify-between items-baseline">
                <h2 className="text-xl font-bold text-white mb-4">{t('compatibility.title')}</h2>
                <span className="text-sm font-semibold text-pink-400">
                    {t('compatibility.summary').replace('{matches}', summary.matches.toString()).replace('{total}', summary.total.toString())}
                </span>
            </div>
            
            <ul className="space-y-3">
                {checks.map((check, index) => (
                    <li key={index} className="flex items-start p-2 bg-white/5 rounded-md">
                        <div className="pt-0.5">
                            {check.match ? <CheckIcon /> : <XIcon />}
                        </div>
                        <div className="ml-3 flex-1">
                            <p className="font-semibold text-white">{check.label}</p>
                            <div className="text-sm text-gray-400">
                                Theirs: <span className="text-gray-200">{check.value}</span> | Your Preference: <span className="text-gray-200">{check.preference}</span>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </Card>
    );
};

export default CompatibilityChecklist;