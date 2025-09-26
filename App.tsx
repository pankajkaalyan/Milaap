import React from 'react';
import AppRouter from './routes/AppRouter';
import ToastContainer from './components/ui/ToastContainer';
import AnimatedBackground from './components/AnimatedBackground';
import { UIContextProvider } from './context/UIContext';
import { AuthContextProvider } from './context/AuthContext';
import { AppDataContextProvider } from './context/AppDataContext';

function App() {
  return (
    <UIContextProvider>
      <AuthContextProvider>
        <AppDataContextProvider>
          <div className="relative min-h-screen w-full overflow-x-hidden">
            <AnimatedBackground />
            <div className="relative z-10">
              <AppRouter />
            </div>
            <ToastContainer />
          </div>
        </AppDataContextProvider>
      </AuthContextProvider>
    </UIContextProvider>
  );
}

export default App;
