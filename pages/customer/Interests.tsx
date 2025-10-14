import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import Card from '../../components/ui/Card';
import { Interest, User, InterestTab } from '../../types';
import { mockUsers } from '../../data/mockUsers';
import InterestCard from '../../components/customer/InterestCard';
import PageHeader from '../../components/ui/PageHeader';

interface TabButtonProps {
  tab: InterestTab;
  label: string;
  count: number;
}

const Interests: React.FC = () => {
    const { t, user, interests, acceptInterest, declineInterest } = useAppContext();
    const [activeTab, setActiveTab] = useState<InterestTab>(InterestTab.RECEIVED);

    const { received, sent } = useMemo(() => {
        console.log('user:', user);
        if (!user) return { received: [], sent: [] };
        console.log('interests:', interests);
        console.log('mockUsers:', mockUsers);
        interests.map(i => i.senderId = 4); // For testing purposes only, to be removed later
        console.log('interests: 1', interests);
        const receivedInterests = interests
            .filter(i => i.recipientId === user.id)
            .map(interest => {
                const sender = mockUsers.find(u => u.id === interest.senderId);
                return sender ? { interest, user: sender } : null;
            })
            .filter(Boolean);
            
        const sentInterests = interests
            .filter(i => i.senderId === user.id)
            .map(interest => {
                const receiver = mockUsers.find(u => u.id === interest.recipientId);
                return receiver ? { interest, user: receiver } : null;
            })
            .filter(Boolean);

        return { received: receivedInterests, sent: sentInterests };

    }, [interests, user]);

    const TabButton: React.FC<TabButtonProps> = ({ tab, label, count }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-semibold rounded-t-md transition-colors relative ${
                activeTab === tab
                ? 'bg-white/10 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
        >
            {label}
            <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${activeTab === tab ? 'bg-pink-600 text-white' : 'bg-gray-600 text-gray-200'}`}>{count}</span>
        </button>
    );

    const listToDisplay = activeTab === InterestTab.RECEIVED ? received : sent;
    const noResultsMessage = activeTab === InterestTab.RECEIVED ? t('interests.no_received') : t('interests.no_sent');

    return (
        <div className="max-w-5xl mx-auto">
            <PageHeader title={t('interests.title')} />
            
            <div className="flex border-b border-white/10 mb-6 animate-fade-in-up" style={{ animationDelay: '200ms'}}>
                <TabButton tab={InterestTab.RECEIVED} label={t('interests.received')} count={received.length} />
                <TabButton tab={InterestTab.SENT} label={t('interests.sent')} count={sent.length} />
            </div>

            {listToDisplay.length > 0 ? (
                <div className="space-y-4">
                    {listToDisplay.map((item, index) => (
                        item && (
                            <div key={item.interest.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 75}ms`}}>
                                <InterestCard
                                    user={item.user}
                                    interest={item.interest}
                                    type={activeTab}
                                    onAccept={() => acceptInterest(item.interest.senderId)}
                                    onDecline={() => declineInterest(item.interest.senderId)}
                                />
                            </div>
                        )
                    ))}
                </div>
            ) : (
                 <Card className="text-center py-16 animate-fade-in">
                    <p className="text-gray-300">{noResultsMessage}</p>
                </Card>
            )}
        </div>
    );
};

export default Interests;