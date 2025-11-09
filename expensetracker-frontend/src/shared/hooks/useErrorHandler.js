import { useState, useCallback } from 'react';

export const useErrorHandler = () => {
  const [errorModal, setErrorModal] = useState(null);

  const handleError = useCallback((error, defaultTitle = 'Error', defaultMessage = 'An error occurred') => {
    const errorMessage = error?.response?.data?.message || error?.message || defaultMessage;
    
    setErrorModal({
      title: defaultTitle,
      message: errorMessage,
      type: 'danger'
    });
  }, []);

  const clearError = useCallback(() => {
    setErrorModal(null);
  }, []);

  const setError = useCallback((title, message, type = 'danger') => {
    setErrorModal({
      title,
      message,
      type
    });
  }, []);

  return {
    errorModal,
    handleError,
    clearError,
    setError
  };
};

