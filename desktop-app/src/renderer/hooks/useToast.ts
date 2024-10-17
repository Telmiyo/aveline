import { useState, useEffect } from 'react';

interface ToastOptions {
  message: string;
  duration?: number;
}

function useToast() {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [duration, setDuration] = useState(4000);

  const showToast = (options: ToastOptions) => {
    setMessage(options.message);
    setDuration(options.duration || 4000);
    setIsVisible(true);
  };

  useEffect(() => {
    let timer: number;

    if (isVisible) {
      timer = window.setTimeout(() => {
        setIsVisible(false);
      }, duration);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [isVisible, duration]);

  return { isVisible, message, showToast };
}

export default useToast;
