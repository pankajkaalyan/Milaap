import { useState, useCallback, useRef, useEffect } from 'react';
import { ToastMessage } from '../types';

export const useToasts = () => {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);
    const timeoutRefs = useRef<Record<number, NodeJS.Timeout>>({});

    const addToast = useCallback((message: string, type: ToastMessage['type'] = 'info') => {
        const id = Date.now();
        setToasts(prevToasts => [...prevToasts, { id, message, type }]);
        
        // Store timeout ID so it can be cleared on unmount
        const timerId = setTimeout(() => {
            setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
            delete timeoutRefs.current[id];
        }, 5000);
        
        timeoutRefs.current[id] = timerId;
    }, []);

    // Cleanup all pending timeouts on unmount
    useEffect(() => {
        return () => {
            Object.values(timeoutRefs.current).forEach(timerId => clearTimeout(timerId));
            timeoutRefs.current = {};
        };
    }, []);

    return {
        toasts,
        addToast,
    };
};
