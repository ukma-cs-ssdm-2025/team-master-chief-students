// src/shared/ui/ConfirmModal.jsx
import React, { useId } from "react";
import { Modal } from "./Modal";
import { Icon } from "./Icon";

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger"
}) => {
  const titleId = useId();
  const messageId = useId();

  if (!isOpen) return null;

  const getColorClasses = () => {
    switch (type) {
      case "danger":
        return {
          button: "bg-red-500 hover:bg-red-600",
          icon: "text-red-600",
          iconBg: "bg-red-100"
        };
      case "warning":
        return {
          button: "bg-yellow-500 hover:bg-yellow-600",
          icon: "text-yellow-600",
          iconBg: "bg-yellow-100"
        };
      case "info":
        return {
          button: "bg-blue-500 hover:bg-blue-600",
          icon: "text-blue-600",
          iconBg: "bg-blue-100"
        };
      default:
        return {
          button: "bg-red-500 hover:bg-red-600",
          icon: "text-red-600",
          iconBg: "bg-red-100"
        };
    }
  };

  const colors = getColorClasses();

  const getIconName = () => {
    switch (type) {
      case "danger":
        return "exclamation";
      case "warning":
        return "information";
      case "info":
        return "information";
      default:
        return "exclamation";
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  const showCancelButton = cancelText && cancelText.trim() !== "";

  return (
    <Modal onClose={onClose} ariaLabelledBy={titleId} ariaDescribedBy={messageId}>
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-start gap-4">
          <div className={`flex-shrink-0 w-12 h-12 rounded-full ${colors.iconBg} flex items-center justify-center`} aria-hidden="true">
            <Icon name={getIconName()} className={`w-6 h-6 ${colors.icon}`} />
          </div>

          <div className="flex-1">
            <h3 id={titleId} className="text-lg font-semibold text-gray-900 mb-2">
              {title}
            </h3>
            <p id={messageId} className="text-gray-600 text-sm whitespace-pre-line">
              {message}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6">
          {showCancelButton && (
            <button
              onClick={onClose}
              aria-label={`Cancel ${title.toLowerCase()}`}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={handleConfirm}
            aria-label={`Confirm ${title.toLowerCase()}`}
            className={`px-4 py-2 text-white rounded-lg transition-colors font-medium ${colors.button}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};