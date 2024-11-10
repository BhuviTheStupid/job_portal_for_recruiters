import { toast } from 'react-toastify';

export const useToast = () => {
  // Show a toast notification
  const showToast = (message, type = 'success', options = {}) => {
    toast(message, {
      type,
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 5000,  // Default 5 seconds
      ...options, // You can pass additional options if needed
    });
  };

  // Convenience methods for different toast types
  const success = (message, options) => showToast(message, 'success', options);
  const error = (message, options) => showToast(message, 'error', options);
  const info = (message, options) => showToast(message, 'info', options);
  const warn = (message, options) => showToast(message, 'warn', options);

  return { showToast, success, error, info, warn };
};
