import { useState, useCallback } from "react";

type ToastProps = {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
};

type Toast = ToastProps & {
  id: string;
};

let toastCount = 0;
const listeners: ((toast: Toast) => void)[] = [];

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(
    ({ title, description, variant = "default" }: ToastProps) => {
      const id = `toast-${++toastCount}`;
      const newToast: Toast = { id, title, description, variant };

      setToasts((prev) => [...prev, newToast]);
      listeners.forEach((listener) => listener(newToast));

      // Auto remove after 3s
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);

      return id;
    },
    []
  );

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toast, toasts, dismiss };
};

export const subscribeToToasts = (listener: (toast: Toast) => void) => {
  listeners.push(listener);
  return () => {
    const index = listeners.indexOf(listener);
    if (index > -1) listeners.splice(index, 1);
  };
};
