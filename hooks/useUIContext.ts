import { useContext } from 'react';
import { UIContext, UIContextType } from '../context/UIContext';

export const useUIContext = (): UIContextType => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUIContext must be used within a UIContextProvider');
  }
  return context;
};
