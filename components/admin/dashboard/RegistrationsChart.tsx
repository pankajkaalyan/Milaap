import React from 'react';
import { useAppContext } from '../../../hooks/useAppContext';
import { mockAnalyticsData } from '../../../data/mockAdminData';
import Card from '../../ui/Card';
import AnalyticsChart from '../AnalyticsChart';

const RegistrationsChart: React.FC = () => {
    const { t } = useAppContext();
    const { registrationsLast7Days } = mockAnalyticsData;
    
    return (
        <Card>
            <h3 className="text-xl font-bold text-white mb-4">{t('admin.dashboard.registrations_chart')}</h3>
            <div className="h-72">
                <AnalyticsChart data={registrationsLast7Days} />
            </div>
        </Card>
    );
};

export default RegistrationsChart;
