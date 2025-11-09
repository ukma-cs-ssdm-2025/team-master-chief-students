
export const retryRequest = async (
  fn,
  {
    maxRetries = 3,
    delay = 1000,
    factor = 2,
    shouldRetry = () => true,
  } = {}
) => {
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt === maxRetries || !shouldRetry(error)) {
        throw error;
      }

      const currentDelay = delay * Math.pow(factor, attempt);

      await new Promise((resolve) => setTimeout(resolve, currentDelay));
    }
  }

  throw lastError;
};

export const isRetryableError = (error) => {
  if (error.response?.status) {
    const status = error.response.status;
    if (status >= 400 && status < 500) {
      return status === 408 || status === 429;
    }
    return status >= 500;
  }

  return !error.response;
};

export const defaultRetryConfig = {
  maxRetries: 3,
  delay: 1000,
  factor: 2,
  shouldRetry: isRetryableError,
};

