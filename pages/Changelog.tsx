import React from 'react';
import Card from '../components/ui/Card';
import { useAppContext } from '../hooks/useAppContext';

type ChangeType = 'Added' | 'Improved' | 'Fixed' | 'Removed';

interface Change {
    type: ChangeType;
    description: string;
}

interface ChangelogEntry {
    version: string;
    date: string;
    changes: Change[];
}

const changelogData: ChangelogEntry[] = [
    {
        version: '1.5.0',
        date: '2024-07-27',
        changes: [
            { type: 'Added', description: 'Introduced a new "Changelog" page to track application updates.' },
            { type: 'Improved', description: 'The "Success Stories" link is now present in the footer for easier access.' },
            { type: 'Removed', description: 'Removed "Success Stories" from the main header for a cleaner navigation experience.' },
        ],
    },
    {
        version: '1.4.0',
        date: '2024-07-26',
        changes: [
            { type: 'Added', description: 'Implemented Role-Based Access Control for administrators (Super Admin vs. Moderator).' },
            { type: 'Added', description: 'Live feed and re-trigger functionality for Admin Verification Logs.' },
            { type: 'Improved', description: 'AI Kundli report now provides more detailed spiritual guidance.' },
            { type: 'Fixed', description: 'Resolved a minor CSS bug in the chat window on Firefox.' },
        ],
    },
    {
        version: '1.3.0',
        date: '2024-07-25',
        changes: [
            { type: 'Added', description: 'AI-powered Match Suggestions on the user dashboard.' },
            { type: 'Added', description: 'AI-powered Kundli Compatibility report generation.' },
            { type: 'Added', description: 'Admin moderation panels for verification, reports, and story submissions.' },
            { type: 'Improved', description: 'Enhanced user search with location-based filtering (Find Matches Near Me).' },
        ],
    },
    {
        version: '1.2.0',
        date: '2024-07-22',
        changes: [
            { type: 'Added', description: 'Membership plans (Free, Premium, Premium+) with feature-gating.' },
            { type: 'Added', description: 'Live support chat widget for logged-in users.' },
            { type: 'Improved', description: 'Notification system is now more responsive with a real-time feel.' },
        ],
    },
    {
        version: '1.1.0',
        date: '2024-07-20',
        changes: [
            { type: 'Added', description: 'Multi-language support (English and Hindi) with a language switcher.' },
            { type: 'Added', description: 'Password reset functionality ("Forgot Password" flow).' },
            { type: 'Improved', description: 'Forms now include comprehensive validation with user-friendly error messages.' },
            { type: 'Fixed', description: 'Corrected layout shift on mobile devices when hamburger menu is opened.' },
        ],
    },
    {
        version: '1.0.0',
        date: '2024-07-18',
        changes: [
            { type: 'Added', description: 'Initial release of the Celestial Sangam platform.' },
            { type: 'Added', description: 'Features include user registration, login, profile management, and basic matchmaking.' },
            { type: 'Added', description: 'Progressive Web App (PWA) capabilities for offline access.' },
        ],
    },
];

interface ChangeTypeBadgeProps {
  type: ChangeType;
}

const ChangeTypeBadge: React.FC<ChangeTypeBadgeProps> = ({ type }) => {
    const typeStyles: Record<ChangeType, string> = {
        Added: 'bg-green-500/20 text-green-300 border-green-500/30',
        Improved: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        Fixed: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
        Removed: 'bg-red-500/20 text-red-300 border-red-500/30',
    };

    return (
        <span className={`inline-block text-xs font-semibold px-2 py-1 rounded-full border ${typeStyles[type]}`}>
            {type}
        </span>
    );
};

const Changelog: React.FC = () => {
    const { t } = useAppContext();
    return (
        <div className="max-w-4xl mx-auto">
            <Card>
                <h1 className="text-4xl font-bold text-white mb-6 text-center">{t('changelog.title')}</h1>
                <div className="space-y-10">
                    {changelogData.map((entry) => (
                        <div key={entry.version} className="relative pl-8">
                             <div className="absolute top-1 left-0 w-4 h-4 bg-amber-500 rounded-full border-4 border-gray-900"></div>
                             <div className="absolute top-4 left-[7px] h-full w-0.5 bg-white/10"></div>
                            
                            <div className="flex items-baseline space-x-4">
                                <h2 className="text-2xl font-bold text-white">Version {entry.version}</h2>
                                <p className="text-sm text-gray-400">{entry.date}</p>
                            </div>
                            <ul className="mt-4 space-y-3">
                                {entry.changes.map((change, index) => (
                                    <li key={index} className="flex items-start space-x-3">
                                        <div className="flex-shrink-0 pt-1">
                                            <ChangeTypeBadge type={change.type} />
                                        </div>
                                        <p className="text-gray-300">{change.description}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default Changelog;