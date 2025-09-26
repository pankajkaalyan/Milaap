import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../hooks/useAppContext';
import { mockConversationsData } from '../../data/mockConversations';
import { mockUsers } from '../../data/mockUsers';
import { Conversation, Message, MessageStatus, MessageType, Match, MembershipPlan } from '../../types';
import ConversationList from '../../components/customer/chat/ConversationList';
import ChatWindow from '../../components/customer/chat/ChatWindow';
import Card from '../../components/ui/Card';
import PremiumFeatureModal from '../../components/customer/PremiumFeatureModal';

const MESSAGING_LIMIT_FREE_TIER = 3;

const Messages: React.FC = () => {
    const { t, user } = useAppContext();
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    
    const [conversations, setConversations] = useState<Conversation[]>(mockConversationsData);
    const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
    const [isTyping, setIsTyping] = useState(false);
    const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);

    const isPremiumUser = user?.profile?.membership !== MembershipPlan.FREE;

    useEffect(() => {
        if (userId) {
            const numericUserId = parseInt(userId, 10);
            const conversationExists = conversations.some(c => c.userId === numericUserId);
            
            if (!conversationExists) {
                // Check if user can start a new conversation
                if (!isPremiumUser && conversations.length >= MESSAGING_LIMIT_FREE_TIER) {
                    setIsPremiumModalOpen(true);
                    navigate('/messages'); // Go back to the main messages view
                    return;
                }

                const targetUser = mockUsers.find(u => u.id === numericUserId);
                if (targetUser) {
                    const newConversation: Conversation = {
                        userId: targetUser.id,
                        userName: targetUser.name,
                        messages: [],
                    };
                    setConversations(prev => [newConversation, ...prev]);
                }
            }
            setSelectedConversationId(numericUserId);
        }
    }, [userId, conversations, isPremiumUser, navigate]);

    const handleSelectConversation = (id: number) => {
        setSelectedConversationId(id);
        navigate(`/messages/${id}`);
    };

    const sendMessage = useCallback((content: string, type: MessageType) => {
        if (!selectedConversationId) return;

        const newMessage: Message = {
            id: new Date().toISOString(),
            senderId: 'me',
            content,
            type,
            timestamp: new Date().toISOString(),
            status: MessageStatus.SENT,
        };

        const updatedConversations = conversations.map(convo => {
            if (convo.userId === selectedConversationId) {
                return { ...convo, messages: [...convo.messages, newMessage] };
            }
            return convo;
        });
        setConversations(updatedConversations);

        // Simulate message status updates and a reply
        setTimeout(() => {
             setConversations(prev => prev.map(c => c.userId === selectedConversationId ? { ...c, messages: c.messages.map(m => m.id === newMessage.id ? {...m, status: MessageStatus.DELIVERED} : m) } : c));
        }, 1000);

        setTimeout(() => {
             setConversations(prev => prev.map(c => c.userId === selectedConversationId ? { ...c, messages: c.messages.map(m => m.id === newMessage.id ? {...m, status: MessageStatus.READ} : m) } : c));
             setIsTyping(true);
        }, 2500);

        setTimeout(() => {
            setIsTyping(false);
            const mockReply: Message = {
                id: new Date().toISOString() + '-reply',
                senderId: selectedConversationId,
                content: `That's interesting! Tell me more.`,
                type: MessageType.TEXT,
                timestamp: new Date().toISOString(),
                status: MessageStatus.READ, // Assuming it's read by the user instantly
            };
             setConversations(prev => prev.map(c => c.userId === selectedConversationId ? { ...c, messages: [...c.messages, mockReply] } : c));
        }, 4500);

    }, [selectedConversationId, conversations]);

    const selectedConversation = conversations.find(c => c.userId === selectedConversationId);
    const selectedUser = mockUsers.find(u => u.id === selectedConversationId);

    return (
        <>
            <div className="flex flex-col md:flex-row h-[calc(100vh-200px)] gap-4">
                <div className="w-full md:w-1/3 lg:w-1/4 h-full">
                    <Card className="h-full !p-0 overflow-hidden flex flex-col">
                        <h1 className="text-xl font-bold text-white p-4 border-b border-white/10 shrink-0">{t('messages.title')}</h1>
                        <ConversationList
                            conversations={conversations}
                            selectedConversationId={selectedConversationId}
                            onSelectConversation={handleSelectConversation}
                        />
                    </Card>
                </div>
                <div className="w-full md:w-2/3 lg:w-3/4 h-full">
                    {selectedConversation && selectedUser ? (
                        <ChatWindow
                            conversation={selectedConversation}
                            user={selectedUser as Match}
                            onSendMessage={sendMessage}
                            isTyping={isTyping}
                        />
                    ) : (
                        <Card className="h-full flex items-center justify-center">
                            <p className="text-gray-400">{t('messages.select_chat')}</p>
                        </Card>
                    )}
                </div>
            </div>
            {isPremiumModalOpen && (
                <PremiumFeatureModal
                    isOpen={isPremiumModalOpen}
                    onClose={() => setIsPremiumModalOpen(false)}
                    title={t('messages.limit_title')}
                    description={t('messages.limit_desc')}
                />
            )}
        </>
    );
};

export default Messages;