import { useAuthContext } from './useAuthContext';
import { useUIContext } from './useUIContext';
import { useAppDataContext } from './useAppDataContext';

/**
 * A custom hook that combines user authentication, UI state, and application data contexts.
 * This provides a single, convenient hook for components to access all shared state and actions.
 */
export const useAppContext = () => {
  const authContext = useAuthContext();
  const uiContext = useUIContext();
  const appDataContext = useAppDataContext();

  return {
    ...authContext,
    ...uiContext,
    ...appDataContext,
  };
};
