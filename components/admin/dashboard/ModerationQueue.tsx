import React from 'react';
import { useAppContext } from '../../../hooks/useAppContext';
import ModerationCard from '../ModerationCard';
import { ModerationCardIcon } from '../../../types';
import { AdminDashboardData } from '@/pages/admin/Dashboard';


interface ModerationQueueProps {
  dashboardData: AdminDashboardData;
}

const ModerationQueue: React.FC<ModerationQueueProps> = ({ dashboardData }) => {
    const { t } = useAppContext();


    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ModerationCard
                title={t('admin.dashboard.pending_verifications')}
                count={dashboardData.pendingVerification}
                linkTo="/admin/verification-requests"
                icon={ModerationCardIcon.VERIFICATION}
            />
            <ModerationCard
                title={t('admin.dashboard.user_reports')}
                count={dashboardData.newUserReports}
                linkTo="/admin/reports"
                icon={ModerationCardIcon.REPORT}
            />
            <ModerationCard
                title={t('admin.dashboard.story_submissions')}
                count={dashboardData.pendingStories}
                linkTo="/admin/story-submissions"
                icon={ModerationCardIcon.STORY}
            />
        </div>
    );
};

export default ModerationQueue;
