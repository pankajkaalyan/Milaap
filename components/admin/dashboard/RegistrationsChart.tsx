import React from 'react';
import { useAppContext } from '../../../hooks/useAppContext';
import { mockAnalyticsData } from '../../../data/mockAdminData';
import Card from '../../ui/Card';
import AnalyticsChart from '../AnalyticsChart';
import { WeeklyCount } from '@/pages/admin/Dashboard';

interface RegistrationsChartProps {
  data: WeeklyCount[];    
}

const RegistrationsChart: React.FC<RegistrationsChartProps> = ({ data }) => {
    const { t } = useAppContext();
    
    return (
        <Card>
            <h3 className="text-xl font-bold text-white mb-4">{t('admin.dashboard.registrations_chart')}</h3>
            <div className="h-72">
                <AnalyticsChart data={data} />
            </div>
        </Card>
    );
};

export default RegistrationsChart;
