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
            <div className="mx-auto max-w-7xl px-4 py-8">

                {/* Top Section */}
                <div className="flex flex-col items-center gap-4 text-center md:flex-row md:justify-between md:text-left">

                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <AppLogo className="h-8 w-8 text-amber-500" />
                        <span className="font-semibold text-white">
                            ANZ Hindu Matrimony
                        </span>
                    </div>

                    {/* Copyright + Credits */}
                    <div className="text-sm">
                        <p>
                            {t('footer.copyright').replace('{year}', year.toString())}
                        </p>

                        <p className="mt-1 flex flex-col items-center gap-1 md:flex-row md:gap-2">
                            <span>
                                Developed by{' '}
                                <a
                                    href="https://getsetit.com.au/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-orange-400 hover:text-amber-300 transition-colors"
                                >
                                    GetSetIT
                                </a>
                            </span>

                            {/* Made in Australia */}
                            <span className="text-xs text-amber-400 md:text-sm">
                                • Made in Australia 🇦🇺
                            </span>

                        </p>
                    </div>
                </div>

                {/* Divider */}
                <div className="my-6 h-px w-full bg-white/10" />

                {/* Links */}
                <nav
                    aria-label="Footer Navigation"
                    className="
            grid grid-cols-2 gap-y-3 gap-x-6
            text-sm text-center
            sm:flex sm:justify-center sm:gap-6
          "
                >
                    <Link to="/privacy" className="hover:text-white transition-colors">
                        {t('footer.privacy')}
                    </Link>

                    <Link to="/terms" className="hover:text-white transition-colors">
                        {t('footer.terms')}
                    </Link>

                    <Link to="/contact" className="hover:text-white transition-colors">
                        {t('footer.contact')}
                    </Link>

                    {(user?.role === UserRole.CUSTOMER ||
                        user?.role === UserRole.ROLE_USER ||
                        user?.role === UserRole.ADMIN) && (
                            <Link
                                to="/success-stories"
                                className="hover:text-white transition-colors"
                            >
                                {t('nav.success_stories')}
                            </Link>
                        )}
                </nav>
            </div>
        </footer>
    );
};

export default Footer;
