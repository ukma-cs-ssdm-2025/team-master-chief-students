import { useState, useEffect } from 'react';
import { env } from '@shared/config/env';

export const useDebounce = (value, delay = env.DEBOUNCE_DELAY_MS) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

