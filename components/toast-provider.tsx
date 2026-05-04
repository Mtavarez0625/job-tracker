"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

type ToastType = "success" | "error";

type Toast = {
  id: number;
  message: string;
  type: ToastType;
  leaving: boolean;
};

type ToastContextValue = {
  addToast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextValue>({ addToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (message: string, type: ToastType = "success") => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, message, type, leaving: false }]);

      // Start exit animation at 2.7s
      setTimeout(() => {
        setToasts((prev) =>
          prev.map((t) => (t.id === id ? { ...t, leaving: true } : t))
        );
      }, 2700);

      // Remove from DOM at 3s
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    },
    []
  );

  function dismiss(id: number) {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, leaving: true } : t))
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 300);
  }

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto transition duration-300 ${
              toast.leaving
                ? "translate-x-3 opacity-0"
                : "animate-toast-enter"
            }`}
          >
            <div className="flex min-w-[240px] items-start gap-3 rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 shadow-2xl">
              {toast.type === "error" ? (
                <XCircle
                  size={16}
                  className="mt-0.5 shrink-0 text-red-400"
                />
              ) : (
                <CheckCircle
                  size={16}
                  className="mt-0.5 shrink-0 text-green-400"
                />
              )}
              <span className="flex-1 text-sm text-neutral-200">
                {toast.message}
              </span>
              <button
                onClick={() => dismiss(toast.id)}
                className="ml-1 shrink-0 text-neutral-500 transition hover:text-neutral-300"
                aria-label="Dismiss"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
