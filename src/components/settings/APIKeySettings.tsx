/**
 * API Key Settings Component
 * Secure management of user's OpenAI API key for BYOK (Bring Your Own Key) model
 */

import React, { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, CheckCircle, AlertCircle, ExternalLink, Copy } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface APIKeySettingsProps {
  onKeySaved?: () => void;
  showInstructions?: boolean;
}

export const APIKeySettings: React.FC<APIKeySettingsProps> = ({ 
  onKeySaved, 
  showInstructions = true 
}) => {
  const { user } = useAuth();
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'valid' | 'invalid' | 'error'>('idle');
  const [validationMessage, setValidationMessage] = useState('');

  // Load existing API key on mount (masked)
  useEffect(() => {
    const existingKey = localStorage.getItem('openai_api_key');
    if (existingKey) {
      setApiKey(existingKey);
      setValidationStatus('valid');
      setValidationMessage('API key is configured and ready to use');
    }
  }, []);

  const validateAPIKey = async (key: string): Promise<boolean> => {
    if (!key || key.length < 20) {
      setValidationStatus('invalid');
      setValidationMessage('API key appears to be invalid (too short)');
      return false;
    }

    if (!key.startsWith('sk-')) {
      setValidationStatus('invalid');
      setValidationMessage('OpenAI API keys should start with "sk-"');
      return false;
    }

    setIsValidating(true);
    setValidationStatus('idle');

    try {
      // Test the API key with a simple request
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setValidationStatus('valid');
        setValidationMessage('✅ API key is valid and ready to use');
        return true;
      } else if (response.status === 401) {
        setValidationStatus('invalid');
        setValidationMessage('❌ Invalid API key - please check your key');
        return false;
      } else {
        setValidationStatus('error');
        setValidationMessage('⚠️ Unable to validate API key - please try again');
        return false;
      }
    } catch (error) {
      setValidationStatus('error');
      setValidationMessage('⚠️ Network error - please check your connection');
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const handleSaveKey = async () => {
    if (!apiKey.trim()) {
      setValidationStatus('invalid');
      setValidationMessage('Please enter your OpenAI API key');
      return;
    }

    const isValid = await validateAPIKey(apiKey.trim());
    
    if (isValid) {
      // Store the API key securely
      localStorage.setItem('openai_api_key', apiKey.trim());
      setValidationMessage('✅ API key saved successfully!');
      
      // Call callback if provided
      if (onKeySaved) {
        onKeySaved();
      }
    }
  };

  const handleRemoveKey = () => {
    localStorage.removeItem('openai_api_key');
    setApiKey('');
    setValidationStatus('idle');
    setValidationMessage('');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const maskedKey = apiKey ? `${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}` : '';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
          <Key className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            OpenAI API Key
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Bring your own API key for AI features
          </p>
        </div>
      </div>

      {showInstructions && (
        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            📋 How to get your OpenAI API key:
          </h3>
          <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>1. Go to <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">OpenAI Platform</a></li>
            <li>2. Sign in or create an account</li>
            <li>3. Click "Create new secret key"</li>
            <li>4. Copy the key and paste it below</li>
            <li>5. Your key is stored locally and never sent to our servers</li>
          </ol>
        </div>
      )}

      <div className="space-y-4">
        {/* API Key Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Your OpenAI API Key
          </label>
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full px-4 py-3 pr-20 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              disabled={isValidating}
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              disabled={!apiKey}
            >
              {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
            {apiKey && (
              <button
                type="button"
                onClick={() => copyToClipboard(apiKey)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                title="Copy to clipboard"
              >
                <Copy className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Validation Status */}
        {validationMessage && (
          <div className={`flex items-center gap-2 p-3 rounded-lg ${
            validationStatus === 'valid' 
              ? 'bg-green-50 dark:bg-green-950 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800'
              : validationStatus === 'invalid'
              ? 'bg-red-50 dark:bg-red-950 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
              : 'bg-yellow-50 dark:bg-yellow-950 text-yellow-800 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800'
          }`}>
            {validationStatus === 'valid' ? (
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="text-sm font-medium">{validationMessage}</span>
          </div>
        )}

        {/* Current Key Display (if saved) */}
        {localStorage.getItem('openai_api_key') && !showKey && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Current API Key:
            </p>
            <div className="flex items-center justify-between">
              <code className="text-sm font-mono text-gray-800 dark:text-gray-200">
                {maskedKey}
              </code>
              <button
                onClick={() => copyToClipboard(maskedKey)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                title="Copy masked key"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleSaveKey}
            disabled={!apiKey.trim() || isValidating}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isValidating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Validating...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Save API Key
              </>
            )}
          </button>

          {localStorage.getItem('openai_api_key') && (
            <button
              onClick={handleRemoveKey}
              className="px-4 py-3 border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors"
            >
              Remove
            </button>
          )}
        </div>

        {/* Pricing Info */}
        <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
            💰 Transparent Pricing
          </h4>
          <p className="text-sm text-green-800 dark:text-green-200">
            You pay OpenAI directly for AI usage (~$0.02 per workflow), 
            plus our simple platform fee. No markup, no hidden costs.
          </p>
        </div>

        {/* Security Note */}
        <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
            🔒 Security & Privacy
          </h4>
          <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1">
            <li>• Your API key is stored locally in your browser</li>
            <li>• Never transmitted to our servers</li>
            <li>• You can remove it anytime</li>
            <li>• We never see or store your key</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
