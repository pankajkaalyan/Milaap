import React, { useRef, useEffect, useState } from 'react';
import { Conversation, Match, MessageType } from '../../../types';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import CallingModal from './CallingModal';
import Card from '../../ui/Card';
import VideoIcon from '../../icons/VideoIcon';
import PhoneIcon from '../../icons/PhoneIcon';

interface ChatWindowProps {
  conversation: Conversation;
  user: Match;
  onSendMessage: (content: string, type: MessageType) => void;
  isTyping: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ conversation, user, onSendMessage, isTyping }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isCalling, setIsCalling] = useState(false);
  const [callType, setCallType] = useState<'video' | 'voice' | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [conversation.messages, isTyping]);

  const handleCall = (type: 'video' | 'voice') => {
      setCallType(type);
      setIsCalling(true);
  }

  return (
    <Card className="h-full !p-0 flex flex-col">
      <div className="flex items-center justify-between p-3 border-b border-white/10 shrink-0">
        <div className="flex items-center space-x-3">
            <img src={user.photos?.[0] || `https://picsum.photos/100/100?random=${user.id}`} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
            <h2 className="font-semibold text-white">{user.name}</h2>
        </div>
        <div className="flex items-center space-x-4 text-gray-400">
            <button className="hover:text-white transition-colors" onClick={() => handleCall('voice')} aria-label="Start voice call"><PhoneIcon className="h-6 w-6" /></button>
            <button className="hover:text-white transition-colors" onClick={() => handleCall('video')} aria-label="Start video call"><VideoIcon className="h-6 w-6" /></button>
        </div>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {conversation.messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isTyping && (
             <div className="flex items-center space-x-2">
                <img src={user.photos?.[0] || `https://picsum.photos/100/100?random=${user.id}`} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                <div className="bg-gray-700 text-white p-3 rounded-lg rounded-bl-none text-sm">
                    <span className="typing-indicator">
                        <span></span><span></span><span></span>
                    </span>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-white/10 shrink-0">
        <ChatInput onSendMessage={onSendMessage} />
      </div>
      
      {isCalling && callType && (
          <CallingModal user={user} onClose={() => setIsCalling(false)} />
      )}
    </Card>
  );
};

export default ChatWindow;
