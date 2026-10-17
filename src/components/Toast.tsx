import React, { useEffect } from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose, duration = 4000 }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-bounce">
      <div className="bg-saffron text-white border-4 border-black shadow-brutal px-5 py-3 rounded-xl flex items-center gap-3 font-semibold">
        <AlertCircle className="w-6 h-6 flex-shrink-0 text-black" />
        <span className="text-sm md:text-base text-black">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 bg-black text-white rounded-full p-1 hover:bg-gray-800"
          aria-label="Close notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
