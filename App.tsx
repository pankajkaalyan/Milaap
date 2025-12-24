import React from 'react';
import AppRouter from './routes/AppRouter';
import ToastContainer from './components/ui/ToastContainer';
import AnimatedBackground from './components/AnimatedBackground';
import { UIContextProvider } from './context/UIContext';
import { AuthContextProvider } from './context/AuthContext';
import { AppDataContextProvider } from './context/AppDataContext';
import useSessionTimeout from './pages/SessionTimeout';
import useInactivityTimeout from './pages/InactivityTimeout';
import { LoaderProvider, useLoader } from "./context/LoaderContext";
import GlobalLoader from "./components/GlobalLoader";
import { registerLoader } from "./utils/loaderBus";
import IdleWarningModal from './components/ui/IdleWarningModal';
import { refreshTokenAPI } from './services/api/auth';
import { useAppContext } from './hooks/useAppContext';

const LoaderBridge = () => {
  const { showLoader, hideLoader } = useLoader();
  registerLoader(showLoader, hideLoader);
  return null;
};

function App() {
  // useSessionTimeout();
  useInactivityTimeout();

  // We render IdleWarningModal inside providers so we can use toasts and other context
  return (
    <LoaderProvider>
      <LoaderBridge />
      <GlobalLoader />
      <UIContextProvider>
        <AuthContextProvider>
          <AppDataContextProvider>
            <div className="relative min-h-screen w-full overflow-x-hidden">
              <AnimatedBackground />
              <div className="relative z-10">
                <AppRouter />
              </div>
              <ToastContainer />
              <IdleWarningModal
                autoCloseAfter={30000}
                onStaySignedIn={async () => {
                  try {
                    const result = await refreshTokenAPI();
                    if (result?.accessToken) {
                      localStorage.setItem('token', result.accessToken);
                      localStorage.setItem('refreshToken', result.refreshToken);
                      localStorage.setItem('expiresIn', String(result.expiresIn));
                      try { window.dispatchEvent(new CustomEvent('token_refreshed', { detail: result })); } catch (e) { /* ignore */ }
                      try { window.dispatchEvent(new Event('idle_reset')); } catch (e) { /* ignore */ }
                      // Best-effort UX: show toast via UIContext - use event so we don't need to call hooks here
                      try { window.dispatchEvent(new CustomEvent('show_toast', { detail: { message: 'Session extended', type: 'success' } })); } catch (e) { /* ignore */ }
                      // analytics
                      try { window.dispatchEvent(new CustomEvent('track_event', { detail: { name: 'idle_keep_alive', props: { method: 'idle_modal' } } })); } catch (e) { /* ignore */ }
                    }
                  } catch (err) {
                    try { window.dispatchEvent(new CustomEvent('show_toast', { detail: { message: 'Could not refresh session. Please sign in again.', type: 'error' } })); } catch (e) { /* ignore */ }
                  }
                }}
              />
            </div>
          </AppDataContextProvider>
        </AuthContextProvider>
      </UIContextProvider>
    </LoaderProvider>
  );
  // return (
  //   <UIContextProvider>
  //     <AuthContextProvider>
  //       <AppDataContextProvider>
  //         <div className="relative min-h-screen w-full overflow-x-hidden">
  //           <AnimatedBackground />
  //           <div className="relative z-10">
  //             <AppRouter />
  //           </div>
  //           <ToastContainer />
  //         </div>
  //       </AppDataContextProvider>
  //     </AuthContextProvider>
  //   </UIContextProvider>
  // );
}

export default App;
