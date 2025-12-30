import React, { useMemo, useEffect } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { ButtonVariant } from '../../types';

const Reports: React.FC = () => {
    const { t, reports, getReports, resolveReport, dismissReport, warnUser, suspendUserChat } = useAppContext();

    // Call getReports once on mount if we don't already have reports
    const getReportsRef = React.useRef(getReports);
    useEffect(() => {
        let mounted = true;
        console.log('Reports component mounted', reports);
        if (Array.isArray(reports) && reports.length > 0) return; // already loaded
        (async () => {
            try {
                await getReportsRef.current?.();
            } catch (err) {
                console.error('Failed to load reports:', err);
            }
        })();
        return () => { mounted = false; };
    }, []); // run only once on mount

    const pendingReports = useMemo(() => reports.filter(r => r.status.toLowerCase() === 'pending'), [reports]);

    return (
        <Card>
            <h1 className="text-3xl font-bold text-white mb-6">{t('admin.reports.title')}</h1>

            {pendingReports.length > 0 ? (
                <div className="space-y-4">
                    {pendingReports.map(report => (
                        <div key={report.id} className="bg-white/5 p-4 rounded-lg border border-white/10">
                            <div className="flex flex-col md:flex-row justify-between md:items-center">
                                <div>
                                    <div className="text-xs text-gray-400">
                                        {t('admin.reports.reporter')}: {report.reporterName || `User ID ${report.reporterId}`}
                                    </div>
                                    <h3 className="font-bold text-lg text-white">
                                        {t('admin.reports.reported_user')}: {report.reportedUserName || `User ID ${report.reportedUserId}`}
                                    </h3>
                                    <p className="text-sm text-amber-300 font-semibold">{report.reason}</p>
                                </div>
                                <div className="text-xs text-gray-400 mt-2 md:mt-0">
                                    {new Date(report.timestamp).toLocaleString()}
                                </div>
                            </div>
                            <blockquote className="mt-3 pl-3 border-l-2 border-gray-600 text-gray-300 italic">
                                "{report.details || 'No additional details provided.'}"
                            </blockquote>
                            <div className="flex flex-wrap justify-end gap-3 mt-4">
                                <Button onClick={() => dismissReport(report.id)} variant={ButtonVariant.SECONDARY} className="w-auto !py-1 !px-3 !text-sm !bg-gradient-to-r !from-green-600 !to-teal-600">
                                    {t('admin.actions.dismiss')}
                                </Button>
                                {/* {report.reason === 'inappropriate' && (
                                    <> */}
                                        <Button onClick={() => warnUser(report.reportedUserId)} className="w-auto !py-1 !px-3 !text-sm !bg-gradient-to-r !from-yellow-600 !to-orange-500">
                                            {t('admin.actions.warn')}
                                        </Button>
                                        <Button onClick={() => suspendUserChat(report.reportedUserId)} className="w-auto !py-1 !px-3 !text-sm !bg-gradient-to-r !from-red-600 !to-red-800">
                                            {t('admin.actions.suspend_chat')}
                                        </Button>
                                    {/* </>
                                )} */}
                                
                                <Button onClick={() => resolveReport(report.id)} className="w-auto !py-1 !px-3 !text-sm !bg-gradient-to-r !from-red-700 !to-red-900">
                                    {t('admin.actions.suspend_user')}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                 <div className="text-center py-12">
                    <p className="text-gray-400">{t('admin.reports.no_reports')}</p>
                </div>
            )}
        </Card>
    );
};

export default Reports;