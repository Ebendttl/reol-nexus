"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { X, Info, CheckCircle, AlertTriangle } from "lucide-react";

type ToastType = "info" | "success" | "warning";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-remove after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed bottom-6 left-4 right-4 md:left-auto md:right-6 z-[9999] flex flex-col gap-3 md:max-w-md md:w-full pointer-events-none">
        {toasts.map((toast) => {
          const typeStyles = {
            success: "bg-white dark:bg-[#111612] border-l-4 border-emerald-500 text-[#17221A] dark:text-[#E2EAE4] shadow-xl",
            warning: "bg-white dark:bg-[#111612] border-l-4 border-[#D4AF37] text-[#17221A] dark:text-[#E2EAE4] shadow-xl",
            info: "bg-white dark:bg-[#111612] border-l-4 border-[#0F5132] text-[#17221A] dark:text-[#E2EAE4] shadow-xl",
          };

          const Icon = {
            success: CheckCircle,
            warning: AlertTriangle,
            info: Info,
          }[toast.type];

          const iconColor = {
            success: "text-emerald-500",
            warning: "text-[#D4AF37]",
            info: "text-[#0F5132] dark:text-[#38C186]",
          }[toast.type];

          return (
            <div
              key={toast.id}
              className={`flex items-center justify-between p-4 rounded-lg border border-[#E2EAE4]/50 dark:border-[#1E2720]/50 pointer-events-auto animate-slide-in ${typeStyles[toast.type]}`}
              role="alert"
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 shrink-0 ${iconColor}`} />
                <span className="text-sm font-semibold tracking-wide">{toast.message}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-[#5C6E62] dark:text-[#90A496] transition-colors ml-4 focus:outline-none"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      <style jsx global>{`
        @keyframes slideIn {
          from {
            transform: translateY(1rem);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
