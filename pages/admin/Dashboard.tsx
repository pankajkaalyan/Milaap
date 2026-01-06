import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import ModerationQueue from '../../components/admin/dashboard/ModerationQueue';
import KeyMetrics from '../../components/admin/dashboard/KeyMetrics';
import RegistrationsChart from '../../components/admin/dashboard/RegistrationsChart';
import { getAdminDashboardAPI } from '@/services/api/admin';

export interface WeeklyCount {
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  count: number;
}


export interface AdminDashboardData {
  activeUsers: number;
  matchesMade: number;
  messagesSent: number;
  newRegistrations: number;
  newUserReports: number;
  pendingStories: number;
  pendingVerification: number;
  registrationsLast7Days: WeeklyCount[];
}

const Dashboard: React.FC = () => {
    const { t } = useAppContext();
    const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                setLoading(true);
                const data = await getAdminDashboardAPI();
                setDashboardData(data);
            } catch (err: any) {
                console.error('Dashboard API failed:', err);
                setError('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []); // 👈 EMPTY dependency array = runs only once

    if (loading) return <div>Loading dashboard...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    
    return (
        <div className="space-y-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white">{t('admin.dashboard.title')}</h1>

            <ModerationQueue dashboardData={dashboardData} />

            <div className="space-y-8">
                <h2 className="text-2xl font-bold text-white">{t('admin.dashboard.analytics_title')}</h2>
                <KeyMetrics dashboardData={dashboardData} />
                <RegistrationsChart data={dashboardData.registrationsLast7Days || []} />
            </div>
        </div>
    );
};

export default Dashboard;