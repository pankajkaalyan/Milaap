import React from 'react';
import { Message, MessageStatus, MessageType, MediaPlayerType } from '../../../types';
import { useAppContext } from '../../../hooks/useAppContext';
import MediaPlayer from '../../ui/MediaPlayer';

interface MessageBubbleProps {
  message: Message;
}

interface ReadReceiptProps {
  status: MessageStatus;
}

const ReadReceipt: React.FC<ReadReceiptProps> = ({ status }) => {
    const Check = ({color}: {color: string}) => <svg className={`w-4 h-4 ${color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>;
    const DoubleCheck = ({color}: {color: string}) => <svg className={`w-4 h-4 ${color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7m-8.5 6l4 4L22 10" /></svg>;
    
    switch(status) {
        case MessageStatus.SENT:
            return <Check color="text-gray-400" />;
        case MessageStatus.DELIVERED:
            return <DoubleCheck color="text-gray-400" />;
        case MessageStatus.READ:
            return <DoubleCheck color="text-blue-400" />;
        default:
            return null;
    }
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const { t } = useAppContext();
  const isSentByMe = message.senderId === 'me';
  
  const renderContent = () => {
      switch(message.type) {
          case MessageType.TEXT:
              return <p>{message.content}</p>;
          case MessageType.IMAGE:
              return <img src={message.content} alt="shared" className="rounded-lg max-w-xs h-auto" />;
          case MessageType.AUDIO:
              return (
                  <div className="w-64">
                      <MediaPlayer src={message.content} type={MediaPlayerType.AUDIO} showAd={false} />
                  </div>
              );
          case MessageType.VIDEO:
              return (
                  <div className="max-w-xs rounded-lg overflow-hidden">
                       <MediaPlayer src={message.content} type={MediaPlayerType.VIDEO} showAd={false} />
                  </div>
              );
          default:
              return null;
      }
  }

  return (
    <div className={`flex items-end gap-2 ${isSentByMe ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-md lg:max-w-lg px-4 py-2 rounded-xl ${
          isSentByMe 
            ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-br-none' 
            : 'bg-gray-700 text-white rounded-bl-none'
      }`}>
        {renderContent()}
        <div className="flex items-center justify-end mt-1 text-xs text-gray-300/80">
          <span>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          {isSentByMe && <span className="ml-1.5"><ReadReceipt status={message.status} /></span>}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;