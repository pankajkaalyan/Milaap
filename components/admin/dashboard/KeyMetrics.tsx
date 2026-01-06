import React from 'react';
import { useAppContext } from '../../../hooks/useAppContext';
import MetricCard from '../MetricCard';
import TrendingUpIcon from '../../icons/TrendingUpIcon';
import UserPlusIcon from '../../icons/UserPlusIcon';
import HeartHandshakeIcon from '../../icons/HeartHandshakeIcon';
import PaperAirplaneIcon from '../../icons/PaperAirplaneIcon';
import { AdminDashboardData } from '@/pages/admin/Dashboard';

interface KeyMetricsProps {
  dashboardData: AdminDashboardData;
}
const KeyMetrics: React.FC<KeyMetricsProps> = ({ dashboardData }) => {
    const { t } = useAppContext();
    
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
                title={t('admin.dashboard.metric.new_registrations')}
                value={dashboardData.newRegistrations.toLocaleString()}
                icon={<UserPlusIcon />}
                color="text-blue-400"
            />
            <MetricCard
                title={t('admin.dashboard.metric.active_users')}
                value={dashboardData.activeUsers.toLocaleString()}
                icon={<TrendingUpIcon />}
                color="text-green-400"
            />
            <MetricCard
                title={t('admin.dashboard.metric.matches_made')}
                value={dashboardData.matchesMade.toLocaleString()}
                icon={<HeartHandshakeIcon />}
                color="text-pink-400"
            />
            <MetricCard
                title={t('admin.dashboard.metric.messages_sent')}
                value={dashboardData.messagesSent.toLocaleString()}
                icon={<PaperAirplaneIcon />}
                color="text-purple-400"
            />
        </div>
    );
};

export default KeyMetrics;