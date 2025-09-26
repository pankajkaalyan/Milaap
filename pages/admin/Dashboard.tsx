import React from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import ModerationQueue from '../../components/admin/dashboard/ModerationQueue';
import KeyMetrics from '../../components/admin/dashboard/KeyMetrics';
import RegistrationsChart from '../../components/admin/dashboard/RegistrationsChart';

const Dashboard: React.FC = () => {
    const { t } = useAppContext();

    return (
        <div className="space-y-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white">{t('admin.dashboard.title')}</h1>
            
            <ModerationQueue />

            <div className="space-y-8">
                <h2 className="text-2xl font-bold text-white">{t('admin.dashboard.analytics_title')}</h2>
                <KeyMetrics />
                <RegistrationsChart />
            </div>
        </div>
    );
};

export default Dashboard;