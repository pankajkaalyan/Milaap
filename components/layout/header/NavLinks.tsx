import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppContext } from '../../../hooks/useAppContext';
import { UserRole } from '../../../types';

interface NavLinksProps {
  onLinkClick?: () => void;
  className?: string;
  linkClassName?: string;
}

const NavLinks: React.FC<NavLinksProps> = ({ onLinkClick, className, linkClassName }) => {
  const { user, t } = useAppContext();

  const navLinkClass = linkClassName || "px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 transform hover:-translate-y-px hover:text-white hover:bg-white/10";
  const activeNavLinkClass = "text-white bg-white/20";

  const getNavLinkClasses = ({ isActive }: { isActive: boolean }) =>
    isActive ? `${navLinkClass} ${activeNavLinkClass}` : navLinkClass;

  return (
    <div className={className}>
      <NavLink to="/" className={getNavLinkClasses} onClick={onLinkClick}>{t('nav.home')}</NavLink>
      <NavLink to="/about" className={getNavLinkClasses} onClick={onLinkClick}>{t('nav.about')}</NavLink>
      <NavLink to="/contact" className={getNavLinkClasses} onClick={onLinkClick}>{t('nav.contact')}</NavLink>
      {user?.role === UserRole.CUSTOMER && (
        <>
          <NavLink to="/dashboard" className={getNavLinkClasses} onClick={onLinkClick}>{t('nav.dashboard')}</NavLink>
          <NavLink to="/matches" className={getNavLinkClasses} onClick={onLinkClick}>{t('nav.matches')}</NavLink>
          <NavLink to="/search" className={getNavLinkClasses} onClick={onLinkClick}>{t('nav.search')}</NavLink>
          <NavLink to="/mutual-matches" className={getNavLinkClasses} onClick={onLinkClick}>{t('nav.mutual_matches')}</NavLink>
          <NavLink to="/interests" className={getNavLinkClasses} onClick={onLinkClick}>{t('nav.interests')}</NavLink>
          <NavLink to="/messages" className={getNavLinkClasses} onClick={onLinkClick}>{t('nav.messages')}</NavLink>
        </>
      )}
      {user?.role === UserRole.ADMIN && (
        <NavLink to="/admin/dashboard" className={getNavLinkClasses} onClick={onLinkClick}>{t('nav.admin_dashboard')}</NavLink>
      )}
    </div>
  );
};

export default NavLinks;