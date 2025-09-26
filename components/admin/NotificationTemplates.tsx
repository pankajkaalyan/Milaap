import React, { useState } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import Button from '../ui/Button';

interface TemplateProps {
    title: string;
    placeholders: string[];
    initialContent: string;
}

const TemplateEditor: React.FC<TemplateProps> = ({ title, placeholders, initialContent }) => {
    const { t, addToast } = useAppContext();
    const [content, setContent] = useState(initialContent);

    const handleSave = () => {
        // In a real app, this would be an API call
        console.log(`Saving template "${title}":`, content);
        addToast(t('toast.template.saved'), 'success');
    };

    return (
        <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <h4 className="font-semibold text-white">{title}</h4>
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                className="w-full mt-2 p-2 bg-gray-800 border border-gray-600 rounded-md text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-400">
                    {t('admin.comm.templates.placeholders')} <code className="text-amber-300">{placeholders.join(', ')}</code>
                </p>
                <Button onClick={handleSave} className="w-auto !py-1 !px-3 !text-xs">
                    {t('admin.comm.templates.save')}
                </Button>
            </div>
        </div>
    );
};

const NotificationTemplates: React.FC = () => {
    const { t } = useAppContext();

    return (
        <div className="space-y-6">
            {/* Push Notifications */}
            <div>
                <h3 className="text-xl font-bold text-white mb-3">{t('admin.comm.templates.push')}</h3>
                <div className="space-y-4">
                    <TemplateEditor
                        title={t('admin.comm.templates.new_match')}
                        placeholders={['{userName}', '{matchName}']}
                        initialContent="Congratulations {userName}! You have a new match: {matchName}. Check them out now!"
                    />
                    <TemplateEditor
                        title={t('admin.comm.templates.new_message')}
                        placeholders={['{userName}', '{senderName}']}
                        initialContent="{senderName} sent you a new message. Don't keep them waiting!"
                    />
                </div>
            </div>

            {/* Email Notifications */}
            <div>
                <h3 className="text-xl font-bold text-white mb-3">{t('admin.comm.templates.email')}</h3>
                <div className="space-y-4">
                    <TemplateEditor
                        title={t('admin.comm.templates.new_message')}
                        placeholders={['{userName}', '{senderName}']}
                        initialContent="Hi {userName},\n\nYou have received a new message from {senderName} on Milaap. Log in to view it.\n\nRegards,\nThe Milaap Team"
                    />
                     <TemplateEditor
                        title={t('admin.comm.templates.weekly_digest')}
                        placeholders={['{userName}']}
                        initialContent="Hi {userName},\n\nHere are your top recommended matches for the week. Log in to Milaap to connect with them!\n\nRegards,\nThe Milaap Team"
                    />
                </div>
            </div>

             {/* SMS Notifications */}
            <div>
                <h3 className="text-xl font-bold text-white mb-3">{t('admin.comm.templates.sms')}</h3>
                <div className="space-y-4">
                    <TemplateEditor
                        title={t('admin.comm.templates.new_message')}
                        placeholders={['{senderName}']}
                        initialContent="You have a new message from {senderName} on Milaap. Reply STOP to unsubscribe."
                    />
                </div>
            </div>
        </div>
    );
};

export default NotificationTemplates;