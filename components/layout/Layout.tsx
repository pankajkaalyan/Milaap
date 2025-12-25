import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useAppContext } from '../../hooks/useAppContext';
import SupportWidget from '../support/SupportWidget';
import SupportChatWindow from '../support/SupportChatWindow';
import WhatsAppWidget from '../support/WhatsAppWidget';
import { AnimatePresence, motion } from 'framer-motion';
import { eventBus } from '@/utils/eventBus';
import { AppEventStatus } from '@/types';

const Layout: React.FC = () => {
  const { user } = useAppContext();
  const [isSupportChatOpen, setIsSupportChatOpen] = useState(false);
  const location = useLocation();

  // Hide support chat on route changes (small + medium screens) and notify listeners
  useEffect(() => {
    // Treat viewport widths < 1024px (Tailwind's lg breakpoint) as mobile/medium
    const isMobileOrMedium = window.innerWidth < 1024;
    if (isSupportChatOpen && isMobileOrMedium) setIsSupportChatOpen(false);
    // Emit an event so other components (profile menu, mobile menu, page modals) can close themselves on mobile/medium devices
    try { eventBus.emit(AppEventStatus.ROUTE_CHANGE, { isMobileOrMedium }); } catch (e) { /* ignore */ }
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen font-sans text-gray-200">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-16">
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
      <Footer />
      {user && (
        <>
          {!isSupportChatOpen && <SupportWidget onOpen={() => setIsSupportChatOpen(true)} />}
          <WhatsAppWidget />
          {isSupportChatOpen && <SupportChatWindow onClose={() => setIsSupportChatOpen(false)} />}
        </>
      )}
    </div>
  );
};

export default Layout;