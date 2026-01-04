import React, { useRef, useEffect, useState } from 'react';
import { Conversation, Match, MessageType } from '../../../types';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import CallingModal from './CallingModal';
import Card from '../../ui/Card';
import VideoIcon from '../../icons/VideoIcon';
import PhoneIcon from '../../icons/PhoneIcon';
import ReportModal from './ReportModal';
import { useAppContext } from '../../../hooks/useAppContext';
import { reportChatMessagesAPI } from '@/services/api/chatService';

interface ChatWindowProps {
  conversation: Conversation;
  user: Conversation;
  onSendMessage: (content: string, type: MessageType) => void;
  isTyping: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ conversation, user, onSendMessage, isTyping }) => {
  const { addToast,t } = useAppContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isCalling, setIsCalling] = useState(false);
  const [callType, setCallType] = useState<'video' | 'voice' | null>(null);
  const [selectedMessages, setSelectedMessages] = useState<number[]>([]);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [conversation.messages, isTyping]);

  const handleCall = (type: 'video' | 'voice') => {
    setCallType(type);
    setIsCalling(true);
  }

  const [imgError, setImgError] = useState(false)

  const initials = user.userName
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const showInitials = imgError || !user.profilePic


  const toggleMessage = (id: number) => {
    setSelectedMessages(prev => {
      if (prev.includes(id)) {
        return prev.filter(m => m !== id);
      }
      if (prev.length >= 10) {
        alert("You can report maximum 10 messages");
        return prev;
      }
      return [...prev, id];
    });
  };




  // console.log('Rendering ChatWindow for conversation:', conversation);
  const submitReport = async (reportReason) => {
    if (!reportReason.trim()) {
      alert("Please provide a reason");
      return;
    }
    try {
      try {
        await reportChatMessagesAPI({
          chatId: conversation.roomId,
          messageIds: selectedMessages.sort((a, b) => a - b),
          reason: reportReason,
        });
        // ✅ Success toast
        addToast(
          t('report.messages.success') || 'Report submitted successfully',
          'success'
        );
        // Optional clean-up
        setSelectedMessages([]);
        setIsReportOpen(false);
      } catch (error) {
        console.error(error);

        // ❌ Error toast
        addToast(
          t('report.messages.error') || 'Failed to submit report',
          'error'
        );
      }
      setSelectedMessages([]);
      setReportReason("");
      setIsReportOpen(false);
    } catch (err) {
      console.error("Report failed", err);
    }
  };

  const handleReportSubmit = (selectedMessages, reportReason) => {
    submitReport(reportReason);
    // API call here
  };


  // console.log('user:', user);

  return (
    <Card className="h-full !p-0 flex flex-col">
      <div className="flex items-center justify-between p-3 border-b border-white/10 shrink-0">
        <div className="flex items-center space-x-3">
          {/* <img src={user.profilePic} alt={user.userName} className="w-10 h-10 rounded-full object-cover" /> */}
          <>
            {!showInitials ? (
              <img
                src={user.profilePic}
                alt={user.userName}
                className="w-10 h-10 rounded-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-orange-200 text-orange-800 flex items-center justify-center text-xs font-bold">
                {initials}
              </div>
            )}
          </>

          <h2 className="font-semibold text-white">{user.userName}</h2>
        </div>

        <div className="flex items-center space-x-4 text-gray-400">
          {selectedMessages.length > 0 && (
            <button
              className="bg-red-600 hover:bg-red-700 
    text-white px-5 py-2 rounded-full shadow-lg"
              onClick={() => setIsReportOpen(true)}
            >
              Report ({selectedMessages.length})
            </button>
          )}
          {/* <button className="hover:text-white transition-colors" onClick={() => handleCall('voice')} aria-label="Start voice call"><PhoneIcon className="h-6 w-6" /></button>
          <button className="hover:text-white transition-colors" onClick={() => handleCall('video')} aria-label="Start video call"><VideoIcon className="h-6 w-6" /></button> */}
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {conversation.messages.map((msg) => (
          <div key={msg.id + 'grp'} className="relative group pl-8">
            <input key={msg.id + 'msg'}
              type="checkbox"
              checked={selectedMessages.includes(msg.messageId as number)}
              onChange={() => toggleMessage(msg.messageId as number)}
              className={`absolute ${msg.senderId === 'me' ? 'left-1' : 'left-1'} top-1/2 -translate-y-1/2 w-6 h-6 cursor-pointer z-10 transition-opacity ${selectedMessages.includes(msg.id as number)}
                ? 'opacity-100'
                : 'opacity-0 group-hover:opacity-100'
                }`}
            />
            <MessageBubble key={msg.id} message={msg} />
          </div>

        ))}
        {isTyping && (
          <div className="flex items-center space-x-2">
            <img src={user.profilePic} alt={user.userName} className="w-8 h-8 rounded-full object-cover" />
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

      {/* <ReportModal
        open={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        onSubmit={handleReportSubmit}
        selectedMessages={selectedMessages}
      /> */}

      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        selectedMessages={selectedMessages}
        onConfirm={({ selectedMessages, reportReason }) => {
          handleReportSubmit(selectedMessages, reportReason);
        }}
      />


    </Card>
  );
};

export default ChatWindow;
