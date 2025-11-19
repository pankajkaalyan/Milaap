import { useState, useEffect } from 'react';
import { conversationService } from '../../services/shared/conversationService';

type TFunction = (key: string, options?: Record<string, string | number>) => string;
type AddToastFunction = (message: string, type?: 'success' | 'error' | 'info') => void;

export interface ChatMessage {
    id: number;
    senderId: number;
    receiverId: number;
    content: string;
    timestamp: string;
}

export const useConversation = (
    chatWithUserId: number,
    t: TFunction,
    addToast: AddToastFunction
) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    // Fetch chat messages on load
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                setLoading(true);
                const data = await conversationService.getMessages(chatWithUserId);
                setMessages(data);
            } catch (error) {
                console.error("Failed to load messages:", error);
                addToast(t('errors.chat.loadFailed'), 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, [chatWithUserId]);

    // Send new message
    const sendMessage = async (text: string) => {
        try {
            const newMsg = await conversationService.sendMessage({
                receiverId: chatWithUserId,
                content: text,
            });

            // Add new message at bottom
            setMessages(prev => [...prev, newMsg]);

        } catch (error) {
            console.error("Failed to send message:", error);
            addToast(t('errors.chat.sendFailed'), 'error');
        }
    };

    return {
        messages,
        setMessages,
        sendMessage,
        loading,
    };
};
