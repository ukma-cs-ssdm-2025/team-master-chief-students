import { logger } from "./logger";

const ACCOUNTS_STORAGE_KEY = "multiAccounts";
const ACTIVE_ACCOUNT_KEY = "activeAccountId";

export const getAllAccounts = () => {
  try {
    const accountsJson = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    return accountsJson ? JSON.parse(accountsJson) : [];
  } catch (error) {
    logger.error("Error reading accounts:", error);
    return [];
  }
};

const saveAllAccounts = (accounts) => {
  try {
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
  } catch (error) {
    logger.error("Error saving accounts:", error);
  }
};

export const addAccount = (accountData) => {
  const accounts = getAllAccounts();
  const { email, accessToken, refreshToken, userInfo } = accountData;

  const existingIndex = accounts.findIndex((acc) => acc.email === email);

  const account = {
    id: existingIndex >= 0 ? accounts[existingIndex].id : Date.now().toString(),
    email,
    accessToken,
    refreshToken,
    userInfo: userInfo || (existingIndex >= 0 ? accounts[existingIndex].userInfo : null),
    addedAt: existingIndex >= 0 ? accounts[existingIndex].addedAt : new Date().toISOString(),
    lastUsedAt: new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    if (userInfo) {
      accounts[existingIndex] = account;
    } else {
      accounts[existingIndex].accessToken = accessToken;
      accounts[existingIndex].refreshToken = refreshToken;
      accounts[existingIndex].lastUsedAt = new Date().toISOString();
    }
  } else {
    accounts.push(account);
  }

  saveAllAccounts(accounts);
  return account;
};

export const getActiveAccount = () => {
  const activeAccountId = localStorage.getItem(ACTIVE_ACCOUNT_KEY);
  if (!activeAccountId) return null;

  const accounts = getAllAccounts();
  return accounts.find((acc) => acc.id === activeAccountId) || null;
};

export const setActiveAccount = (accountId) => {
  const accounts = getAllAccounts();
  const account = accounts.find((acc) => acc.id === accountId);

  if (!account) {
    logger.error("Account not found:", accountId);
    return false;
  }

  account.lastUsedAt = new Date().toISOString();
  saveAllAccounts(accounts);

  localStorage.setItem(ACTIVE_ACCOUNT_KEY, accountId);
  localStorage.setItem("accessToken", account.accessToken);
  localStorage.setItem("refreshToken", account.refreshToken);

  window.dispatchEvent(new Event("tokenUpdated"));

  return true;
};

export const removeAccount = (accountId) => {
  const accounts = getAllAccounts();
  const filteredAccounts = accounts.filter((acc) => acc.id !== accountId);

  saveAllAccounts(filteredAccounts);

  const activeAccountId = localStorage.getItem(ACTIVE_ACCOUNT_KEY);
  if (activeAccountId === accountId) {
    localStorage.removeItem(ACTIVE_ACCOUNT_KEY);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }

  return filteredAccounts;
};

export const updateActiveAccountTokens = (accessToken, refreshToken) => {
  const activeAccount = getActiveAccount();
  if (!activeAccount) return false;

  activeAccount.accessToken = accessToken;
  activeAccount.refreshToken = refreshToken;
  activeAccount.lastUsedAt = new Date().toISOString();

  const accounts = getAllAccounts();
  const accountIndex = accounts.findIndex((acc) => acc.id === activeAccount.id);
  if (accountIndex >= 0) {
    accounts[accountIndex] = activeAccount;
    saveAllAccounts(accounts);
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    
    window.dispatchEvent(new Event("tokenUpdated"));
    
    return true;
  }

  return false;
};

export const updateAccountUserInfo = (accountId, userInfo) => {
  const accounts = getAllAccounts();
  const accountIndex = accounts.findIndex((acc) => acc.id === accountId);

  if (accountIndex >= 0) {
    accounts[accountIndex].userInfo = userInfo;
    saveAllAccounts(accounts);
    return true;
  }

  return false;
};

export const clearAllAccounts = () => {
  localStorage.removeItem(ACCOUNTS_STORAGE_KEY);
  localStorage.removeItem(ACTIVE_ACCOUNT_KEY);
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

