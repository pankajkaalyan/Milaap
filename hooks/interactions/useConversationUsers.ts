import { useState, useEffect } from 'react';

// Example Type — change based on API response
export interface ConversationUser {
    id: number;
    name: string;
    lastMessage: string;
    avatar?: string;
    updatedAt?: string;
}

// Example service — replace with your api service
import { conversationService } from '../../services/shared/conversationService';

type TFunction = (key: string, options?: Record<string, string | number>) => string;
type AddToastFunction = (message: string, type?: 'success' | 'error' | 'info') => void;

export const useConversationUsers = (t: TFunction, addToast: AddToastFunction) => {
    const [conversationUsers, setConversationUsers] = useState<ConversationUser[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchConversationUsers = async () => {
        try {
            setLoading(true);
            // const userList = await conversationService.getConversationUserList();
            // setConversationUsers(userList);
        } catch (error) {
            console.error("Failed to fetch conversation users:", error);
            addToast(t('toasts.conversation.load_failed'), 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConversationUsers();
    }, []);

    return {
        conversationUsers,
        setConversationUsers,
        loading,
        refetch: fetchConversationUsers
    };
};
