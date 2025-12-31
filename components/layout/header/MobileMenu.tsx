import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../../hooks/useAppContext';
import { UserRole } from '../../../types';
import NavLinks from './NavLinks';
import { eventBus } from '@/utils/eventBus';
import { AppEventStatus } from '@/types';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const { user, logout, t } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/');
  };

  // Close mobile menu when route changes on mobile/medium devices
  React.useEffect(() => {
    const routeHandler = ({ isMobileOrMedium }: { isMobileOrMedium: boolean }) => {
      if (isMobileOrMedium) onClose();
    };
    try { eventBus.on(AppEventStatus.ROUTE_CHANGE, routeHandler); } catch (e) { /* ignore */ }
    return () => { try { eventBus.off(AppEventStatus.ROUTE_CHANGE, routeHandler); } catch (e) { /* ignore */ } };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="lg:hidden bg-black/50 backdrop-blur-lg">
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col items-center">
        <NavLinks onLinkClick={onClose} className="flex flex-col items-center space-y-1 w-full" linkClassName="w-full text-center px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-white hover:bg-white/10" />
        <div className="pt-4 mt-4 border-t border-gray-700 w-full flex flex-col items-center space-y-3">
          {user ? (
            user.role === UserRole.CUSTOMER ? (
              <>
                <NavLink to="/profile" className="w-full text-center px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-white hover:bg-white/10" onClick={onClose}>{t('nav.my_profile')}</NavLink>
                <NavLink to="/settings" className="w-full text-center px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-white hover:bg-white/10" onClick={onClose}>{t('nav.settings')}</NavLink>
                <NavLink to="/verification" className="w-full text-center px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-white hover:bg-white/10" onClick={onClose}>{t('nav.verification')}</NavLink>
                {/* <NavLink to="/membership" className="w-full text-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-yellow-500 to-orange-500 rounded-md hover:opacity-90 transition-opacity cursor-pointer" onClick={onClose}>
                  {t('nav.upgrade')}
                </NavLink> */}
                <button onClick={handleLogout} className="w-full text-center px-4 py-2 text-sm font-medium text-white bg-white/10 rounded-md hover:bg-white/20 transition-colors cursor-pointer">
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <button onClick={handleLogout} className="w-full text-center px-4 py-2 text-sm font-medium text-white bg-white/10 rounded-md hover:bg-white/20 transition-colors cursor-pointer">
                {t('nav.logout')}
              </button>
            )
          ) : (
            <>
              <NavLink to="/login" className="w-full text-center px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-white hover:bg-white/10" onClick={onClose}>{t('nav.login')}</NavLink>
              <NavLink to="/register" className="w-full text-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-md hover:opacity-90 transition-opacity cursor-pointer" onClick={onClose}>
                {t('nav.register')}
              </NavLink>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
