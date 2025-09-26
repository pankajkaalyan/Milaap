import React from 'react';
import ChatBubbleIcon from '../icons/ChatBubbleIcon';

interface SupportWidgetProps {
  onOpen: () => void;
}

const SupportWidget: React.FC<SupportWidgetProps> = ({ onOpen }) => {
  return (
    <button
      onClick={onOpen}
      className="fixed bottom-6 right-6 z-40 w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full text-white shadow-lg flex items-center justify-center transform hover:scale-110 transition-transform duration-300 ease-in-out cursor-pointer focus:outline-none focus:ring-4 focus:ring-amber-500/50 animate-fade-in"
      aria-label="Open support chat"
    >
      <ChatBubbleIcon />
    </button>
  );
};

export default SupportWidget;