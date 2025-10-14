import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../../hooks/useAppContext';
import { UserRole } from '../../../types';
import { logoutAPI } from '@/services/api/auth';

const ProfileMenu: React.FC = () => {
  const { user, logout, t } = useAppContext();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  const handleLogout = () => {
    const tockens = {
      accessToken: localStorage.getItem("token") || '',
      refreshToken: localStorage.getItem("refreshToken") || ''
    };
    if (!tockens.accessToken) {
      logout();
      setIsOpen(false);
      navigate('/');
    } else {
      logoutAPI().then(() => {
        logout();
        setIsOpen(false);
        navigate('/');
      }).catch(err => console.error('Error during logout:', err)).finally(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
      });
    }
  };

  const closeMenu = () => setIsOpen(false);

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button onClick={() => setIsOpen(prev => !prev)} className="flex items-center space-x-2 focus:outline-none">
        {user.role === UserRole.CUSTOMER ? (
          <img src={user.profile?.photos?.[0] || `https://i.pravatar.cc/150?u=${user.id}`} alt="My Profile" className="w-9 h-9 rounded-full object-cover border-2 border-amber-500/50" />
        ) : (
          <div className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold border-2 border-purple-500/50">
            {user.name?.charAt(0)}
          </div>
        )}
      </button>
      {isOpen && (
        <div className={`absolute right-0 mt-2 ${user.role === UserRole.ADMIN ? 'w-56' : 'w-48'} bg-gray-800 border border-gray-700 rounded-md shadow-lg z-20 animate-fade-in-up-fast`}>
          {user.role === UserRole.CUSTOMER ? (
            <ul className="py-1">
              <li><NavLink to="/profile" className="w-full text-left block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700" onClick={closeMenu}>{t('nav.my_profile')}</NavLink></li>
              <li><NavLink to="/settings" className="w-full text-left block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700" onClick={closeMenu}>{t('nav.settings')}</NavLink></li>
              <li><NavLink to="/verification" className="w-full text-left block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700" onClick={closeMenu}>{t('nav.verification')}</NavLink></li>
              <li><hr className="border-gray-600 my-1" /></li>
              <li><button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700">{t('nav.logout')}</button></li>
            </ul>
          ) : (
            <ul className="py-1">
              <li className="px-4 py-2 border-b border-gray-600 w-full text-left">
                <p className="font-semibold text-white truncate">{user.name}</p>
                <p className="text-xs text-gray-400 capitalize">{user.adminRole?.replace('_', ' ').toLowerCase()}</p>
              </li>
              <li><NavLink to="/admin/dashboard" className="w-full text-left block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700" onClick={closeMenu}>{t('nav.admin_dashboard')}</NavLink></li>
              <li><hr className="border-gray-600 my-1" /></li>
              <li><button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700">{t('nav.logout')}</button></li>
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
