import React from 'react';
import Badge from './Badge';
import { BadgeVariant } from '../../types';

interface BadgeWithTooltipProps {
  variant: BadgeVariant;
  label: React.ReactNode;
  tooltip?: React.ReactNode;
}

const BadgeWithTooltip: React.FC<BadgeWithTooltipProps> = ({ variant, label, tooltip }) => {
  return (
    <div className="relative inline-flex items-center gap-1 group/tooltip">
      <Badge variant={variant}>{label}</Badge>

      {tooltip && (
        <span className="relative flex items-center cursor-pointer">
          {/* Info Icon - mobile-first approach */}
          <span className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold transition-colors hover:bg-blue-500/30 active:bg-blue-500/40">
            i
          </span>
          
          {/* Tooltip - mobile-first (visible on mobile, hidden on desktop until hover) */}
          <span
            className="absolute bottom-full left-1/2 -translate-x-1/2 z-30 mb-2 whitespace-nowrap rounded-md bg-gray-900 px-3 py-2 text-xs text-gray-100 shadow-lg border border-gray-700/50 
            block sm:hidden sm:group-hover/tooltip:block sm:group-focus-within/tooltip:block
            opacity-0 sm:opacity-0 sm:group-hover/tooltip:opacity-100 sm:group-focus-within/tooltip:opacity-100 transition-all duration-200"
          >
            {tooltip}
          </span>
        </span>
      )}
    </div>
  );
};

export default BadgeWithTooltip;
