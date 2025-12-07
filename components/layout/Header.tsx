import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAppContext } from '../../hooks/useAppContext';
import AppLogo from '../icons/AppLogo';
import LanguageSwitcher from '../ui/LanguageSwitcher';
import { UserRole } from '../../types';
import NotificationBell from '../notifications/NotificationBell';
import NavLinks from './header/NavLinks';
import ProfileMenu from './header/ProfileMenu';
import MobileMenu from './header/MobileMenu';

const HamburgerIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
    </svg>
);

const CloseIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
    </svg>
);

const Header: React.FC = () => {
  const { user, t } = useAppContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-black/30 backdrop-blur-lg shadow-lg' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <NavLink to="/" className="flex items-center space-x-2 text-white">
              <AppLogo className="h-10 w-10" />
              <span className="font-bold text-xl">Milaap</span>
            </NavLink>
          </div>
          
          <div className="hidden lg:flex items-center space-x-2">
            <NavLinks />
          </div>
          
          <div className="hidden lg:flex items-center space-x-4">
            {/* <LanguageSwitcher /> */}
            {user ? (
              <>
                <NotificationBell />
                {/* {user.role === UserRole.CUSTOMER || user.role === UserRole.ROLE_USER && (
                    <NavLink to="/membership" className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-amber-500 to-orange-500 rounded-md hover:opacity-90 transition-opacity cursor-pointer">
                      {t('nav.upgrade')}
                    </NavLink>
                )} */}
                <ProfileMenu />
              </>
            ) : (
              <>
                <NavLink to="/login" className="px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-white hover:bg-white/10">{t('nav.login')}</NavLink>
                <NavLink to="/register" className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-amber-500 to-orange-600 rounded-md hover:opacity-90 transition-opacity cursor-pointer">
                  {t('nav.register')}
                </NavLink>
              </>
            )}
          </div>
          
          <div className="flex lg:hidden items-center">
             {/* <LanguageSwitcher /> */}
             {user && <NotificationBell />}
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-300 hover:text-white focus:outline-none ml-3">
              {isMobileMenuOpen ? <CloseIcon /> : <HamburgerIcon />}
            </button>
          </div>
        </div>
      </div>
      
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </header>
  );
};

export default Header;