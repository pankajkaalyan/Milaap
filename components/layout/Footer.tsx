import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../hooks/useAppContext';
import AppLogo from '../icons/AppLogo';
import { UserRole } from '@/types';

const Footer: React.FC = () => {
    const { user, t } = useAppContext();
    const year = new Date().getFullYear();
    return (
        <footer className="bg-black/20 backdrop-blur-sm text-gray-400">
            <div className="container mx-auto py-8 px-4">

                {/* ROW 1 — Desktop: Logo + Rights | Mobile: centered stacked */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center text-center md:text-left">

                    {/* Logo */}
                    <div className="flex justify-center md:justify-start items-center space-x-2 mb-4 md:mb-0">
                        <AppLogo className="h-8 w-8 text-amber-500" />
                        <span className="font-semibold text-white">Milaap</span>
                    </div>

                    {/* Rights text - centered even on desktop */}
                    <p className="text-center md:text-center w-full">
                        {t('footer.copyright').replace('{year}', year.toString())}
                    </p>

                </div>

                {/* ROW 2 — Links */}
                <div className="flex flex-wrap justify-center mt-6 space-x-4 sm:space-x-6 text-sm">
                    <Link to="/privacy" className="hover:text-white transition-colors cursor-pointer">
                        {t('footer.privacy')}
                    </Link>
                    <Link to="/terms" className="hover:text-white transition-colors cursor-pointer">
                        {t('footer.terms')}
                    </Link>
                    <Link to="/contact" className="hover:text-white transition-colors cursor-pointer">
                        {t('footer.contact')}
                    </Link>
                    {(user?.role === UserRole.CUSTOMER || user?.role === UserRole.ROLE_USER || user?.role === UserRole.ADMIN ) && (
                        <Link to="/success-stories" className="hover:text-white transition-colors cursor-pointer">
                            {t('nav.success_stories')}
                        </Link>
                    )}
                    {/* <Link to="/changelog" className="hover:text-white transition-colors cursor-pointer">
                        {t('nav.changelog')}
                    </Link> */}
                </div>

            </div>
        </footer>

    );
};

export default Footer;