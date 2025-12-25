import React, { useEffect, useState, useRef } from 'react';
import { refreshTokenAPI } from '@/services/api/auth';
import { useContext } from 'react';
import { UIContext } from '@/context/UIContext';
import { AppEventStatus } from '@/types';

interface IdleWarningModalProps {
  onStaySignedIn?: () => Promise<void>;
  /** Auto close the warning after this many milliseconds (optional) */
  autoCloseAfter?: number;
}

const IdleWarningModal: React.FC<IdleWarningModalProps> = ({ onStaySignedIn, autoCloseAfter = 30000 }) => {
  const [visible, setVisible] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const countdownRef = useRef<number | null>(null);
  const { addToast, trackEvent } = useContext(UIContext)!;

  useEffect(() => {
    const show = () => setVisible(true);
    const hide = () => setVisible(false);

    window.addEventListener('idle_warning', show as EventListener);
    window.addEventListener('idle_logout', hide as EventListener);
    window.addEventListener(AppEventStatus.TOKEN_REFRESHED, hide as EventListener);

    return () => {
      window.removeEventListener('idle_warning', show as EventListener);
      window.removeEventListener('idle_logout', hide as EventListener);
      window.removeEventListener(AppEventStatus.TOKEN_REFRESHED, hide as EventListener);
    };
  }, []);

  // Auto-close countdown
  useEffect(() => {
    if (!visible) {
      setCountdown(null);
      if (countdownRef.current) {
        clearInterval(countdownRef.current as unknown as number);
        countdownRef.current = null;
      }
      return;
    }

    if (autoCloseAfter && autoCloseAfter > 0) {
      let remaining = Math.ceil(autoCloseAfter / 1000);
      setCountdown(remaining);

      countdownRef.current = window.setInterval(() => {
        remaining -= 1;
        setCountdown(remaining);
        if (remaining <= 0) {
          // Auto dismiss — allow the inactivity flow to proceed to logout
          setVisible(false);
          if (trackEvent) trackEvent('idle_warning_auto_dismiss', { method: 'countdown' });
          if (countdownRef.current) {
            clearInterval(countdownRef.current as unknown as number);
            countdownRef.current = null;
          }
        }
      }, 1000);
    }

    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current as unknown as number);
        countdownRef.current = null;
      }
    };
  }, [visible, autoCloseAfter, trackEvent]);

  const handleStay = async () => {
    try {
      if (trackEvent) trackEvent('idle_keep_alive', { method: 'idle_modal' });

      if (onStaySignedIn) {
        await onStaySignedIn();
      } else {
        // default behavior: try to refresh token
        const result = await refreshTokenAPI();
        if (result?.accessToken) {
          localStorage.setItem('token', result.accessToken);
          localStorage.setItem('refreshToken', result.refreshToken);
          localStorage.setItem('expiresIn', String(result.expiresIn));
          try { window.dispatchEvent(new CustomEvent(AppEventStatus.TOKEN_REFRESHED, { detail: result })); } catch (e) { /* ignore */ }
          // Notify the timeout scheduler to reset
          try { window.dispatchEvent(new Event(AppEventStatus.IDLE_RESET)); } catch (e) { /* ignore */ }
          addToast('Session extended', 'success');
        } else {
          addToast('Could not refresh session. Please sign in again.', 'error');
        }
      }
    } catch (err) {
      addToast('Could not refresh session. Please sign in again.', 'error');
    } finally {
      setVisible(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-full max-w-md mx-4 bg-white rounded-lg shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold">Your session is about to expire</h3>
        <p className="mt-2 text-sm text-gray-600">You will be automatically signed out soon due to inactivity.</p>
        {countdown !== null && (
          <p className="mt-2 text-sm text-gray-500">Auto-dismiss in <strong>{countdown}s</strong></p>
        )}
        <div className="mt-4 flex justify-end gap-3">
          <button
            className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300"
            onClick={() => {
              if (trackEvent) trackEvent('idle_warning_dismissed', { method: 'manual' });
              setVisible(false);
            }}
          >
            Dismiss
          </button>
          <button
            className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            onClick={handleStay}
          >
            Stay signed in
          </button>
        </div>
      </div>
    </div>
  );
};

export default IdleWarningModal;
