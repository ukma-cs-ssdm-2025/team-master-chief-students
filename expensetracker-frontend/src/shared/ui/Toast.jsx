import React, { useEffect } from 'react';
import { Icon } from './Icon';
import { env } from '@shared/config/env';

export const Toast = ({ 
  isOpen, 
  onClose, 
  message, 
  type = 'info',
  duration = env.TOAST_DURATION_MS 
}) => {
  useEffect(() => {
    if (isOpen && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  const getColorClasses = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50 border-green-200',
          text: 'text-green-800',
          icon: 'text-green-600',
          iconName: 'checkCircle'
        };
      case 'error':
        return {
          bg: 'bg-red-50 border-red-200',
          text: 'text-red-800',
          icon: 'text-red-600',
          iconName: 'exclamation'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50 border-yellow-200',
          text: 'text-yellow-800',
          icon: 'text-yellow-600',
          iconName: 'information'
        };
      default:
        return {
          bg: 'bg-blue-50 border-blue-200',
          text: 'text-blue-800',
          icon: 'text-blue-600',
          iconName: 'information'
        };
    }
  };

  const colors = getColorClasses();

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`${colors.bg} border ${colors.text} px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] max-w-md`}>
        <Icon name={colors.iconName} className={`w-5 h-5 ${colors.icon} flex-shrink-0`} />
        <p className="flex-1 text-sm font-medium">{message}</p>
        <button
          onClick={onClose}
          className={`${colors.icon} hover:opacity-70 transition-opacity flex-shrink-0`}
        >
          <Icon name="close" className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

