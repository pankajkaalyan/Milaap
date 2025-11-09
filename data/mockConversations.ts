import { Conversation, Message, MessageStatus, MessageType } from "../types";
import { mockUsers } from "./mockUsers";

const createMessage = (id: string | number, senderId: string | number, content: string, type: MessageType, minutesAgo: number, status: MessageStatus): Message => ({
    id,
    senderId,
    content,
    type,
    timestamp: new Date(Date.now() - minutesAgo * 60 * 1000).toISOString(),
    status,
});

export const mockConversationsData: Conversation[] = mockUsers.slice(0, 8).map((user, index) => ({
    userId: user.id,
    userName: user.name,
    messages: [
        createMessage(`${user.id}-1`, user.id, `Hey there! I saw your profile and was really impressed.`, MessageType.TEXT, (index + 1) * 20 + 5, MessageStatus.READ),
        createMessage(`${user.id}-2`, 'me', `Hi ${user.name.split(' ')[0]}! Thanks, I appreciate that. Your profile is very interesting too.`, MessageType.TEXT, (index + 1) * 20 + 4, MessageStatus.READ),
        createMessage(`${user.id}-3`, user.id, `That's great to hear! What do you like to do in your free time?`, MessageType.TEXT, (index + 1) * 20 + 3, MessageStatus.READ),
        ...(index % 3 === 0 ? [createMessage(`${user.id}-4`, 'me', `I'm a big fan of hiking and trying out new cafes. How about you?`, MessageType.TEXT, 5, MessageStatus.DELIVERED)] : []),
        ...(index % 3 === 1 ? [createMessage(`${user.id}-5`, user.id, `I'm into photography. Here's one of my recent clicks!`, MessageType.TEXT, 8, MessageStatus.READ), createMessage(`${user.id}-6`, user.id, `https://picsum.photos/400/300?random=${Number(user.id) + 20}`, MessageType.IMAGE, 7, MessageStatus.READ)] : []),
    ]
}));