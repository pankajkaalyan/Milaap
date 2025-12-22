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
import { getChatConversationsAPI, getConversationMessagesAPI } from '@/services/api/chatService';

const MESSAGING_LIMIT_FREE_TIER = 3;

const Messages: React.FC = () => {
    const { t, user } = useAppContext();
    const { userId } = useParams<{ userId: string }>();
    const [userName, setUserName] = useState('');
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);
    const [receiverId, setReceiverId] = useState<string | ''>('');

    // Refs to hold mutable values
    const stompClient = useRef<any>(null);
    const subscriptionRef = useRef<any>(null);
    const connectedRef = useRef<boolean>(false);

    const lastUserRef = useRef(null);
    const lastTokenRef = useRef(null);
    // State to track previous userId and token
    const conversationsLoadedRef = useRef(false);
    const messagesLoadedRef = useRef({});


    const navigate = useNavigate();

    const [conversations, setConversations] = useState<Conversation[]>([]);
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

        const WS_BASE = import.meta.env.MODE === "development"
            ? ""
            : import.meta.env.VITE_MESSAGING_WS_URL;

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

        // setChat(prev => [...prev, msg]);  // safe append
        updateConversation(msg);

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
            console.log("Sending message:", { content, type });
            if (!userId) return alert("Receiver required");
            if (!stompClient.current?.connected)
                return alert("Not connected");

            const chatMessage = {
                senderId: user.id || user?.profile?.id,
                receiverId: parseInt(userId, 10),
                content,
                type,
                timestamp: new Date().toISOString(),
            };

            stompClient.current.send("/app/chat.send", {}, JSON.stringify(chatMessage));
        },
        [userId, user, selectedConversationId, conversations]
    );

    const updateConversation = (newMessage: Message) => {
        if (!newMessage.receiverId || !newMessage.senderId) {
            console.warn("Missing IDs", newMessage);
            return;
        }

        const chatMessage = transformMessage(newMessage, user?.id || user?.profile?.id);

        setConversations(prevConversations => {
            console.log("prevConversations:", prevConversations);
            return prevConversations.map(convo => {
                if (convo.userId == userId) {
                    return { ...convo, messages: [...convo.messages, chatMessage] };
                }
                return convo;
            });
        });
    };


    function transformMessage(apiMsg, loggedInUserId) {
        return {
            messageId: apiMsg.id,
            id: `${apiMsg.senderId}-${apiMsg.receiverId}-${apiMsg.id}`,
            senderId: apiMsg.senderId === loggedInUserId ? "me" : String(apiMsg.senderId),
            content: apiMsg.content,
            type: MessageType.TEXT,
            timestamp: convertTimestampToUTC(apiMsg.createdAt),
            status: apiMsg.senderId === loggedInUserId ? MessageStatus.SENT : MessageStatus.READ,
            receiverId: apiMsg.receiverId,
        };
    }

    function convertTimestampToUTC(localTimestamp) {
        const date = new Date(localTimestamp);
        return date.toISOString(); // auto-converts to UTC with Z
    }

    function addUserToConversation(data) {
        //setConversations(prev => [...prev, data]);
    }

    function removeUserFromConversation(userId) {
        //setConversations(prev => prev.filter(convo => convo.userId !== userId));
    }
    function updateUserInConversation(userId, newData) {
        //setConversations(prev => prev.map(convo => convo.userId === userId ? { ...convo, ...newData } : convo));
    }
    function clearConversations() {
        //setConversations([]);
    }
    function setAllConversations(rawData: any) {
        const data = Array.isArray(rawData)
            ? rawData
            : rawData?.data || rawData?.conversations || [];

        if (!Array.isArray(data)) {
            console.error("Invalid conversations response:", rawData);
            return;
        }

        const normalized: Conversation[] = data.map((convo) => ({
            ...convo,
            userName: convo.name,
            userId: convo.userId,
            profilePic: convo.profilePic,
            lastMessageAt: convo.lastMessageAt,
            lastMessage: convo.lastMessage,
            roomId: convo.roomId,
            messages: Array.isArray(convo.messages)
                ? convo.messages
                    .map(msg =>
                        transformMessage(msg, user?.id || user?.profile?.id)
                    )
                    .sort((a, b) =>
                        new Date(a.timestamp).getTime() -
                        new Date(b.timestamp).getTime()
                    )
                : [],
        }));

        setConversations(normalized);
    }


    //Chat Integration Code End here
    const selectedConversation = conversations.find(c => c.userId === selectedConversationId);
    const selectedUser = conversations.find(u => u.userId === selectedConversationId);

    // 1️⃣ Load conversations ONLY once when token exists
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token || conversationsLoadedRef.current) return;

        conversationsLoadedRef.current = true;

        getChatConversationsAPI()
            .then(res => setAllConversations(res))
            .catch(err =>
                console.error("Error fetching conversations:", err)
            );
    }, []);



    // 2️⃣ Connect STOMP when userId + token available
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token || !userId) return;
        connectStomp();


        return () => disconnectStomp();
    }, [userId]);  // ← only reconnect when userId changes

    // 4️⃣ When userId changes, select the conversation
    useEffect(() => {
        if (!userId) return;

        const numericUserId = parseInt(userId, 10);
        setSelectedConversationId(numericUserId);
    }, [userId]);


    // 3️⃣ Load messages for the selected conversation
    useEffect(() => {
        if (!selectedConversation?.roomId) return;

        const roomId = selectedConversation.roomId;
        if (messagesLoadedRef.current[roomId]) return;

        messagesLoadedRef.current[roomId] = true;

        getConversationMessagesAPI(roomId)
            .then((data) => {
                if (!Array.isArray(data)) return;

                const transformedMessages = data
                    .map(msg =>
                        transformMessage(msg, user?.id || user?.profile?.id)
                    )
                    .sort((a, b) =>
                        new Date(a.timestamp).getTime() -
                        new Date(b.timestamp).getTime()
                    );

                setConversations(prev =>
                    prev.map(convo =>
                        convo.userId === selectedConversation.userId
                            ? { ...convo, messages: transformedMessages }
                            : convo
                    )
                );
            })
            .catch(err =>
                console.error("Error fetching conversation messages:", err)
            );
    }, [selectedConversation]);


    const handleSelectConversation = (id: number) => {
        setSelectedConversationId(id);
        navigate(`/messages/${id}`);
    };

    // const sendMessage = useCallback((content: string, type: MessageType) => {
    //     if (!selectedConversationId) return;

    //     const newMessage: Message = {
    //         id: new Date().toISOString(),
    //         senderId: 'me',
    //         content,
    //         type,
    //         timestamp: new Date().toISOString(),
    //         status: MessageStatus.SENT,
    //     };

    //     const updatedConversations = conversations.map(convo => {
    //         if (convo.userId === selectedConversationId) {
    //             return { ...convo, messages: [...convo.messages, newMessage] };
    //         }
    //         return convo;
    //     });
    //     //setConversations(updatedConversations);

    //     // Simulate message status updates and a reply
    //     setTimeout(() => {
    //         //setConversations(prev => prev.map(c => c.userId === selectedConversationId ? { ...c, messages: c.messages.map(m => m.id === newMessage.id ? { ...m, status: MessageStatus.DELIVERED } : m) } : c));
    //     }, 1000);

    //     setTimeout(() => {
    //         //setConversations(prev => prev.map(c => c.userId === selectedConversationId ? { ...c, messages: c.messages.map(m => m.id === newMessage.id ? { ...m, status: MessageStatus.READ } : m) } : c));
    //         setIsTyping(true);
    //     }, 2500);

    //     setTimeout(() => {
    //         setIsTyping(false);
    //         const mockReply: Message = {
    //             id: new Date().toISOString() + '-reply',
    //             senderId: selectedConversationId,
    //             content: `That's interesting! Tell me more.`,
    //             type: MessageType.TEXT,
    //             timestamp: new Date().toISOString(),
    //             status: MessageStatus.READ, // Assuming it's read by the user instantly
    //         };
    //         //setConversations(prev => prev.map(c => c.userId === selectedConversationId ? { ...c, messages: [...c.messages, mockReply] } : c));
    //     }, 4500);

    // }, [selectedConversationId, conversations]);


    // console.log('Rendering Messages component with conversations:', conversations);
    // console.log('Selected conversation:', selectedConversation);
    // console.log('Selected user:', selectedUser);

    return (
        <>
            <div className="flex h-[calc(100vh-140px)] gap-4">

                {/* LEFT PANEL - Conversation List */}
                <div
                    className={`
            h-full border-r border-white/10 
            w-full md:w-1/3 lg:w-1/4 
            ${selectedConversationId ? "hidden md:block" : "block"} 
        `}
                >
                    <Card className="h-full !p-0 overflow-hidden flex flex-col">
                        <h1 className="text-xl font-bold text-white p-4 border-b border-white/10 shrink-0">
                            {t("messages.title")}
                        </h1>

                        <ConversationList
                            conversations={conversations}
                            selectedConversationId={selectedConversationId}
                            onSelectConversation={handleSelectConversation}
                        />
                    </Card>
                </div>

                {/* RIGHT PANEL - Chat Window */}
                <div
                    className={`
            h-full w-full 
            md:w-2/3 lg:w-3/4 
            ${!selectedConversationId ? "hidden md:flex" : "flex"} 
        `}
                >
                    {selectedConversation && selectedUser ? (
                        <div className="w-full h-full relative pt-12 md:pt-0">

                            {/* MOBILE BACK BUTTON */}
                            <button
                                className="md:hidden absolute top-4 left-0 z-20 bg-white/20 px-4 py-1.5 rounded-full text-sm"
                                onClick={() => navigate("/messages")}
                            >
                                ← Back
                            </button>

                            <ChatWindow
                                conversation={selectedConversation}
                                user={selectedUser as Conversation}
                                onSendMessage={sendMessageToFriend}
                                isTyping={isTyping}
                            />
                        </div>

                    ) : (
                        <Card className="h-full w-full flex items-center justify-center">
                            <p className="text-gray-400">
                                {t("messages.select_chat")}
                            </p>
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