import { logger } from "./logger";

export const decodeJWT = (token) => {
  if (!token) return null;

  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch (error) {
    logger.error('Error decoding JWT:', error);
    return null;
  }
};

export const isTokenExpired = (token) => {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return true;

  const expirationTime = decoded.exp * 1000;
  const currentTime = Date.now();

  return currentTime >= expirationTime;
};

export const isTokenExpiringSoon = (token, bufferMinutes = 2) => {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return true;

  const expirationTime = decoded.exp * 1000;
  const currentTime = Date.now();
  const bufferTime = bufferMinutes * 60 * 1000;

  return (expirationTime - currentTime) <= bufferTime;
};

export const getTokenExpirationTime = (token) => {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return null;

  return decoded.exp * 1000;
};

