import React from 'react';
import { Conversation, MessageType } from '../../../types';
import { mockUsers } from '../../../data/mockUsers';
import { use } from 'framer-motion/client';

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId: number | null;
  onSelectConversation: (userId: string | number) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({ conversations, selectedConversationId, onSelectConversation }) => {

  const getAvatarUrl = (userId: string | number) => {
    const user = conversations.find(u => u.userId === userId);
    return user?.profilePic;
  };

  const getLastMessagePreview = (conversation: Conversation) => {
    if (conversation.messages.length === 0) {
      return 'No messages yet';
    }
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    switch(lastMessage.type) {
        case MessageType.TEXT:
            return lastMessage.content.length > 25 ? `${lastMessage.content.substring(0, 25)}...` : lastMessage.content;
        case MessageType.IMAGE:
            return '📷 Photo';
        case MessageType.AUDIO:
            return '🎤 Audio message';
        default:
            return '';
    }
  };

  return (
    <div className="overflow-y-auto h-full">
      <ul>
        {conversations.map((convo) => (
          <li key={convo.userId}>
            <button
              onClick={() => onSelectConversation(convo.userId)}
              className={`w-full text-left p-3 flex items-center space-x-3 transition-colors duration-200 ${
                selectedConversationId === convo.userId
                  ? 'bg-white/20'
                  : 'hover:bg-white/10'
              }`}
            >
              <img
                src={getAvatarUrl(convo.userId)}
                alt={convo.userName}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1 overflow-hidden">
                <h3 className="font-semibold text-white truncate">{convo.userName}</h3>
                <p className="text-sm text-gray-400 truncate">{getLastMessagePreview(convo)}</p>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConversationList;
