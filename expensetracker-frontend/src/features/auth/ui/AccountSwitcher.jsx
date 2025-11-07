import React, { useState, useRef, useEffect } from "react";
import { useMultiAccount } from "../model/useMultiAccount";
import { useNavigate } from "react-router-dom";

export const AccountSwitcher = () => {
  const { accounts, activeAccount, switchAccount, deleteAccount } = useMultiAccount();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!activeAccount || accounts.length === 0) {
    return null;
  }

  const getInitials = (email, username) => {
    if (username) {
      return username.charAt(0).toUpperCase();
    }
    return email?.charAt(0).toUpperCase() || "?";
  };

  const handleSwitchAccount = (accountId) => {
    switchAccount(accountId);
    setIsOpen(false);
  };

  const handleDeleteAccount = (e, accountId) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to remove this account?")) {
      deleteAccount(accountId);
      if (activeAccount.id === accountId && accounts.length > 1) {
        const remainingAccounts = accounts.filter((acc) => acc.id !== accountId);
        if (remainingAccounts.length > 0) {
          switchAccount(remainingAccounts[0].id);
        }
      }
    }
  };

  const handleAddAccount = () => {
    setIsOpen(false);
    navigate("/login");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
          {getInitials(activeAccount.email, activeAccount.userInfo?.data?.username)}
        </div>
        <div className="hidden md:block text-left">
          <div className="text-sm font-medium text-gray-700">
            {activeAccount.userInfo?.data?.username || activeAccount.email.split("@")[0]}
          </div>
          <div className="text-xs text-gray-500">{activeAccount.email}</div>
        </div>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
          <div className="p-2">
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Accounts ({accounts.length})
            </div>

            {accounts.map((account) => (
              <div
                key={account.id}
                onClick={() => handleSwitchAccount(account.id)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                  account.id === activeAccount.id
                    ? "bg-blue-50 border border-blue-200"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                    {getInitials(account.email, account.userInfo?.data?.username)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {account.userInfo?.data?.username || account.email.split("@")[0]}
                    </div>
                    <div className="text-xs text-gray-500 truncate">{account.email}</div>
                  </div>
                  {account.id === activeAccount.id && (
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                  )}
                </div>
                {accounts.length > 1 && (
                  <button
                    onClick={(e) => handleDeleteAccount(e, account.id)}
                    className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                    title="Remove account"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))}

            <div className="border-t border-gray-200 mt-2 pt-2">
              <button
                onClick={handleAddAccount}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-700"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

