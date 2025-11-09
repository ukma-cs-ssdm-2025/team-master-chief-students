import { useState, useEffect, useCallback } from "react";
import {
  getAllAccounts,
  getActiveAccount,
  setActiveAccount,
  addAccount,
  removeAccount,
  updateAccountUserInfo,
  clearAllAccounts,
  logger,
} from "@shared/lib";
import { axiosInstance } from "@shared/api/axiosInstance";
import { API_ENDPOINTS } from "@shared/config";

export const useMultiAccount = () => {
  const [accounts, setAccounts] = useState([]);
  const [activeAccount, setActiveAccountState] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = useCallback(() => {
    const allAccounts = getAllAccounts();
    const active = getActiveAccount();
    setAccounts(allAccounts);
    setActiveAccountState(active);
  }, []);

  const addAccountAfterAuth = useCallback(
    async (email, accessToken, refreshToken) => {
      setLoading(true);
      try {
        let userInfo = null;
        try {
          const response = await axiosInstance.get(API_ENDPOINTS.AUTH.ME, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          userInfo = response.data;
        } catch (err) {
          logger.error("Failed to fetch user info:", err);
        }

        const account = addAccount({
          email,
          accessToken,
          refreshToken,
          userInfo,
        });

        setActiveAccount(account.id);

        loadAccounts();
        return account;
      } catch (error) {
        logger.error("Error adding account:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [loadAccounts]
  );

  const switchAccount = useCallback(
    async (accountId) => {
      const success = setActiveAccount(accountId);
      if (success) {
        try {
          const { data } = await axiosInstance.get(API_ENDPOINTS.AUTH.ME);
          updateAccountUserInfo(accountId, data);
        } catch (error) {
          logger.error("Error updating user info:", error);
        }
        loadAccounts();
        window.location.reload();
      }
      return success;
    },
    [loadAccounts]
  );

  const deleteAccount = useCallback(
    (accountId) => {
      removeAccount(accountId);
      loadAccounts();
    },
    [loadAccounts]
  );

  const updateUserInfo = useCallback(
    async (accountId) => {
      try {
        const { data } = await axiosInstance.get(API_ENDPOINTS.AUTH.ME);
        updateAccountUserInfo(accountId, data);
        loadAccounts();
      } catch (error) {
        logger.error("Error updating user info:", error);
      }
    },
    [loadAccounts]
  );

  const logoutAll = useCallback(() => {
    clearAllAccounts();
    setAccounts([]);
    setActiveAccountState(null);
  }, []);

  return {
    accounts,
    activeAccount,
    loading,
    addAccountAfterAuth,
    switchAccount,
    deleteAccount,
    updateUserInfo,
    logoutAll,
    refreshAccounts: loadAccounts,
  };
};

