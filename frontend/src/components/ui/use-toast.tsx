"use client";

import * as React from "react";
import { useEffect, useState } from "react";

const TOAST_TIMEOUT = 3000;

type ToastProps = {
  title: string;
  description?: string;
  variant?: "default" | "success" | "destructive";
};

type ToastContextType = {
  toast: (props: ToastProps) => void;
};

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<(ToastProps & { id: number })[]>([]);
  const [lastId, setLastId] = useState(0);

  const toast = (props: ToastProps) => {
    const id = lastId + 1;
    setLastId(id);
    setToasts((prevToasts) => [...prevToasts, { ...props, id }]);
    
    // Otomatik kaldırma
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter(toast => toast.id !== id));
    }, TOAST_TIMEOUT);
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} {...toast} onClose={() => {
            setToasts((prevToasts) => prevToasts.filter(t => t.id !== toast.id));
          }} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ id, title, description, variant = "default", onClose }: ToastProps & { id: number, onClose: () => void }) {
  const [progress, setProgress] = useState(100);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - (100 / (TOAST_TIMEOUT / 100));
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, []);
  
  const variantClasses = {
    default: "bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700",
    success: "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900/30",
    destructive: "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-900/30",
  };
  
  const titleColor = {
    default: "text-gray-900 dark:text-gray-50",
    success: "text-green-800 dark:text-green-200",
    destructive: "text-red-800 dark:text-red-200",
  };
  
  const descriptionColor = {
    default: "text-gray-500 dark:text-gray-400",
    success: "text-green-700 dark:text-green-300",
    destructive: "text-red-700 dark:text-red-300",
  };
  
  const progressColor = {
    default: "bg-blue-600",
    success: "bg-green-600",
    destructive: "bg-red-600",
  };

  return (
    <div
      className={`rounded-lg border shadow-lg w-80 p-4 relative overflow-hidden ${variantClasses[variant]}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className={`font-medium text-sm ${titleColor[variant]}`}>{title}</h3>
          {description && <p className={`text-xs mt-1 ${descriptionColor[variant]}`}>{description}</p>}
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        </button>
      </div>
      <div className="absolute bottom-0 left-0 h-1 w-full bg-gray-200 dark:bg-gray-700">
        <div
          className={`h-full ${progressColor[variant]}`}
          style={{ width: `${progress}%`, transition: "width 100ms linear" }}
        />
      </div>
    </div>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export const toast = (props: ToastProps) => {
  // Bu fonksiyon direkt çağrıldığında uyarı göster
  console.warn('Toast provider olmadan toast() çağrılamaz. useToast() hook\'unu kullanın.');
}; 