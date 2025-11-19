export const conversationService = {
    getMessages: async (userId: number) => {
        const res = await fetch(`/api/chat/${userId}`);
        return res.json();
    },

    sendMessage: async (body: { receiverId: number; content: string }) => {
        const res = await fetch(`/api/chat/send`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        return res.json();
    }
};
