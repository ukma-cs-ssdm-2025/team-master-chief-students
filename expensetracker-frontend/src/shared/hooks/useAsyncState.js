import { useState, useCallback } from 'react';

export const useAsyncState = (initialState = {}) => {
  const [state, setState] = useState({
    loading: false,
    error: null,
    ...initialState,
  });

  const setLoading = useCallback((loading) => {
    setState((prev) => ({ ...prev, loading, error: loading ? null : prev.error }));
  }, []);

  const setError = useCallback((error) => {
    setState((prev) => ({ ...prev, error, loading: false }));
  }, []);

  const reset = useCallback(() => {
    setState({ loading: false, error: null, ...initialState });
  }, [initialState]);

  const execute = useCallback(async (asyncFn) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const result = await asyncFn();
      setState((prev) => ({ ...prev, loading: false, error: null }));
      return result;
    } catch (error) {
      setState((prev) => ({ ...prev, loading: false, error }));
      throw error;
    }
  }, []);

  return {
    ...state,
    setLoading,
    setError,
    reset,
    execute,
  };
};

