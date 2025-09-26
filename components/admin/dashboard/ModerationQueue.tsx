import React from 'react';
import { useAppContext } from '../../../hooks/useAppContext';
import ModerationCard from '../ModerationCard';
import { ModerationCardIcon } from '../../../types';

const ModerationQueue: React.FC = () => {
    const { t, verificationRequests, reports, storySubmissions } = useAppContext();

    const pendingReportsCount = reports.filter(r => r.status === 'Pending').length;
    const pendingStoriesCount = storySubmissions.filter(s => s.status === 'Pending').length;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ModerationCard
                title={t('admin.dashboard.pending_verifications')}
                count={verificationRequests.length}
                linkTo="/admin/verification-requests"
                icon={ModerationCardIcon.VERIFICATION}
            />
            <ModerationCard
                title={t('admin.dashboard.user_reports')}
                count={pendingReportsCount}
                linkTo="/admin/reports"
                icon={ModerationCardIcon.REPORT}
            />
            <ModerationCard
                title={t('admin.dashboard.story_submissions')}
                count={pendingStoriesCount}
                linkTo="/admin/story-submissions"
                icon={ModerationCardIcon.STORY}
            />
        </div>
    );
};

export default ModerationQueue;
