import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useAppContext } from '../../hooks/useAppContext';
import { AdminRole } from '../../types';
import MailOpenIcon from '../icons/MailOpenIcon';
import DocumentReportIcon from '../icons/DocumentReportIcon';
import { AnimatePresence, motion } from 'framer-motion';

const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-3-5.197M15 21a3 3 0 01-6 0v-1a3 3 0 016 0v1z" /></svg>;
const VerificationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.417l4.5-4.5M12 2.944A12.02 12.02 0 0021 20.417l-4.5-4.5M12 2.944V21m8.618-13.016L12 12.586l-8.618-3.04" /></svg>;
const ReportIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6H8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" /></svg>;
const StoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" /></svg>;
const LogsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
const ShieldIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.602-3.751A11.959 11.959 0 0121 6c0 .82.123 1.603.352 2.343l-3.953 3.953-3.48-3.48-3.953 3.953a4.5 4.5 0 00-6.364-6.364L12 2.714z" /></svg>;

const AdminLayout: React.FC = () => {
    const { t, user } = useAppContext();
    const location = useLocation();

    const navLinkClass = "flex items-center px-4 py-2.5 text-gray-300 rounded-lg hover:bg-white/10 transition-colors";
    const activeNavLinkClass = "bg-white/20 text-white font-semibold";
  
    const getNavLinkClasses = ({ isActive }: { isActive: boolean }) =>
      isActive ? `${navLinkClass} ${activeNavLinkClass}` : navLinkClass;
    
    const isSuperAdmin = user?.adminRole === AdminRole.SUPER_ADMIN;

    return (
        <div className="flex flex-col md:flex-row gap-8">
            <aside className="md:w-1/4 lg:w-1/5">
                <div className="bg-black/20 backdrop-filter backdrop-blur-lg border border-white/10 rounded-xl p-4 sticky top-24">
                    <nav className="space-y-2">
                        <NavLink to="/admin/dashboard" className={getNavLinkClasses}>
                            <DashboardIcon />
                            <span>{t('nav.admin_dashboard')}</span>
                        </NavLink>
                        {isSuperAdmin && (
                            <NavLink to="/admin/registration-requests" className={getNavLinkClasses}>
                                <UsersIcon />
                                <span>{t('nav.registration_requests')}</span>
                            </NavLink>
                        )}
                        {isSuperAdmin && (
                            <NavLink to="/admin/user-management" className={getNavLinkClasses}>
                                <UsersIcon />
                                <span>{t('nav.admin_users')}</span>
                            </NavLink>
                        )}
                    
                        <NavLink to="/admin/verification-requests" className={getNavLinkClasses}>
                             <VerificationIcon />
                            <span>{t('nav.admin_verification')}</span>
                        </NavLink>
                         <NavLink to="/admin/service-requests" className={getNavLinkClasses}>
                             <LogsIcon />
                            <span>{t('nav.admin_servic_requests')}</span>
                        </NavLink>
                        <NavLink to="/admin/reports" className={getNavLinkClasses}>
                             <ReportIcon />
                            <span>{t('nav.admin_reports')}</span>
                        </NavLink>
                        <NavLink to="/admin/story-submissions" className={getNavLinkClasses}>
                            <StoryIcon />
                            <span>{t('nav.admin_stories')}</span>
                        </NavLink>
                         {isSuperAdmin && (
                            <NavLink to="/admin/communication" className={getNavLinkClasses}>
                                <MailOpenIcon />
                                <span>{t('nav.admin_communication')}</span>
                            </NavLink>
                        )}
                         {isSuperAdmin && (
                            <NavLink to="/admin/reporting" className={getNavLinkClasses}>
                                <DocumentReportIcon />
                                <span>{t('nav.admin_reporting')}</span>
                            </NavLink>
                        )}
                        {/* {isSuperAdmin && (
                            <NavLink to="/admin/access-control" className={getNavLinkClasses}>
                                <ShieldIcon />
                                <span>{t('nav.admin_access_control')}</span>
                            </NavLink>
                        )} */}
                    </nav>
                </div>
            </aside>
            <main className="flex-1">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 15 }}
                        transition={{ duration: 0.25 }}
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
};

export default AdminLayout;