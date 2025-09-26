import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import { useAppContext } from '../../hooks/useAppContext';
import { VerificationLog, BadgeVariant } from '../../types';
import ToggleSwitch from '../../components/ui/ToggleSwitch';
import Badge from '../../components/ui/Badge';

const VerificationLogs: React.FC = () => {
    const { t, verificationLogs: initialLogs, retriggerVerification } = useAppContext();
    const [logs, setLogs] = useState<VerificationLog[]>(initialLogs);
    const [isLive, setIsLive] = useState(true);

    // Simulate new log entries when live feed is on
    useEffect(() => {
        if (isLive) {
            const interval = setInterval(() => {
                const randomUser = { id: `user-${Math.floor(Math.random()*50)+1}`, name: `User ${Math.floor(Math.random()*50)+1}`};
                const newLog: VerificationLog = {
                    id: `log-${Date.now()}`,
                    userId: randomUser.id,
                    userName: randomUser.name,
                    type: Math.random() > 0.5 ? 'EMAIL' : 'OTP',
                    status: ['Success', 'Failed', 'Pending'][Math.floor(Math.random() * 3)] as any,
                    timestamp: new Date().toISOString(),
                };
                setLogs(prev => [newLog, ...prev].slice(0, 50)); // Keep the list size manageable
            }, 8000);
            
            // Cleanup function to clear the interval
            return () => clearInterval(interval);
        }
    }, [isLive]);
    
    const getStatusVariant = (status: VerificationLog['status']): BadgeVariant => {
        switch (status) {
            case 'Success': return BadgeVariant.SUCCESS;
            case 'Failed': return BadgeVariant.DANGER;
            case 'Pending': return BadgeVariant.WARNING;
            default: return BadgeVariant.PRIMARY;
        }
    };

    return (
        <Card>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-white">{t('admin.logs.title')}</h1>
                <ToggleSwitch id="live-feed" label={t('admin.logs.live_feed')} checked={isLive} onChange={setIsLive} />
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-gray-300">
                    <thead className="bg-white/10">
                        <tr>
                            <th className="p-3">{t('admin.logs.table.user')}</th>
                            <th className="p-3">{t('admin.logs.table.type')}</th>
                            <th className="p-3">{t('admin.logs.table.status')}</th>
                            <th className="p-3">{t('admin.logs.table.timestamp')}</th>
                            <th className="p-3 text-right">{t('admin.logs.table.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map(log => (
                            <tr key={log.id} className="border-b border-gray-700 hover:bg-white/5">
                                <td className="p-3">
                                    <div className="font-semibold">{log.userName}</div>
                                    <div className="text-xs text-gray-400">ID: {log.userId}</div>
                                </td>
                                <td className="p-3">{t(`admin.logs.type.${log.type.toLowerCase()}` as any)}</td>
                                <td className="p-3">
                                    <Badge variant={getStatusVariant(log.status)}>
                                        {t(`admin.logs.status.${log.status.toLowerCase()}` as any)}
                                    </Badge>
                                </td>
                                <td className="p-3">{new Date(log.timestamp).toLocaleString()}</td>
                                <td className="p-3 text-right">
                                    {(log.status === 'Failed' || log.status === 'Pending') && (
                                        <button 
                                            onClick={() => retriggerVerification(log.id)}
                                            className="px-3 py-1 text-sm font-semibold text-white bg-pink-600 rounded-md hover:bg-pink-700 transition-colors cursor-pointer"
                                        >
                                            {t('admin.logs.retrigger')}
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default VerificationLogs;