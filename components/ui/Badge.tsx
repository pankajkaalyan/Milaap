import React, { ReactNode } from 'react';
import { BadgeVariant } from '../../types';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
  icon?: ReactNode;
}

export const badgeVariantClasses: Record<BadgeVariant, string> = {
  [BadgeVariant.SUCCESS]: 'bg-green-500/20 text-green-300',
  [BadgeVariant.DANGER]: 'bg-red-500/20 text-red-300',
  [BadgeVariant.WARNING]: 'bg-yellow-500/20 text-yellow-300',
  [BadgeVariant.INFO]: 'bg-blue-500 text-white',
  [BadgeVariant.PRIMARY]: 'bg-purple-500 text-white',
  [BadgeVariant.PREMIUM]: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white',
};

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = BadgeVariant.INFO,
  className,
  icon,
}) => {
  const baseClasses =
    'inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-semibold whitespace-pre-line';

  return (
    <span className={`${baseClasses} ${badgeVariantClasses[variant]} ${className}`}>
      {icon && <span className="mr-1 flex items-center">{icon}</span>}
      <span className="text-center">{children}</span>
    </span>
  );
};

export default Badge;
