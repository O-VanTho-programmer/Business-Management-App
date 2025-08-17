'use client';
import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

type AlertType = 'success' | 'error' | 'info' | 'warning';

interface AlertState {
  isOpen: boolean;
  message: string;
  type: AlertType;
  id: string;
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
  const [alerts, setAlerts] = useState<AlertState[]>([]);
  const timeoutRefs = useRef<{ [key: string]: NodeJS.Timeout }>({});

  const getAlertIcon = (type: AlertType) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} className="text-green-100" />;
      case 'error':
        return <XCircle size={20} className="text-red-100" />;
      case 'warning':
        return <AlertTriangle size={20} className="text-orange-100" />;
      case 'info':
        return <Info size={20} className="text-blue-100" />;
      default:
        return <Info size={20} className="text-blue-100" />;
    }
  };

  const getAlertStyles = (type: AlertType) => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-r from-green-500 to-green-600 border-l-4 border-green-400';
      case 'error':
        return 'bg-gradient-to-r from-red-500 to-red-600 border-l-4 border-red-400';
      case 'warning':
        return 'bg-gradient-to-r from-orange-500 to-orange-600 border-l-4 border-orange-400';
      case 'info':
        return 'bg-gradient-to-r from-blue-500 to-blue-600 border-l-4 border-blue-400';
      default:
        return 'bg-gradient-to-r from-blue-500 to-blue-600 border-l-4 border-blue-400';
    }
  };

  const getProgressBarColor = (type: AlertType) => {
    switch (type) {
      case 'success':
        return 'bg-green-300';
      case 'error':
        return 'bg-red-300';
      case 'warning':
        return 'bg-orange-300';
      case 'info':
        return 'bg-blue-300';
      default:
        return 'bg-blue-300';
    }
  };

  const showAlert = (message: string, type: AlertType = 'info') => {
    const id = Date.now().toString();
    const newAlert: AlertState = { isOpen: true, message, type, id };
    
    setAlerts(prev => [...prev, newAlert]);

    // Auto-remove after 5 seconds
    const timeout = setTimeout(() => {
      removeAlert(id);
    }, 5000);

    timeoutRefs.current[id] = timeout;
  };

  const removeAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
    if (timeoutRefs.current[id]) {
      clearTimeout(timeoutRefs.current[id]);
      delete timeoutRefs.current[id];
    }
  };

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(timeoutRefs.current).forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}

      <div className="fixed top-5 right-5 z-[9999] space-y-3">
        {alerts.map((alert) => (
          <AlertItem
            key={alert.id}
            alert={alert}
            onRemove={() => removeAlert(alert.id)}
            getAlertIcon={getAlertIcon}
            getAlertStyles={getAlertStyles}
            getProgressBarColor={getProgressBarColor}
          />
        ))}
      </div>
    </AlertContext.Provider>
  );
};

interface AlertItemProps {
  alert: AlertState;
  onRemove: () => void;
  getAlertIcon: (type: AlertType) => React.ReactNode;
  getAlertStyles: (type: AlertType) => string;
  getProgressBarColor: (type: AlertType) => string;
}

const AlertItem: React.FC<AlertItemProps> = ({ 
  alert, 
  onRemove, 
  getAlertIcon, 
  getAlertStyles, 
  getProgressBarColor 
}) => {
  const [progress, setProgress] = useState(100);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setIsVisible(true);

    // Start progress bar countdown
    const startTime = Date.now();
    const duration = 4800; // 5 seconds

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);

      if (remaining > 0) {
        requestAnimationFrame(updateProgress);
      }
    };

    requestAnimationFrame(updateProgress);
  }, []);

  return (
    <div
      className={`
        min-w-[320px] max-w-[400px] rounded-lg shadow-2xl transform transition-all duration-300 ease-out
        ${isVisible ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'}
        ${getAlertStyles(alert.type)}
      `}
    >
      <div className="relative overflow-hidden">
        {/* Main alert content */}
        <div className="flex items-start p-4">
          <div className="flex-shrink-0 mr-3 mt-0.5">
            {getAlertIcon(alert.type)}
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white leading-5">
              {alert.message}
            </p>
          </div>
          
          <div className="flex-shrink-0 ml-3">
            <button
              onClick={onRemove}
              className="inline-flex text-white hover:text-gray-100 focus:outline-none focus:text-gray-100 transition-colors duration-200"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-black bg-opacity-20">
          <div
            className={`h-full transition-all duration-100 ease-linear ${getProgressBarColor(alert.type)}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
