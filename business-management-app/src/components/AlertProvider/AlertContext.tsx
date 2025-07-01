'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

type AlertType = 'success' | 'error' | 'info' | 'warning';

interface AlertState {
  isOpen: boolean;
  message: string;
  type: AlertType;
}

interface AlertContextProps {
  showAlert: (message: string, type?: AlertType) => void;
}

const AlertContext = createContext<AlertContextProps | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alert, setAlert] = useState<AlertState>({ isOpen: false, message: '', type: 'info' });

  const showAlert = (message: string, type: AlertType = 'info') => {
    setAlert({ isOpen: true, message, type });
    setTimeout(() => setAlert(a => ({ ...a, isOpen: false })), 3000);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}

      <div className="fixed top-5 right-5 z-[9999]">
        {alert.isOpen && (
          <div
            className={`min-w-[200px] mb-2 px-6 py-3 rounded-lg text-white font-medium shadow-lg animate-fadeIn
              ${alert.type === 'success' ? 'bg-green-600' : ''}
              ${alert.type === 'error' ? 'bg-red-600' : ''}
              ${alert.type === 'warning' ? 'bg-orange-500' : ''}
              ${alert.type === 'info' ? 'bg-blue-600' : ''}
            `}
          >
            {alert.message}
          </div>
        )}
      </div>
    </AlertContext.Provider>
  );
};
