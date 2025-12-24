import React from 'react';
import WhatsAppIcon from '../icons/WhatsAppIcon';

interface WhatsAppWidgetProps {
  onClick?: () => void;
}

const WhatsAppWidget: React.FC<WhatsAppWidgetProps> = ({ onClick }) => {
  const handleClick = () => {
    if (onClick) return onClick();
    // Read configured WhatsApp phone number from Vite env (international format, no +)
    const phone = (import.meta.env as any).VITE_WHATSAPP_NUMBER as string | undefined;
    const message = 'Hi, I need help with Milaap';
    const encoded = encodeURIComponent(message);
    const url = phone ? `https://wa.me/${phone}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 left-6 z-30 w-16 h-16 bg-[#25D366] rounded-full text-white shadow-lg flex items-center justify-center transform hover:scale-110 transition-transform duration-300 ease-in-out cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#128C7E]/50 animate-fade-in"
      aria-label="Open WhatsApp"
    >
      <WhatsAppIcon className="w-9 h-9" />
    </button>
  );
};

export default WhatsAppWidget;
