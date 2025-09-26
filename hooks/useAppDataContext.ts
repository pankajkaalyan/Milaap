import { useContext } from 'react';
import { AppDataContext, AppDataContextType } from '../context/AppDataContext';

export const useAppDataContext = (): AppDataContextType => {
  const context = useContext(AppDataContext);
  if (context === undefined) {
    throw new Error('useAppDataContext must be used within an AppDataContextProvider');
  }
  return context;
};
