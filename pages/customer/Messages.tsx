import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../hooks/useAppContext';
import { mockConversationsData } from '../../data/mockConversations';
import { mockUsers } from '../../data/mockUsers';
import { Conversation, Message, MessageStatus, MessageType, Match, MembershipPlan } from '../../types';
import ConversationList from '../../components/customer/chat/ConversationList';
import ChatWindow from '../../components/customer/chat/ChatWindow';
import Card from '../../components/ui/Card';
import PremiumFeatureModal from '../../components/customer/PremiumFeatureModal';
import SockJS from 'sockjs-client';
import { over } from 'stompjs';
import { s } from 'framer-motion/client';

const MESSAGING_LIMIT_FREE_TIER = 3;

const Messages: React.FC = () => {
    const { t, user } = useAppContext();
    const { userId } = useParams<{ userId: string }>();
    const [userName, setUserName] = useState('');
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);
    const [receiverId, setReceiverId] = useState<string | ''>('');

    // Refs to hold mutable values
    const stompClient = useRef(null);
    const subscriptionRef = useRef(null);
    const connectedRef = useRef(false);

    const lastUserRef = useRef(null);
    const lastTokenRef = useRef(null);
    // State to track previous userId and token



    const navigate = useNavigate();

    const [conversations, setConversations] = useState<Conversation[]>(mockConversationsData);
    const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
    const [isTyping, setIsTyping] = useState(false);
    const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
    const [serverUrl, setServerUrl] = useState("http://localhost:8080");

    const isPremiumUser = user?.profile?.membership !== MembershipPlan.FREE;

    // Chat Integration Code Start here

    // ---------------- CONNECT ----------------
    const connectStomp = useCallback(() => {
        const token = localStorage.getItem("token");

        if (!token || !userId) {
            console.warn("Token or user missing — skipping connection.");
            return;
        }

        // Already connected with same user/token → skip
        if (
            connectedRef.current &&
            lastUserRef.current === userId &&
            lastTokenRef.current === token
        ) {
            console.log("Already connected — skipping connect()");
            return;
        }

        // Connected with a different user → reconnect
        if (connectedRef.current) {
            console.log("User/token changed → reconnecting...");
            disconnectStomp();
        }

        // Save identifiers
        lastUserRef.current = userId;
        lastTokenRef.current = token;

        const WS_BASE =
            import.meta.env.MODE === "development"
                ? ""
                : import.meta.env.VITE_API_URL;

        console.log("Creating NEW WebSocket/STOMP connection…");

        const socket = new SockJS(
            WS_BASE + "/ws/chat?token=" + encodeURIComponent(token),
            null,
            { withCredentials: true }
        );

        stompClient.current = over(socket);
        stompClient.current.debug = () => { };

        stompClient.current.connect(
            {},
            () => {
                connectedRef.current = true;
                onConnected();
            },
            onError
        );

    }, [userId]);

    // ---------------- MESSAGE HANDLER (STABLE) ----------------
    const onMessageReceived = useCallback((payload) => {
        if (!payload?.body) return;

        let msg;
        try {
            msg = JSON.parse(payload.body);
        } catch (e) {
            console.error("Invalid JSON:", e);
            return;
        }

        console.log("Message received:", msg);

        setChat(prev => [...prev, msg]);  // safe append

    }, []);   // <-- VERY IMPORTANT (no duplicates)

    // ---------------- SUBSCRIBE ONCE (STABLE) ----------------
    const subscribeOnce = useCallback(() => {

        if (!stompClient.current || !stompClient.current.connected) {
            console.log("STOMP not connected — cannot subscribe");
            return;
        }

        if (subscriptionRef.current) {
            console.log("Already subscribed — skipping.");
            return;
        }

        subscriptionRef.current = stompClient.current.subscribe(
            "/user/queue/messages",
            onMessageReceived   // stable function
        );

        console.log("Subscribed to /user/queue/messages");

    }, [onMessageReceived]);

    // ---------------- ON CONNECTED ----------------
    const onConnected = useCallback(() => {
        console.log("Connected to WebSocket server");
        subscribeOnce();   // subscribe exactly once
    }, [subscribeOnce]);

    // ---------------- DISCONNECT ----------------
    const disconnectStomp = useCallback(() => {

        if (subscriptionRef.current) {
            try {
                subscriptionRef.current.unsubscribe();
            } catch { }
            subscriptionRef.current = null;
        }

        if (stompClient.current) {
            try {
                stompClient.current.disconnect(() => {
                    console.log("STOMP disconnected");
                    connectedRef.current = false;
                });
            } catch { }
        }

    }, []);

    // ---------------- ON ERROR ----------------
    const onError = useCallback((error) => {
        console.error("❌ STOMP Error:", error);

        connectedRef.current = false;

        if (subscriptionRef.current) {
            try {
                subscriptionRef.current.unsubscribe();
            } catch { }
            subscriptionRef.current = null;
        }

        setTimeout(() => {
            console.log("🔄 Reconnecting...");
            connectStomp();
        }, 2000);

    }, [connectStomp]);

    // ---------------- SEND MESSAGE ----------------
    const sendMessageToFriend = useCallback(
        (content, type) => {
            if (!receiverId) return alert("Receiver required");
            if (!stompClient.current?.connected)
                return alert("Not connected");

            const chatMessage = {
                senderId: user?.profile?.id,
                receiverId: parseInt(receiverId, 10),
                content,
                type,
                timestamp: new Date().toISOString(),
            };

            stompClient.current.send("/app/chat.send", {}, JSON.stringify(chatMessage));
        },
        [receiverId, user]
    );

    //Chat Integration Code End here


    useEffect(() => {
        // Try connection ONLY when userId + token available
        const token = localStorage.getItem("token");
        if (userId && token) {
            connectStomp();
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
        // Cleanup on unmount
        return () => {
            disconnectStomp();
        };
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
            setConversations(prev => prev.map(c => c.userId === selectedConversationId ? { ...c, messages: c.messages.map(m => m.id === newMessage.id ? { ...m, status: MessageStatus.DELIVERED } : m) } : c));
        }, 1000);

        setTimeout(() => {
            setConversations(prev => prev.map(c => c.userId === selectedConversationId ? { ...c, messages: c.messages.map(m => m.id === newMessage.id ? { ...m, status: MessageStatus.READ } : m) } : c));
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
                        <>
                            <input
                                value={receiverId}
                                onChange={(e) => setReceiverId(e.target.value)}
                                placeholder="Enter your user id"
                            />
                            <ChatWindow
                                conversation={selectedConversation}
                                user={selectedUser as Match}
                                onSendMessage={sendMessageToFriend}
                                isTyping={isTyping}
                            />
                        </>

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