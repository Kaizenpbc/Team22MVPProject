/**
 * API Key Onboarding Component
 * Guided flow for new users to add their OpenAI API key
 */

import React, { useState } from 'react';
import { Key, ExternalLink, CheckCircle, ArrowRight, X } from 'lucide-react';
import { APIKeySettings } from '../settings/APIKeySettings';

interface APIKeyOnboardingProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const APIKeyOnboarding: React.FC<APIKeyOnboardingProps> = ({
  isOpen,
  onClose,
  onComplete
}) => {
  const [step, setStep] = useState<'intro' | 'instructions' | 'setup'>('intro');
  const [apiKeyAdded, setApiKeyAdded] = useState(false);

  const handleKeySaved = () => {
    setApiKeyAdded(true);
    setStep('setup');
  };

  const handleComplete = () => {
    onComplete();
    onClose();
  };

  const handleSkip = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <Key className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Unlock AI Features
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Add your OpenAI API key to get started
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center gap-2 ${step === 'intro' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                step === 'intro' ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-gray-700'
              }`}>
                1
              </div>
              <span className="text-sm font-medium">Introduction</span>
            </div>
            <div className="w-8 h-px bg-gray-200 dark:bg-gray-700" />
            <div className={`flex items-center gap-2 ${step === 'instructions' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                step === 'instructions' ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-gray-700'
              }`}>
                2
              </div>
              <span className="text-sm font-medium">Instructions</span>
            </div>
            <div className="w-8 h-px bg-gray-200 dark:bg-gray-700" />
            <div className={`flex items-center gap-2 ${step === 'setup' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                step === 'setup' ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-gray-700'
              }`}>
                3
              </div>
              <span className="text-sm font-medium">Setup</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'intro' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Key className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Welcome to Kovari! 🎉
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  To unlock AI-powered workflow features, you'll need to add your OpenAI API key.
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  🤖 What you'll get with AI features:
                </h4>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Smart workflow parsing from text</li>
                  <li>• AI-powered gap detection and suggestions</li>
                  <li>• Intelligent workflow optimization</li>
                  <li>• AI chat assistance</li>
                  <li>• Advanced analytics and insights</li>
                </ul>
              </div>

              <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                  💰 Transparent Pricing:
                </h4>
                <p className="text-sm text-green-800 dark:text-green-200">
                  You pay OpenAI directly (~$0.02 per workflow) + our simple platform fee. 
                  No markup, no hidden costs!
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('instructions')}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={handleSkip}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Skip for now
                </button>
              </div>
            </div>
          )}

          {step === 'instructions' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  How to get your OpenAI API key
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Follow these simple steps to get your API key
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                    1
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Go to OpenAI Platform
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Visit the OpenAI API keys page
                    </p>
                    <a
                      href="https://platform.openai.com/api-keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline text-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Open OpenAI Platform
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                    2
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Sign in or create account
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Use your existing OpenAI account or create a new one
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                    3
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Create new secret key
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Click "Create new secret key" and give it a name like "Kovari"
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                    4
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Copy the key
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Copy the generated API key (starts with "sk-") - you won't see it again!
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                  ⚠️ Important Security Note
                </h4>
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  Your API key is stored locally in your browser and never sent to our servers. 
                  You can remove it anytime from your settings.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('setup')}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  I have my API key
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setStep('intro')}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Back
                </button>
              </div>
            </div>
          )}

          {step === 'setup' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Add your API key
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Paste your OpenAI API key below
                </p>
              </div>

              <APIKeySettings
                onKeySaved={handleKeySaved}
                showInstructions={false}
              />

              {apiKeyAdded && (
                <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                    <div>
                      <h4 className="font-semibold text-green-900 dark:text-green-100">
                        🎉 Perfect! Your API key is ready
                      </h4>
                      <p className="text-sm text-green-800 dark:text-green-200">
                        You can now use all AI features in Kovari
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleComplete}
                  disabled={!apiKeyAdded}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {apiKeyAdded ? 'Start using AI features!' : 'Add your API key first'}
                </button>
                <button
                  onClick={() => setStep('instructions')}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Back
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
