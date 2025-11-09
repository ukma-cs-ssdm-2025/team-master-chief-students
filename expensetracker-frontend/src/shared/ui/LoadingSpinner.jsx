import React from 'react';

export const LoadingSpinner = ({ 
  size = 'md', 
  className = '',
  text = null,
  fullScreen = false 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-4',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4'
  };

  const spinner = (
    <div className={`flex items-center justify-center ${fullScreen ? 'min-h-screen' : ''} ${className}`}>
      <div className="flex flex-col items-center gap-3">
        <div className={`${sizeClasses[size]} border-blue-500 border-t-transparent rounded-full animate-spin`} />
        {text && (
          <p className="text-sm text-gray-500">{text}</p>
        )}
      </div>
    </div>
  );

  return spinner;
};

