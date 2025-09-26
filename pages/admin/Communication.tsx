import React from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import Card from '../../components/ui/Card';
import ChatMonitor from '../../components/admin/ChatMonitor';
import NotificationTemplates from '../../components/admin/NotificationTemplates';

const Communication: React.FC = () => {
    const { t } = useAppContext();
    
    return (
        <div className="space-y-8">
             <h1 className="text-3xl md:text-4xl font-bold text-white">{t('admin.communication.title')}</h1>
             
             <Card>
                <h2 className="text-2xl font-bold text-white mb-2">{t('admin.communication.chat_monitor.title')}</h2>
                <p className="text-gray-400 mb-6">{t('admin.communication.chat_monitor.desc')}</p>
                <ChatMonitor />
             </Card>

             <Card>
                <h2 className="text-2xl font-bold text-white mb-2">{t('admin.communication.templates.title')}</h2>
                <p className="text-gray-400 mb-6">{t('admin.communication.templates.desc')}</p>
                <NotificationTemplates />
             </Card>
        </div>
    );
};

export default Communication;