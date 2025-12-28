import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import { useAppContext } from '../../hooks/useAppContext';
import { VerificationLog, BadgeVariant } from '../../types';
import ToggleSwitch from '../../components/ui/ToggleSwitch';
import Badge from '../../components/ui/Badge';

const VerificationLogs: React.FC = () => {
    const { t, verificationLogs: initialLogs, retriggerVerification, getVerificationLogs } = useAppContext();
    // Ensure `logs` is always an array to avoid runtime `map` errors
    const initialNormalizedLogs = Array.isArray(initialLogs)
        ? initialLogs
        : Array.isArray((initialLogs as any)?.items)
            ? (initialLogs as any).items
            : [];
    const [logs, setLogs] = useState<VerificationLog[]>(initialNormalizedLogs);
    const [isLive, setIsLive] = useState(true);

    // Simulate new log entries when live feed is on
    useEffect(() => {
        // if (isLive) {
        //     const interval = setInterval(() => {
        //         const randomUser = { id: `user-${Math.floor(Math.random()*50)+1}`, name: `User ${Math.floor(Math.random()*50)+1}`};
        //         const newLog: VerificationLog = {
        //             id: `log-${Date.now()}`,
        //             userId: randomUser.id,
        //             userName: randomUser.name,
        //             type: Math.random() > 0.5 ? 'EMAIL' : 'OTP',
        //             status: ['Success', 'Failed', 'Pending'][Math.floor(Math.random() * 3)] as any,
        //             timestamp: new Date().toISOString(),
        //         };
        //         setLogs(prev => [newLog, ...prev].slice(0, 50)); // Keep the list size manageable
        //     }, 8000);
            
        //     // Cleanup function to clear the interval
        //     return () => clearInterval(interval);
        // }
    }, [isLive]);

    // Load verification logs on mount (only in this component)
    // Use a ref to avoid re-running the effect if the context function identity changes
    const getVerificationLogsRef = React.useRef(getVerificationLogs);
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const fresh = await getVerificationLogsRef.current();
                if (!mounted) return;

                // Accept either: an array of logs, or a paginated object with `items`
                if (Array.isArray(fresh)) {
                    setLogs(fresh as Array<VerificationLog>);
                } else if (Array.isArray((fresh as any)?.items)) {
                    setLogs((fresh as any).items as Array<VerificationLog>);
                } else {
                    // Fallback to empty array to ensure `logs` is always an array
                    console.warn('Unexpected verification logs shape, defaulting to empty array:', fresh);
                    setLogs([]);
                }
            } catch (err) {
                console.error('Failed to load verification logs on mount', err);
            }
        })();
        return () => { mounted = false; };
    }, []); // intentionally empty: run only once on mount
    
    const getStatusVariant = (status: VerificationLog['status']): BadgeVariant => {
        switch (status) {
            case 'Success': return BadgeVariant.SUCCESS;
            case 'Failed': return BadgeVariant.DANGER;
            case 'Pending': return BadgeVariant.WARNING;
            default: return BadgeVariant.PRIMARY;
        }
    };

    console.log('Rendering VerificationLogs with logs:', logs);

    return (
        <Card>
            {/* <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-white">{t('nav.admin_servic_requests')}</h1>
                <ToggleSwitch id="live-feed" label={t('admin.logs.live_feed')} checked={isLive} onChange={setIsLive} />
            </div> */}

            <div className="overflow-x-auto rounded-lg overflow-hidden border border-white/5">
                <table className="w-full text-left text-gray-300">
                    <thead className="bg-white/10 sticky top-0 z-20">
                        <tr className="text-sm uppercase tracking-wider text-gray-400">
                            <th className="p-3">{t('admin.logs.table.user')}</th>
                            <th className="p-3">{t('admin.logs.table.email')}</th>
                            <th className="p-3">{t('admin.logs.table.message')}</th>
                            <th className="p-3">{t('admin.logs.table.timestamp')}</th>
                            {/* <th className="p-3 text-right">{t('admin.logs.table.actions')}</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {logs && Array.isArray(logs) && logs.map(log => (
                            <tr key={log.id} className="border-b border-white/10 hover:bg-white/5">
                                <td className="p-3">
                                    <div className="font-semibold">{log.fullName}</div>
                                    {/* <div className="text-xs text-gray-400">ID: {log.userId}</div> */}
                                </td>
                                <td className="p-3">{log.email}</td>
                                <td className="p-3 align-top">
                                    <div className="flex flex-col">
                                        {/* <div className="mb-2">
                                            <Badge variant={getStatusVariant(log.status)} className="mr-2">
                                                {t(`admin.logs.status.${(log.status || '').toLowerCase()}` as any) || log.status || '—'}
                                            </Badge>
                                        </div> */}
                                        <div className="text-sm text-gray-200 break-words whitespace-pre-wrap break-all max-w-full" title={log.message || ''}>
                                            {log.message || <span className="text-gray-400">{t('admin.logs.no_message') || 'No details provided'}</span>}
                                        </div>
                                        {log.userId && <div className="text-xs text-gray-400 mt-2">ID: {log.userId}</div>}
                                    </div>
                                </td>
                                <td className="p-3">{new Date(log.createdAt).toLocaleString()}</td>
                                {/* <td className="p-3 text-right">
                                    {(log.status === 'Failed' || log.status === 'Pending') && (
                                        <button 
                                            onClick={() => retriggerVerification(log.id)}
                                            className="px-3 py-1 text-sm font-semibold text-white bg-pink-600 rounded-md hover:bg-pink-700 transition-colors cursor-pointer"
                                        >
                                            {t('admin.logs.retrigger')}
                                        </button>
                                    )}
                                </td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default VerificationLogs;