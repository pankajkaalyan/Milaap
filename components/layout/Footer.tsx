import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../hooks/useAppContext';
import AppLogo from '../icons/AppLogo';

const Footer: React.FC = () => {
    const { t } = useAppContext();
    const year = new Date().getFullYear();
    return (
        <footer className="bg-black/20 backdrop-blur-sm text-gray-400">
            <div className="container mx-auto py-8 px-4">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
                    <div className="flex items-center space-x-2">
                        <AppLogo className="h-8 w-8 text-amber-500" />
                        <span className="font-semibold text-white">Milaap</span>
                    </div>
                    <div className="text-center md:text-left">
                        <p>{t('footer.copyright').replace('{year}', year.toString())}</p>
                    </div>
                    <div className="flex space-x-6">
                        <Link to="/privacy" className="hover:text-white transition-colors cursor-pointer">{t('footer.privacy')}</Link>
                        <Link to="/terms" className="hover:text-white transition-colors cursor-pointer">{t('footer.terms')}</Link>
                        <Link to="/contact" className="hover:text-white transition-colors cursor-pointer">{t('footer.contact')}</Link>
                        <Link to="/success-stories" className="hover:text-white transition-colors cursor-pointer">{t('nav.success_stories')}</Link>
                        <Link to="/changelog" className="hover:text-white transition-colors cursor-pointer">{t('nav.changelog')}</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;