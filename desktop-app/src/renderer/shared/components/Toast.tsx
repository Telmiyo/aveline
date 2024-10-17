import React from 'react';

interface ToastProps {
  message: string;
  isVisible: boolean;
}

function Toast({ message, isVisible }: ToastProps) {
  if (!isVisible) return null;

  return (
    <div
      className="fixed bottom-4 right-4 p-4 bg-gray-800 text-white rounded shadow-lg"
      style={{ transition: 'opacity 0.5s', opacity: isVisible ? 1 : 0 }}
    >
      {message}
    </div>
  );
}

export default Toast;
