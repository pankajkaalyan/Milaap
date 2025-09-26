
import React from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import Toast from './Toast';

const ToastContainer: React.FC = () => {
  const { toasts } = useAppContext();

  if (!toasts) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[100] space-y-3">
      {toasts.map((toast) => (
        <Toast key={toast.id} message={toast.message} type={toast.type} />
      ))}
    </div>
  );
};

export default ToastContainer;
