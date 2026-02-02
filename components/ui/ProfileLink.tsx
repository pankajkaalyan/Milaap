import React from 'react';
import { Link } from 'react-router-dom';

interface ProfileLinkProps {
  userId: string | number;
  children: React.ReactNode;
  userName?: string;
  className?: string;
}

/**
 * ProfileLink - Reusable profile link with mobile-first tooltip
 * 
 * Renders a Link to a user's profile with a consistent mobile-first tooltip
 * - Mobile: Tooltip always visible
 * - Desktop: Tooltip visible on hover/focus
 * 
 * @param userId - User ID to link to
 * @param children - Link text content
 * @param userName - User name for tooltip (if not provided, defaults to "View Profile")
 * @param className - Additional CSS classes for the link
 */
const ProfileLink: React.FC<ProfileLinkProps> = ({ userId, children, userName, className = '' }) => {
  const tooltipText = userName ? `View ${userName}'s profile` : 'View Profile';

  return (
    <div className="group/tooltip relative inline-flex">
      <Link
        to={`/profile/${userId}`}
        className={`relative ${className}`}
      >
        {children}
      </Link>

      {/* Tooltip - mobile-first (visible on mobile, hidden on desktop until hover) */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-30 whitespace-nowrap rounded-md bg-gray-900 px-3 py-2 text-xs text-gray-100 shadow-lg border border-gray-700/50
      block sm:hidden sm:group-hover/tooltip:block sm:group-focus-within/tooltip:block
      opacity-0 sm:opacity-0 sm:group-hover/tooltip:opacity-100 sm:group-focus-within/tooltip:opacity-100 transition-all duration-200">
        {tooltipText}
      </div>
    </div>
  );
};

export default ProfileLink;
