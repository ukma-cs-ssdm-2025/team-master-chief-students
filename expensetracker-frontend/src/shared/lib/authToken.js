import { getActiveAccount } from './multiAccountStorage';

export const getAuthToken = () => {
  const activeAccount = getActiveAccount();
  return activeAccount?.accessToken || localStorage.getItem('accessToken');
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};

