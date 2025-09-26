import React from 'react';
import { useAppContext } from '../../../hooks/useAppContext';
import { mockAnalyticsData } from '../../../data/mockAdminData';
import MetricCard from '../MetricCard';
import TrendingUpIcon from '../../icons/TrendingUpIcon';
import UserPlusIcon from '../../icons/UserPlusIcon';
import HeartHandshakeIcon from '../../icons/HeartHandshakeIcon';
import PaperAirplaneIcon from '../../icons/PaperAirplaneIcon';

const KeyMetrics: React.FC = () => {
    const { t } = useAppContext();
    const { keyMetrics } = mockAnalyticsData;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
                title={t('admin.dashboard.metric.new_registrations')}
                value={keyMetrics.newRegistrations.toLocaleString()}
                icon={<UserPlusIcon />}
                color="text-blue-400"
            />
            <MetricCard
                title={t('admin.dashboard.metric.active_users')}
                value={keyMetrics.activeUsers.toLocaleString()}
                icon={<TrendingUpIcon />}
                color="text-green-400"
            />
            <MetricCard
                title={t('admin.dashboard.metric.matches_made')}
                value={keyMetrics.matchesMade.toLocaleString()}
                icon={<HeartHandshakeIcon />}
                color="text-pink-400"
            />
            <MetricCard
                title={t('admin.dashboard.metric.messages_sent')}
                value={keyMetrics.messagesSent.toLocaleString()}
                icon={<PaperAirplaneIcon />}
                color="text-purple-400"
            />
        </div>
    );
};

export default KeyMetrics;