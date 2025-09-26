import React, { useState } from 'react';
import { Match } from '../../../types';
import OverviewTab from '../overview_tab';
import DetailsTab from './DetailsTab';
import GalleryTab from './GalleryTab';

interface ProfileTabsProps {
    user: Match;
    showContact: boolean;
    onViewContact: () => void;
    onViewPhoto: (photoUrl: string) => void;
    onWatchVideo: () => void;
}

type ActiveTab = 'overview' | 'details' | 'gallery';

const ProfileTabs: React.FC<ProfileTabsProps> = ({ user, showContact, onViewContact, onViewPhoto, onWatchVideo }) => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
    
    const TabButton: React.FC<{ tab: ActiveTab; label: string }> = ({ tab, label }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-semibold rounded-t-md transition-colors ${
                activeTab === tab
                ? 'bg-white/10 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
        >
            {label}
        </button>
    );

    return (
        <div>
            <div className="flex border-b border-white/10 mb-6">
                <TabButton tab="overview" label="Overview" />
                <TabButton tab="details" label="Details" />
                <TabButton tab="gallery" label="Gallery" />
            </div>

            <div>
                {activeTab === 'overview' && <OverviewTab user={user} showContact={showContact} onViewContact={onViewContact} />}
                {activeTab === 'details' && <DetailsTab user={user} />}
                {activeTab === 'gallery' && <GalleryTab user={user} onViewPhoto={onViewPhoto} onWatchVideo={onWatchVideo} />}
            </div>
        </div>
    );
};

export default ProfileTabs;