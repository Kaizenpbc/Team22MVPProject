/**
 * API Key Status Component
 * Shows the current API key status in header/dashboard
 */

import React, { useState, useEffect } from 'react';
import { Key, CheckCircle, AlertCircle, Settings } from 'lucide-react';

interface APIKeyStatusProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  onClick?: () => void;
}

export const APIKeyStatus: React.FC<APIKeyStatusProps> = ({ 
  size = 'md', 
  showText = true,
  onClick 
}) => {
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const checkApiKey = () => {
      const apiKey = localStorage.getItem('openai_api_key');
      setHasApiKey(!!apiKey);
      setIsValid(!!apiKey); // In a real app, you'd validate this
    };

    checkApiKey();
    
    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'openai_api_key') {
        checkApiKey();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'px-2 py-1',
          icon: 'w-3 h-3',
          text: 'text-xs'
        };
      case 'lg':
        return {
          container: 'px-4 py-2',
          icon: 'w-5 h-5',
          text: 'text-base'
        };
      default: // md
        return {
          container: 'px-3 py-1.5',
          icon: 'w-4 h-4',
          text: 'text-sm'
        };
    }
  };

  const sizeClasses = getSizeClasses();

  if (!hasApiKey) {
    return (
      <button
        onClick={onClick}
        className={`flex items-center gap-2 ${sizeClasses.container} bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900 dark:hover:bg-yellow-800 text-yellow-800 dark:text-yellow-200 rounded-lg transition-colors border border-yellow-300 dark:border-yellow-700`}
      >
        <AlertCircle className={`${sizeClasses.icon} text-yellow-600 dark:text-yellow-400`} />
        {showText && (
          <span className={`${sizeClasses.text} font-medium`}>
            Add API Key
          </span>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 ${sizeClasses.container} bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800 text-green-800 dark:text-green-200 rounded-lg transition-colors border border-green-300 dark:border-green-700`}
    >
      <CheckCircle className={`${sizeClasses.icon} text-green-600 dark:text-green-400`} />
      {showText && (
        <span className={`${sizeClasses.text} font-medium`}>
          AI Ready
        </span>
      )}
    </button>
  );
};

/**
 * Compact API Key Status for Headers
 */
export const APIKeyStatusCompact: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    const checkApiKey = () => {
      const apiKey = localStorage.getItem('openai_api_key');
      setHasApiKey(!!apiKey);
    };

    checkApiKey();
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'openai_api_key') {
        checkApiKey();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-lg transition-colors ${
        hasApiKey
          ? 'bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800 text-green-600 dark:text-green-400'
          : 'bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900 dark:hover:bg-yellow-800 text-yellow-600 dark:text-yellow-400'
      }`}
      title={hasApiKey ? 'API Key Configured' : 'Add API Key for AI Features'}
    >
      <Key className="w-4 h-4" />
    </button>
  );
};

/**
 * API Key Status Badge for Cards
 */
export const APIKeyStatusBadge: React.FC = () => {
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    const checkApiKey = () => {
      const apiKey = localStorage.getItem('openai_api_key');
      setHasApiKey(!!apiKey);
    };

    checkApiKey();
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'openai_api_key') {
        checkApiKey();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
      hasApiKey
        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    }`}>
      {hasApiKey ? (
        <>
          <CheckCircle className="w-3 h-3" />
          AI Enabled
        </>
      ) : (
        <>
          <AlertCircle className="w-3 h-3" />
          No API Key
        </>
      )}
    </div>
  );
};
