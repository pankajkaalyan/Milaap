import React from 'react';

interface InfoWithTooltipProps {
  tooltip: string;
  className?: string;
}

/**
 * InfoWithTooltip - Reusable info icon with mobile-first tooltip
 * 
 * Renders a small 'i' icon with consistent mobile-first tooltip
 * - Mobile: Tooltip always visible
 * - Desktop: Tooltip visible on hover/focus
 * 
 * @param tooltip - Tooltip text to display
 * @param className - Additional CSS classes for the info icon
 */
const InfoWithTooltip: React.FC<InfoWithTooltipProps> = ({ tooltip, className = '' }) => {
  return (
    <div className="relative group/tooltip">
      {/* Info Icon - mobile-first approach */}
      <span className={`ml-1 cursor-pointer inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold transition-colors hover:bg-blue-500/30 active:bg-blue-500/40 ${className}`}>
        i
      </span>

      {/* Tooltip - mobile-first (visible on mobile, hidden on desktop until hover) */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-30 whitespace-nowrap rounded-md bg-gray-900 px-3 py-2 text-xs text-gray-100 shadow-lg border border-gray-700/50
      block sm:hidden sm:group-hover/tooltip:block sm:group-focus-within/tooltip:block
      opacity-0 sm:opacity-0 sm:group-hover/tooltip:opacity-100 sm:group-focus-within/tooltip:opacity-100 transition-all duration-200">
        {tooltip}
      </div>
    </div>
  );
};

export default InfoWithTooltip;
