import { useState } from 'react';

interface ChatAvatarProps {
  name: string;
  photo?: string;
}

const ChatAvatar: React.FC<ChatAvatarProps> = ({ name, photo }) => {
  const [showInitials, setShowInitials] = useState(false);

  const initials = name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return showInitials || !photo ? (
    <div className="w-8 h-8 rounded-full bg-gray-600 text-white flex items-center justify-center text-xs font-semibold">
      {initials}
    </div>
  ) : (
    <img
      src={photo}
      alt={name}
      className="w-8 h-8 rounded-full object-cover"
      onError={() => setShowInitials(true)}
    />
  );
};

export default ChatAvatar;
